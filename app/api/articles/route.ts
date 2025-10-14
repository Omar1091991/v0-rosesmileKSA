import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await query("SELECT * FROM articles ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("[v0] Error fetching articles:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await query(
      `INSERT INTO articles (title_ar, title_en, content_ar, content_en, image_url, is_published)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [body.title_ar, body.title_en, body.content_ar, body.content_en, body.image_url, body.is_published ?? true],
    )

    return NextResponse.json({ article: result.rows[0] })
  } catch (error: any) {
    console.error("[v0] Error creating article:", error)
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

    const result = await query(`UPDATE articles SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [
      ...values,
      id,
    ])

    return NextResponse.json({ article: result.rows[0] })
  } catch (error: any) {
    console.error("[v0] Error updating article:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    await query("DELETE FROM articles WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting article:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
