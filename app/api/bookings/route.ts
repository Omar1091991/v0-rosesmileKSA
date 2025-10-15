import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM bookings ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Received booking data:", body)

    const result = await db.query(
      `INSERT INTO bookings (full_name, phone, service_name, service_id, notes, status, booking_form_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        body.full_name,
        body.phone,
        body.service_name,
        body.service_id,
        body.notes || "",
        body.status || "pending",
        body.booking_form_id || null,
      ],
    )

    const booking = result.rows[0]
    console.log("[v0] Booking created in database:", booking)

    return NextResponse.json({ booking })
  } catch (error: any) {
    console.error("[v0] Error creating booking:", error)
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

    const result = await db.query(`UPDATE bookings SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [
      ...values,
      id,
    ])

    return NextResponse.json({ booking: result.rows[0] })
  } catch (error: any) {
    console.error("[v0] Error updating booking:", error)
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

    await db.query("DELETE FROM bookings WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting booking:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
