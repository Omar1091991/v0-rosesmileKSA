import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorIdParam = searchParams.get("doctor_id")

    let query = "SELECT * FROM doctor_cases"
    const params: any[] = []

    if (doctorIdParam) {
      const doctorId = Number.parseInt(doctorIdParam, 10)
      if (isNaN(doctorId)) {
        return NextResponse.json({ error: "Invalid doctor_id parameter" }, { status: 400 })
      }
      query += " WHERE doctor_id = $1"
      params.push(doctorId)
    }

    query += " ORDER BY order_index ASC"

    console.log("[v0] الاستعلام:", query)
    const result = await db.query(query, params)
    console.log("[v0] ✅ نجح الاستعلام - عدد الصفوف:", result.rows.length)

    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.log("[v0] ❌ خطأ في الاستعلام:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { doctor_id, image_url, title_ar, title_en, description_ar, description_en, order_index } = body

    console.log("[v0] الاستعلام: INSERT INTO doctor_cases")
    const result = await db.query(
      `INSERT INTO doctor_cases (doctor_id, image_url, title_ar, title_en, description_ar, description_en, order_index) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        doctor_id,
        image_url,
        title_ar || "", // Default to empty string if not provided
        title_en || "", // Default to empty string if not provided
        description_ar || "", // Default to empty string if not provided
        description_en || "", // Default to empty string if not provided
        order_index || 0,
      ],
    )
    console.log("[v0] ✅ نجح الاستعلام - تمت الإضافة")

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.log("[v0] ❌ خطأ في الاستعلام:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await db.query(`UPDATE doctor_cases SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [
      ...values,
      id,
    ])

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    await db.query("DELETE FROM doctor_cases WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
