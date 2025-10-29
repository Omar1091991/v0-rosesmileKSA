import { google } from "googleapis"

export async function sendBookingToGoogleSheets(bookingData: any) {
  return appendToGoogleSheet(bookingData)
}

// Initialize Google Sheets API
export async function appendToGoogleSheet(bookingData: any) {
  try {
    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      console.log("[v0] Google Sheets credentials not configured, skipping...")
      return { success: false, message: "Credentials not configured" }
    }

    // Parse the private key (handle escaped newlines)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")

    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      console.log("[v0] Spreadsheet ID not configured")
      return { success: false, message: "Spreadsheet ID not configured" }
    }

    const now = new Date()
    const dateStr = now.toLocaleDateString("ar-EG", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    const timeStr = now.toLocaleTimeString("ar-EG", {
      timeZone: "Africa/Cairo",
      hour: "2-digit",
      minute: "2-digit",
    })

    // Prepare row data matching the exact columns
    const row = [
      dateStr, // التاريخ
      timeStr, // الوقت
      bookingData.full_name || bookingData.patient_name || "", // الاسم
      bookingData.phone || "", // رقم الجوال
      bookingData.service_name || bookingData.service || "", // الخدمة
      bookingData.booking_form_name || "", // النموذج
      bookingData.notes || "", // التفاصيل
    ]

    // Append to sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:G", // 7 columns: A to G
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    })

    console.log("[v0] ✅ Successfully added booking to Google Sheets")
    return { success: true, response: response.data }
  } catch (error: any) {
    console.error("[v0] ❌ Error adding to Google Sheets:", error.message)
    return { success: false, error: error.message }
  }
}
