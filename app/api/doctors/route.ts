import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Fetching doctors...")
    const result = await query("SELECT * FROM doctors ORDER BY created_at DESC")
    console.log("[v0] Found", result.rows.length, "doctors")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("[v0] Error fetching doctors:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Creating doctor:", body)

    if (!body.image_url) {
      return NextResponse.json({ error: "الرجاء إضافة صورة واحدة على الأقل" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO doctors (name_ar, name_en, specialty_ar, specialty_en, bio_ar, bio_en, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        body.name_ar,
        body.name_en || body.name_ar,
        body.specialty_ar,
        body.specialty_en || body.specialty_ar,
        body.bio_ar || "",
        body.bio_en || "",
        body.image_url,
        body.is_active ?? true,
      ],
    )

    console.log("[v0] Doctor created successfully:", result.rows[0])
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error creating doctor:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    const result = await query(
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

    await query("DELETE FROM doctors WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
