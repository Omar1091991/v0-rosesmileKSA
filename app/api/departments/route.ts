import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await query("SELECT * FROM departments ORDER BY order_index ASC")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("[v0] Error fetching departments:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await query(
      `INSERT INTO departments (name_ar, name_en, description_ar, description_en, icon, order_index)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [body.name_ar, body.name_en, body.description_ar, body.description_en, body.icon, body.order_index || 0],
    )

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error creating department:", error)
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

    const result = await query(`UPDATE departments SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [
      ...values,
      id,
    ])

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error updating department:", error)
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

    await query("DELETE FROM departments WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting department:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
