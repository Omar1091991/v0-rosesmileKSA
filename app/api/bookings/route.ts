import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Fetching bookings...")

    let result
    let usingNewSchema = false

    try {
      result = await db.query(`
        SELECT 
          b.*,
          b.patient_name as full_name,
          bf.name_ar as booking_form_name_ar,
          bf.name_en as booking_form_name_en,
          s.title_ar as service_title_ar,
          s.title_en as service_title_en
        FROM bookings b
        LEFT JOIN booking_forms bf ON b.booking_form_id = bf.id
        LEFT JOIN services s ON b.service_id = s.id
        ORDER BY b.created_at DESC
      `)
      usingNewSchema = true
      console.log("[v0] ✅ Using new schema with booking_form_id and service_id")
    } catch (error: any) {
      if (error.message?.includes("does not exist") || error.code === "42703") {
        console.log("[v0] ℹ️ Using old schema (some columns missing)")

        // Try without the JOINs but with new columns
        try {
          result = await db.query(`
            SELECT 
              *,
              patient_name as full_name
            FROM bookings
            ORDER BY created_at DESC
          `)
        } catch (fallbackError: any) {
          // If even basic query fails, return empty result
          console.error("[v0] ❌ Failed to fetch bookings:", fallbackError.message)
          return NextResponse.json({
            bookings: [],
            usingNewSchema: false,
            message: "Database schema needs migration",
          })
        }
      } else {
        throw error
      }
    }

    console.log("[v0] Fetched bookings:", result.rows.length)

    const bookings = result.rows.map((booking) => ({
      id: booking.id,
      full_name: booking.patient_name || booking.full_name,
      phone: booking.phone,
      email: booking.email,
      service_id: booking.service_id || null,
      service_name: booking.service_name || booking.service_title_ar || booking.service || "",
      doctor_id: booking.doctor_id,
      preferred_date: booking.preferred_date,
      preferred_time: booking.preferred_time,
      notes: booking.notes,
      status: booking.status,
      contacted: booking.contacted || false,
      admin_notes: booking.admin_notes || "",
      contact_attempts: booking.contact_attempts || 0,
      booking_form_id: booking.booking_form_id || null,
      booking_form_name: booking.booking_form_name_ar || "",
      created_at: booking.created_at,
      updated_at: booking.updated_at,
    }))

    if (bookings.length > 0) {
      console.log("[v0] Sample booking:", JSON.stringify(bookings[0], null, 2))
    }

    return NextResponse.json({
      bookings,
      usingNewSchema,
      message: usingNewSchema ? "Using enhanced schema" : "Using basic schema - run migration to enable form names",
    })
  } catch (error: any) {
    console.error("[v0] ❌ Error fetching bookings:", error.message)
    return NextResponse.json(
      {
        bookings: [],
        usingNewSchema: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] Creating booking with data:", body)

    let result
    try {
      result = await db.query(
        `INSERT INTO bookings (
          patient_name, 
          phone, 
          email,
          service, 
          service_id,
          service_name,
          doctor_id,
          preferred_date,
          preferred_time,
          notes, 
          status,
          booking_form_id,
          contacted,
          admin_notes,
          contact_attempts
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          body.full_name || body.patient_name,
          body.phone,
          body.email || null,
          body.service || body.service_name || "",
          body.service_id || null,
          body.service_name || body.service || "",
          body.doctor_id || null,
          body.preferred_date || null,
          body.preferred_time || null,
          body.notes || "",
          body.status || "pending",
          body.booking_form_id || null,
          body.contacted || false,
          body.admin_notes || "",
          body.contact_attempts || 0,
        ],
      )
      console.log("[v0] ✅ Created booking with new schema")
    } catch (error: any) {
      // If new columns don't exist, use old schema
      if (error.message?.includes("does not exist") || error.code === "42703") {
        console.log("[v0] ⚠️ New columns not found, using old schema for insert")
        result = await db.query(
          `INSERT INTO bookings (
            patient_name, 
            phone, 
            email,
            service, 
            doctor_id,
            preferred_date,
            preferred_time,
            notes, 
            status
          )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [
            body.full_name || body.patient_name,
            body.phone,
            body.email || null,
            body.service || body.service_name || "",
            body.doctor_id || null,
            body.preferred_date || null,
            body.preferred_time || null,
            body.notes || "",
            body.status || "pending",
          ],
        )
      } else {
        throw error
      }
    }

    const booking = result.rows[0]

    console.log("[v0] Created booking:", booking)

    return NextResponse.json({ booking })
  } catch (error: any) {
    console.error("[v0] Error creating booking:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    console.log("[v0] Updating booking:", id, "with:", updates)

    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await db.query(`UPDATE bookings SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [
      ...values,
      id,
    ])

    console.log("[v0] Updated booking:", result.rows[0])

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

    console.log("[v0] Deleting booking:", id)

    await db.query("DELETE FROM bookings WHERE id = $1", [id])

    console.log("[v0] Deleted booking successfully")

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting booking:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
