import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM site_content ORDER BY section")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("[v0] Error fetching site content:", error)
    return NextResponse.json({ error: error.message || "فشل في جلب محتوى الموقع" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { section, content_ar, content_en } = body

    const result = await db.query(
      "INSERT INTO site_content (section, content_ar, content_en) VALUES ($1, $2, $3) RETURNING *",
      [section, content_ar, content_en],
    )

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error creating site content:", error)
    return NextResponse.json({ error: error.message || "فشل في إضافة المحتوى" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await db.query(
      `UPDATE site_content SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id],
    )

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error updating site content:", error)
    return NextResponse.json({ error: error.message || "فشل في تحديث المحتوى" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "معرف المحتوى مطلوب" }, { status: 400 })
    }

    await db.query("DELETE FROM site_content WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting site content:", error)
    return NextResponse.json({ error: error.message || "فشل في حذف المحتوى" }, { status: 500 })
  }
}
