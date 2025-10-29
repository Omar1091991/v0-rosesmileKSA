import { google } from "googleapis"

export async function sendBookingToGoogleSheets(bookingData: any) {
  return appendToGoogleSheet(bookingData)
}

// Initialize Google Sheets API
export async function appendToGoogleSheet(bookingData: any) {
  try {
    console.log("[v0] 🔍 Starting Google Sheets sync...")
    console.log("[v0] Booking data:", JSON.stringify(bookingData, null, 2))

    if (!process.env.GOOGLE_PRIVATE_KEY) {
      console.log("[v0] ❌ GOOGLE_PRIVATE_KEY not found")
      return { success: false, message: "GOOGLE_PRIVATE_KEY not configured" }
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      console.log("[v0] ❌ GOOGLE_SERVICE_ACCOUNT_EMAIL not found")
      return { success: false, message: "GOOGLE_SERVICE_ACCOUNT_EMAIL not configured" }
    }

    if (!process.env.GOOGLE_SHEET_ID) {
      console.log("[v0] ❌ GOOGLE_SHEET_ID not found")
      return { success: false, message: "GOOGLE_SHEET_ID not configured" }
    }

    console.log("[v0] ✅ All environment variables found")
    console.log("[v0] Service Account Email:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
    console.log("[v0] Sheet ID:", process.env.GOOGLE_SHEET_ID)

    // Parse the private key (handle escaped newlines)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
    console.log("[v0] Private key length:", privateKey.length)
    console.log("[v0] Private key starts with:", privateKey.substring(0, 50))

    // Create auth client
    console.log("[v0] Creating Google Auth client...")
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    console.log("[v0] Creating Sheets API client...")
    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

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

    console.log("[v0] Row data to append:", row)

    // Append to sheet
    console.log("[v0] Appending to Google Sheet...")
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:G", // 7 columns: A to G
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    })

    console.log("[v0] ✅ Successfully added booking to Google Sheets")
    console.log("[v0] Response:", JSON.stringify(response.data, null, 2))
    return { success: true, response: response.data }
  } catch (error: any) {
    console.error("[v0] ❌ Error adding to Google Sheets:", error.message)
    console.error("[v0] Error stack:", error.stack)
    console.error("[v0] Full error:", JSON.stringify(error, null, 2))
    return { success: false, error: error.message }
  }
}
