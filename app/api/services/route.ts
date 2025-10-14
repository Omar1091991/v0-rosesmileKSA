import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM services ORDER BY order_index")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await db.query(
      `INSERT INTO services (title_ar, title_en, description_ar, description_en, icon, image_url, is_active, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        body.title_ar,
        body.title_en || body.title_ar,
        body.description_ar,
        body.description_en || body.description_ar,
        body.icon,
        body.image_url,
        body.is_active ?? true,
        body.order_index ?? 0,
      ],
    )

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    const result = await db.query(
      `UPDATE services 
       SET title_ar = $1, title_en = $2, description_ar = $3, description_en = $4, 
           icon = $5, image_url = $6, is_active = $7, order_index = $8
       WHERE id = $9
       RETURNING *`,
      [
        body.title_ar,
        body.title_en,
        body.description_ar,
        body.description_en,
        body.icon,
        body.image_url,
        body.is_active,
        body.order_index,
        body.id,
      ],
    )

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    await db.query("DELETE FROM services WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
