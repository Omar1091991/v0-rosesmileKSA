import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await query("SELECT * FROM gallery ORDER BY order_index ASC")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("[v0] Error fetching gallery:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await query(
      `INSERT INTO gallery (title_ar, title_en, image_url, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [body.title_ar, body.title_en, body.image_url, body.order_index || 0],
    )

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error creating gallery image:", error)
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

    const result = await query(`UPDATE gallery SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [
      ...values,
      id,
    ])

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error updating gallery image:", error)
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

    await query("DELETE FROM gallery WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting gallery image:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
