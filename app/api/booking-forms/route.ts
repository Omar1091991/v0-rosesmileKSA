import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createGoogleSheet } from "@/lib/google-sheets"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const formResult = await db.query("SELECT * FROM booking_forms WHERE id = $1", [id])
      if (formResult.rows.length === 0) {
        return NextResponse.json({ error: "النموذج غير موجود" }, { status: 404 })
      }

      const dbForm = formResult.rows[0]

      let servicesResult = { rows: [] }
      if (dbForm.services && dbForm.services.length > 0) {
        servicesResult = await db.query(
          `
          SELECT s.id, s.title_ar, s.title_en
          FROM services s
          WHERE s.id = ANY($1)
        `,
          [dbForm.services],
        )
      }

      const customServices = dbForm.fields?.custom_services || []

      const form = {
        ...dbForm,
        custom_services: customServices,
        booking_form_services: servicesResult.rows.map((s) => ({ service_id: s.id, services: s })),
      }

      return NextResponse.json(form)
    }

    const formsResult = await db.query("SELECT * FROM booking_forms ORDER BY order_index")
    const forms = []

    for (const dbForm of formsResult.rows) {
      let servicesResult = { rows: [] }
      if (dbForm.services && dbForm.services.length > 0) {
        servicesResult = await db.query(
          `
          SELECT s.id, s.title_ar, s.title_en
          FROM services s
          WHERE s.id = ANY($1)
        `,
          [dbForm.services],
        )
      }

      const customServices = dbForm.fields?.custom_services || []

      forms.push({
        ...dbForm,
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
    console.log("[v0] Custom services:", custom_services)

    if (formData.is_main) {
      await db.query("UPDATE booking_forms SET is_main = false WHERE is_main = true")
    }

    const fields = {
      ...(formData.fields || {}),
      custom_services: custom_services || [],
    }

    console.log("[v0] Creating Google Sheet for new booking form...")
    const sheetResult = await createGoogleSheet(formData.name_ar || "نموذج حجز جديد")

    if (!sheetResult.success) {
      console.warn("[v0] ⚠️ Could not create Google Sheet, continuing without it")
    }

    const result = await db.query(
      `
      INSERT INTO booking_forms (name_ar, name_en, title_ar, title_en, description_ar, description_en, image_url, services, fields, is_main, is_active, order_index, google_sheet_id, google_sheet_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `,
      [
        formData.name_ar,
        formData.name_en || formData.name_ar,
        formData.title_ar,
        formData.title_en || formData.title_ar,
        formData.description_ar,
        formData.description_en,
        formData.image_url || null,
        JSON.stringify(service_ids || []),
        JSON.stringify(fields),
        formData.is_main || false,
        formData.is_active !== false,
        formData.order_index || 0,
        sheetResult.spreadsheetId || null,
        sheetResult.spreadsheetUrl || null,
      ],
    )

    console.log("[v0] ✅ Booking form created with Google Sheet:", {
      formId: result.rows[0].id,
      googleSheetUrl: result.rows[0].google_sheet_url,
    })

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error creating booking form:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, service_ids, custom_services, ...formData } = body

    console.log("[v0] Updating booking form:", id)
    console.log("[v0] Custom services:", custom_services)

    const fieldMapping: Record<string, string> = {
      name_ar: "name_ar",
      name_en: "name_en",
      title_ar: "title_ar",
      title_en: "title_en",
      description_ar: "description_ar",
      description_en: "description_en",
      image_url: "image_url",
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

    if (service_ids !== undefined) {
      dbFields.push("services")
      dbValues.push(JSON.stringify(service_ids))
    }

    if (custom_services !== undefined) {
      // Get existing fields first
      const existingForm = await db.query("SELECT fields FROM booking_forms WHERE id = $1", [id])
      const existingFields = existingForm.rows[0]?.fields || {}

      const updatedFields = {
        ...existingFields,
        custom_services: custom_services,
      }

      dbFields.push("fields")
      dbValues.push(JSON.stringify(updatedFields))
    }

    if (dbFields.length === 0) {
      return NextResponse.json({ error: "لا توجد حقول للتحديث" }, { status: 400 })
    }

    const setClause = dbFields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await db.query(
      `UPDATE booking_forms SET ${setClause}, updated_at = NOW() WHERE id = $${dbFields.length + 1} RETURNING *`,
      [...dbValues, id],
    )

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
