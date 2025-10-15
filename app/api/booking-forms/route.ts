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

      const form = {
        ...formResult.rows[0],
        booking_form_services: servicesResult.rows.map((s) => ({ services: s })),
      }

      return NextResponse.json(form)
    }

    const formsResult = await db.query("SELECT * FROM booking_forms ORDER BY order_index")
    const forms = []

    for (const form of formsResult.rows) {
      const servicesResult = await db.query(
        `
        SELECT s.id, s.title_ar, s.title_en
        FROM booking_form_services bfs
        JOIN services s ON bfs.service_id = s.id
        WHERE bfs.booking_form_id = $1
      `,
        [form.id],
      )

      forms.push({
        ...form,
        booking_form_services: servicesResult.rows.map((s) => ({ services: s })),
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
    const { service_ids, ...formData } = body

    console.log("[v0] Creating booking form with data:", formData)

    if (formData.is_main) {
      await db.query("UPDATE booking_forms SET is_main = false WHERE is_main = true")
    }

    const result = await db.query(
      `
      INSERT INTO booking_forms (name_ar, name_en, description_ar, description_en, image_url, is_main, is_active, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
      [
        formData.name_ar,
        formData.name_en,
        formData.description_ar,
        formData.description_en,
        formData.image_url,
        formData.is_main,
        formData.is_active,
        formData.order_index,
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
    const { id, service_ids, ...formData } = body

    if (formData.is_main) {
      await db.query("UPDATE booking_forms SET is_main = false WHERE is_main = true AND id != $1", [id])
    }

    const fields = Object.keys(formData)
    const values = Object.values(formData)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await db.query(
      `UPDATE booking_forms SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id],
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
