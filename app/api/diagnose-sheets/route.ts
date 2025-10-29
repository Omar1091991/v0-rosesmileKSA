import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] 🔍 بدء التشخيص...")

    // Check environment variables
    const diagnostics = {
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      hasServiceEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      sheetIdValue: process.env.GOOGLE_SHEET_ID || "غير موجود",
      serviceEmailValue: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "غير موجود",
      privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
      privateKeyStart: process.env.GOOGLE_PRIVATE_KEY?.substring(0, 50) || "غير موجود",
    }

    console.log("[v0] 📊 نتائج التشخيص:", diagnostics)

    // Try to initialize Google Sheets
    let sheetsError = null
    try {
      const { google } = await import("googleapis")

      if (!process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error("GOOGLE_PRIVATE_KEY غير موجود")
      }

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })

      const sheets = google.sheets({ version: "v4", auth })

      // Try to read the sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "A1:G1",
      })

      console.log("[v0] ✅ نجح الاتصال بـ Google Sheets!")
      console.log("[v0] 📋 العناوين:", response.data.values)

      return NextResponse.json({
        success: true,
        message: "التشخيص نجح! الاتصال بـ Google Sheets يعمل",
        diagnostics,
        sheetHeaders: response.data.values,
      })
    } catch (error: any) {
      sheetsError = error.message
      console.error("[v0] ❌ خطأ في الاتصال بـ Google Sheets:", error)
    }

    return NextResponse.json({
      success: false,
      message: "فشل الاتصال بـ Google Sheets",
      diagnostics,
      error: sheetsError,
    })
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في التشخيص:", error)
    return NextResponse.json(
      {
        success: false,
        message: "خطأ في التشخيص",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
