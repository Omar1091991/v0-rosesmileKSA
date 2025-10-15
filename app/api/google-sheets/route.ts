import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { full_name, phone, service_name, notes, timestamp, sheet_id } = body

    const spreadsheetId = sheet_id

    if (!spreadsheetId) {
      console.log("[v0] Google Sheet ID not provided")
      return NextResponse.json({
        success: true,
        message: "Booking saved to database (Google Sheets not configured)",
      })
    }

    const credentials = require("@/lib/google-credentials.json")

    // إعداد Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    try {
      const sheetMetadata = await sheets.spreadsheets.get({
        spreadsheetId,
      })

      const bookingsSheet = sheetMetadata.data.sheets?.find((sheet) => sheet.properties?.title === "الحجوزات")

      if (!bookingsSheet) {
        // إنشاء ورقة "الحجوزات"
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
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

        // إضافة الرؤوس
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: "الحجوزات!A1:E1",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [["التاريخ والوقت", "الاسم الكامل", "رقم الجوال", "الخدمة المطلوبة", "ملاحظات"]],
          },
        })
      }
    } catch (error) {
      console.error("[v0] Error checking/creating sheet:", error)
    }

    // إضافة البيانات إلى Google Sheet
    const values = [[new Date(timestamp).toLocaleString("ar-SA"), full_name, phone, service_name, notes || "-"]]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "الحجوزات!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Booking submitted successfully to Google Sheets",
    })
  } catch (error: any) {
    console.error("[v0] Error in Google Sheets API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit to Google Sheets",
        details: error.response?.data || error.toString(),
      },
      { status: 500 },
    )
  }
}
