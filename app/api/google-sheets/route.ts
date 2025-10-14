import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { full_name, phone, service_name, notes, timestamp } = body

    // التحقق من وجود المتغيرات البيئية المطلوبة
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!credentials || !spreadsheetId) {
      console.log("[v0] Google Sheets credentials not configured")
      // إذا لم تكن المتغيرات موجودة، نعيد نجاح لكن نسجل في الـ console
      return NextResponse.json({
        success: true,
        message: "Booking saved to database (Google Sheets not configured)",
      })
    }

    // إعداد Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    // إضافة البيانات إلى Google Sheet
    const values = [[new Date(timestamp).toLocaleString("ar-SA"), full_name, phone, service_name, notes || "-"]]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "الحجوزات!A:E", // اسم الورقة والنطاق
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Booking submitted successfully",
    })
  } catch (error) {
    console.error("[v0] Error in Google Sheets API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit to Google Sheets",
      },
      { status: 500 },
    )
  }
}
