import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await query("SELECT * FROM offers ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await query(
      `INSERT INTO offers (title_ar, title_en, description_ar, description_en, price_before, price_after, discount_percentage, valid_from, valid_until, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        body.title_ar,
        body.title_en || body.title_ar,
        body.description_ar,
        body.description_en || body.description_ar,
        body.price_before,
        body.price_after,
        body.discount_percentage,
        body.valid_from,
        body.valid_until,
        body.image_url,
        body.is_active ?? true,
      ],
    )

    return NextResponse.json({ offer: result.rows[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    const result = await query(
      `UPDATE offers SET 
        title_ar = $1, title_en = $2, description_ar = $3, description_en = $4,
        price_before = $5, price_after = $6, discount_percentage = $7,
        valid_from = $8, valid_until = $9, image_url = $10, is_active = $11
       WHERE id = $12
       RETURNING *`,
      [
        body.title_ar,
        body.title_en,
        body.description_ar,
        body.description_en,
        body.price_before,
        body.price_after,
        body.discount_percentage,
        body.valid_from,
        body.valid_until,
        body.image_url,
        body.is_active,
        body.id,
      ],
    )

    return NextResponse.json({ offer: result.rows[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Offer ID is required" }, { status: 400 })
    }

    await query("DELETE FROM offers WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
