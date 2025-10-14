import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM doctors ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await db.query(
      `INSERT INTO doctors (name_ar, name_en, specialty_ar, specialty_en, bio_ar, bio_en, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        body.name_ar,
        body.name_en || body.name_ar,
        body.specialty_ar,
        body.specialty_en || body.specialty_ar,
        body.bio_ar,
        body.bio_en,
        body.image_url,
        body.is_active ?? true,
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
      `UPDATE doctors 
       SET name_ar = $1, name_en = $2, specialty_ar = $3, specialty_en = $4,
           bio_ar = $5, bio_en = $6, image_url = $7, is_active = $8
       WHERE id = $9
       RETURNING *`,
      [
        body.name_ar,
        body.name_en,
        body.specialty_ar,
        body.specialty_en,
        body.bio_ar,
        body.bio_en,
        body.image_url,
        body.is_active,
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
      return NextResponse.json({ error: "معرف الطبيب مطلوب" }, { status: 400 })
    }

    await db.query("DELETE FROM doctors WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
