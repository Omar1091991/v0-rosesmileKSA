import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { appendToGoogleSheet } from "@/lib/google-sheets"

export async function GET() {
  try {
    console.log("[v0] Fetching bookings...")

    const result = await db.query(`
      SELECT 
        b.id,
        b.patient_name,
        b.phone,
        b.email,
        b.service,
        b.doctor_id,
        b.preferred_date,
        b.preferred_time,
        b.notes,
        b.status,
        b.created_at,
        b.updated_at,
        COALESCE(b.booking_form_id, NULL) as booking_form_id,
        COALESCE(b.service_id, NULL) as service_id,
        COALESCE(b.service_name, b.service, '') as service_name,
        COALESCE(b.contacted, false) as contacted,
        COALESCE(b.admin_notes, '') as admin_notes,
        COALESCE(b.contact_attempts, 0) as contact_attempts,
        COALESCE(bf.name_ar, '') as booking_form_name_ar,
        COALESCE(bf.name_en, '') as booking_form_name_en,
        COALESCE(s.title_ar, '') as service_title_ar,
        COALESCE(s.title_en, '') as service_title_en
      FROM bookings b
      LEFT JOIN booking_forms bf ON b.booking_form_id = bf.id
      LEFT JOIN services s ON b.service_id = s.id
      ORDER BY b.created_at DESC
    `)

    console.log("[v0] ✅ Fetched bookings:", result.rows.length)

    const bookings = result.rows.map((booking) => ({
      id: booking.id,
      full_name: booking.patient_name,
      phone: booking.phone,
      email: booking.email,
      service_id: booking.service_id,
      service_name: booking.service_title_ar || booking.service_name || booking.service || "",
      doctor_id: booking.doctor_id,
      preferred_date: booking.preferred_date,
      preferred_time: booking.preferred_time,
      notes: booking.notes,
      status: booking.status,
      contacted: booking.contacted,
      admin_notes: booking.admin_notes,
      contact_attempts: booking.contact_attempts,
      booking_form_id: booking.booking_form_id,
      booking_form_name: booking.booking_form_name_ar || booking.booking_form_name_en || "",
      created_at: booking.created_at,
      updated_at: booking.updated_at,
    }))

    if (bookings.length > 0) {
      console.log("[v0] Sample booking:", JSON.stringify(bookings[0], null, 2))
    }

    return NextResponse.json({ bookings })
  } catch (error: any) {
    console.error("[v0] ❌ Error fetching bookings:", error.message)
    console.error("[v0] Error details:", error)

    try {
      console.log("[v0] Trying fallback query without JOINs...")
      const fallbackResult = await db.query(`
        SELECT 
          id,
          patient_name,
          phone,
          email,
          service,
          doctor_id,
          preferred_date,
          preferred_time,
          notes,
          status,
          created_at,
          updated_at,
          booking_form_id,
          service_id,
          service_name,
          contacted,
          admin_notes,
          contact_attempts
        FROM bookings
        ORDER BY created_at DESC
      `)

      const bookings = fallbackResult.rows.map((booking) => ({
        id: booking.id,
        full_name: booking.patient_name,
        phone: booking.phone,
        email: booking.email,
        service_id: booking.service_id || null,
        service_name: booking.service_name || booking.service || "",
        doctor_id: booking.doctor_id,
        preferred_date: booking.preferred_date,
        preferred_time: booking.preferred_time,
        notes: booking.notes,
        status: booking.status,
        contacted: booking.contacted || false,
        admin_notes: booking.admin_notes || "",
        contact_attempts: booking.contact_attempts || 0,
        booking_form_id: booking.booking_form_id || null,
        booking_form_name: "",
        created_at: booking.created_at,
        updated_at: booking.updated_at,
      }))

      console.log("[v0] ✅ Fallback query succeeded:", bookings.length)
      return NextResponse.json({ bookings })
    } catch (fallbackError: any) {
      console.error("[v0] ❌ Fallback query also failed:", fallbackError.message)
      return NextResponse.json({ error: error.message, bookings: [] }, { status: 500 })
    }
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

    let bookingFormName = ""
    let serviceName = booking.service_name || booking.service || ""
    let googleSheetUrl = null

    try {
      if (booking.booking_form_id) {
        const formResult = await db.query(
          "SELECT name_ar, name_en, google_sheet_url FROM booking_forms WHERE id = $1",
          [booking.booking_form_id],
        )
        if (formResult.rows.length > 0) {
          bookingFormName = formResult.rows[0].name_ar || formResult.rows[0].name_en || ""
          googleSheetUrl = formResult.rows[0].google_sheet_url
        }
      }

      if (booking.service_id && !serviceName) {
        const serviceResult = await db.query("SELECT title_ar, title_en FROM services WHERE id = $1", [
          booking.service_id,
        ])
        if (serviceResult.rows.length > 0) {
          serviceName = serviceResult.rows[0].title_ar || serviceResult.rows[0].title_en || ""
        }
      }
    } catch (lookupError: any) {
      console.log("[v0] ⚠️ Could not fetch form/service names:", lookupError.message)
    }

    try {
      console.log("[v0] 📤 Sending booking to Google Sheets...")
      const sheetsResult = await appendToGoogleSheet({
        full_name: booking.patient_name,
        patient_name: booking.patient_name,
        phone: booking.phone,
        email: booking.email,
        service: serviceName,
        service_name: serviceName,
        booking_form_name: bookingFormName,
        notes: booking.notes || "",
        id: booking.id,
        created_at: booking.created_at,
      })

      if (sheetsResult.success) {
        console.log("[v0] ✅ Booking synced to Google Sheets successfully!")
      } else {
        console.log("[v0] ⚠️ Google Sheets sync failed:", sheetsResult.message)
        console.log("[v0] Error details:", sheetsResult.error)
      }
    } catch (sheetsError: any) {
      console.error("[v0] ❌ Google Sheets error (non-critical):", sheetsError.message)
    }

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
