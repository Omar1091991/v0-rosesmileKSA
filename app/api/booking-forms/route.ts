import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const formResult = await db.query("SELECT * FROM booking_forms WHERE id = $1", [id])
      if (formResult.rows.length === 0) {
        return NextResponse.json({ error: "النموذج غير موجود" }, { status: 404 })
      }

      const servicesResult = await db.query(
        `
        SELECT s.id, s.title_ar, s.title_en
        FROM booking_form_services bfs
        JOIN services s ON bfs.service_id = s.id
        WHERE bfs.booking_form_id = $1
      `,
        [id],
      )

      const dbForm = formResult.rows[0]
      const fields = typeof dbForm.fields === "string" ? JSON.parse(dbForm.fields) : dbForm.fields || {}
      const customServices = fields.custom_services || []

      const form = {
        ...dbForm,
        name_ar: dbForm.title_ar,
        name_en: dbForm.title_en,
        custom_services: customServices,
        booking_form_services: servicesResult.rows.map((s) => ({ service_id: s.id, services: s })),
      }

      return NextResponse.json(form)
    }

    const formsResult = await db.query("SELECT * FROM booking_forms ORDER BY order_index")
    const forms = []

    for (const dbForm of formsResult.rows) {
      const servicesResult = await db.query(
        `
        SELECT s.id, s.title_ar, s.title_en
        FROM booking_form_services bfs
        JOIN services s ON bfs.service_id = s.id
        WHERE bfs.booking_form_id = $1
      `,
        [dbForm.id],
      )

      const fields = typeof dbForm.fields === "string" ? JSON.parse(dbForm.fields) : dbForm.fields || {}
      const customServices = fields.custom_services || []

      forms.push({
        ...dbForm,
        name_ar: dbForm.title_ar,
        name_en: dbForm.title_en,
        custom_services: customServices,
        booking_form_services: servicesResult.rows.map((s) => ({ service_id: s.id, services: s })),
      })
    }

    return NextResponse.json(forms)
  } catch (error: any) {
    console.error("[v0] Error fetching booking forms:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { service_ids, custom_services, ...formData } = body

    console.log("[v0] Creating booking form with data:", formData)

    if (formData.is_main) {
      await db.query("UPDATE booking_forms SET is_main = false WHERE is_main = true")
    }

    const fields = typeof formData.fields === "string" ? JSON.parse(formData.fields) : formData.fields || {}
    fields.custom_services = custom_services || []

    const result = await db.query(
      `
      INSERT INTO booking_forms (title_ar, title_en, description_ar, description_en, image_url, fields, is_main, is_active, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        formData.title_ar || formData.name_ar,
        formData.title_en || formData.name_en,
        formData.description_ar,
        formData.description_en,
        formData.image_url || null,
        JSON.stringify(fields),
        formData.is_main || false,
        formData.is_active !== false,
        formData.order_index || 0,
      ],
    )

    const form = result.rows[0]

    if (service_ids && service_ids.length > 0) {
      for (const service_id of service_ids) {
        await db.query("INSERT INTO booking_form_services (booking_form_id, service_id) VALUES ($1, $2)", [
          form.id,
          service_id,
        ])
      }
    }

    return NextResponse.json(form)
  } catch (error: any) {
    console.error("[v0] Error creating booking form:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, service_ids, custom_services, ...formData } = body

    const fieldMapping: Record<string, string> = {
      name_ar: "title_ar",
      name_en: "title_en",
      title_ar: "title_ar",
      title_en: "title_en",
      description_ar: "description_ar",
      description_en: "description_en",
      image_url: "image_url",
      fields: "fields",
      is_main: "is_main",
      is_active: "is_active",
      order_index: "order_index",
    }

    if (formData.is_main) {
      await db.query("UPDATE booking_forms SET is_main = false WHERE is_main = true AND id != $1", [id])
    }

    const dbFields: string[] = []
    const dbValues: any[] = []

    Object.entries(formData).forEach(([key, value]) => {
      const dbColumn = fieldMapping[key]
      if (dbColumn) {
        dbFields.push(dbColumn)
        dbValues.push(value)
      }
    })

    if (custom_services !== undefined) {
      const currentForm = await db.query("SELECT fields FROM booking_forms WHERE id = $1", [id])
      const currentFields = currentForm.rows[0]?.fields || {}
      const fields = typeof currentFields === "string" ? JSON.parse(currentFields) : currentFields
      fields.custom_services = custom_services

      const fieldsIndex = dbFields.indexOf("fields")
      if (fieldsIndex >= 0) {
        dbValues[fieldsIndex] = JSON.stringify(fields)
      } else {
        dbFields.push("fields")
        dbValues.push(JSON.stringify(fields))
      }
    }

    if (dbFields.length === 0) {
      return NextResponse.json({ error: "لا توجد حقول للتحديث" }, { status: 400 })
    }

    const setClause = dbFields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await db.query(
      `UPDATE booking_forms SET ${setClause}, updated_at = NOW() WHERE id = $${dbFields.length + 1} RETURNING *`,
      [...dbValues, id],
    )

    if (service_ids !== undefined) {
      await db.query("DELETE FROM booking_form_services WHERE booking_form_id = $1", [id])

      if (service_ids.length > 0) {
        for (const service_id of service_ids) {
          await db.query("INSERT INTO booking_form_services (booking_form_id, service_id) VALUES ($1, $2)", [
            id,
            service_id,
          ])
        }
      }
    }

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error updating booking form:", error)
    console.log("[v0] ❌ خطأ في الاستعلام:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    await db.query("DELETE FROM booking_forms WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting booking form:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
