import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { google } from "googleapis"
import credentials from "@/lib/google-credentials.json"

async function sendToGoogleSheet(bookingData: any, sheetId: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    const timestamp = new Date().toLocaleString("ar-EG", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "الحجوزات!A:F",
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              timestamp,
              bookingData.full_name,
              bookingData.phone,
              bookingData.service_name,
              bookingData.notes || "",
              bookingData.status || "pending",
            ],
          ],
        },
      })
      console.log("[v0] Data sent to Google Sheet successfully:", sheetId)
    } catch (appendError: any) {
      if (appendError.message?.includes("Unable to parse range")) {
        console.log("[v0] Sheet 'الحجوزات' not found, creating it...")

        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: sheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: "الحجوزات",
                  },
                },
              },
            ],
          },
        })

        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: "الحجوزات!A1:F1",
          valueInputOption: "RAW",
          requestBody: {
            values: [["التاريخ", "الاسم", "رقم الجوال", "الخدمة", "ملاحظات", "الحالة"]],
          },
        })

        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: "الحجوزات!A:F",
          valueInputOption: "RAW",
          requestBody: {
            values: [
              [
                timestamp,
                bookingData.full_name,
                bookingData.phone,
                bookingData.service_name,
                bookingData.notes || "",
                bookingData.status || "pending",
              ],
            ],
          },
        })
        console.log("[v0] Sheet created and data sent successfully")
      } else {
        throw appendError
      }
    }
  } catch (error) {
    console.error("[v0] Error sending to Google Sheet:", error)
    throw error
  }
}

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

    let googleSheetId = null
    if (body.booking_form_id) {
      try {
        const formResult = await db.query("SELECT google_sheet_id FROM booking_forms WHERE id = $1", [
          body.booking_form_id,
        ])

        if (formResult.rows.length > 0 && formResult.rows[0].google_sheet_id) {
          googleSheetId = formResult.rows[0].google_sheet_id
          console.log("[v0] Found Google Sheet ID:", googleSheetId)
        }
      } catch (formError) {
        console.error("[v0] Error fetching form:", formError)
      }
    }

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

    if (googleSheetId) {
      try {
        console.log("[v0] Attempting to send to Google Sheet:", googleSheetId)
        await sendToGoogleSheet(body, googleSheetId)
        console.log("[v0] Successfully sent booking to Google Sheet")
      } catch (sheetError: any) {
        console.error("[v0] Failed to send to Google Sheet:", sheetError.message)
      }
    } else {
      console.log("[v0] No Google Sheet ID found, skipping sheet update")
    }

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
