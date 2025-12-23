import { NextResponse } from "next/server"
import { google } from "googleapis"
import { db } from "@/lib/db"

async function getGoogleAuth() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
    : {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  return auth
}

export async function POST(request: Request) {
  try {
    const { bookingId, formId, bookingData } = await request.json()

    // جلب معرف الشيت للنموذج
    const formResult = await db.query("SELECT google_sheet_id FROM booking_forms WHERE id = $1", [formId])

    if (formResult.rows.length === 0 || !formResult.rows[0].google_sheet_id) {
      return NextResponse.json({ success: false, message: "لا يوجد شيت مرتبط بهذا النموذج" }, { status: 200 })
    }

    const spreadsheetId = formResult.rows[0].google_sheet_id
    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })

    // إضافة الحجز الجديد للشيت
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "الحجوزات!A:J",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            bookingData.bookingNumber || bookingId,
            bookingData.name || "",
            bookingData.phone || "",
            bookingData.service || "",
            bookingData.status || "جديد",
            bookingData.bookingDate || "",
            new Date().toLocaleString("ar-SA"),
            bookingData.notes || "",
            bookingData.source || "الموقع",
            "لا",
          ],
        ],
      },
    })

    return NextResponse.json({
      success: true,
      message: "تم إضافة الحجز للشيت بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error syncing to Google Sheet:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
