import { google } from "googleapis"

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[v0] محاولة ${attempt}/${maxRetries}...`)
      return await fn()
    } catch (error: any) {
      lastError = error
      console.warn(`[v0] ⚠️ فشلت المحاولة ${attempt}:`, error.message)

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1)
        console.log(`[v0] إعادة المحاولة بعد ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

export async function sendBookingToGoogleSheets(bookingData: any) {
  return appendToGoogleSheet(bookingData)
}

function cleanPrivateKey(key: string): string {
  let cleaned = key.trim()

  if (cleaned.includes("\\n")) {
    cleaned = cleaned.replace(/\\n/g, "\n")
  }

  cleaned = cleaned.replace(/\s+$/gm, "")

  if (!cleaned.startsWith("-----BEGIN PRIVATE KEY-----")) {
    throw new Error("Private key must start with -----BEGIN PRIVATE KEY-----")
  }

  if (!cleaned.endsWith("-----END PRIVATE KEY-----")) {
    throw new Error("Private key must end with -----END PRIVATE KEY-----")
  }

  return cleaned
}

export async function appendToGoogleSheet(bookingData: any) {
  try {
    console.log("[v0] 🔍 بدء مزامنة Google Sheets...")
    console.log("[v0] بيانات الحجز:", JSON.stringify(bookingData, null, 2))

    if (!process.env.GOOGLE_PRIVATE_KEY) {
      console.log("[v0] ❌ GOOGLE_PRIVATE_KEY غير موجود")
      throw new Error("GOOGLE_PRIVATE_KEY not configured")
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      console.log("[v0] ❌ GOOGLE_SERVICE_ACCOUNT_EMAIL غير موجود")
      throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL not configured")
    }

    if (!process.env.GOOGLE_SHEET_ID) {
      console.log("[v0] ❌ GOOGLE_SHEET_ID غير موجود")
      throw new Error("GOOGLE_SHEET_ID not configured")
    }

    console.log("[v0] ✅ جميع متغيرات البيئة موجودة")

    const privateKey = cleanPrivateKey(process.env.GOOGLE_PRIVATE_KEY)

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    console.log("[v0] إنشاء عميل Google Sheets...")
    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    console.log("[v0] جاري الحصول على بيانات الجدول...")
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    const firstSheet = spreadsheet.data.sheets?.[0]
    const sheetName = firstSheet?.properties?.title || "Sheet1"
    console.log("[v0] ✅ اسم الورقة الأولى:", sheetName)

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

    const row = [
      dateStr,
      timeStr,
      bookingData.full_name || bookingData.patient_name || "",
      bookingData.phone || "",
      bookingData.service_name || bookingData.service || "",
      bookingData.booking_form_name || "",
      bookingData.notes || "",
    ]

    console.log("[v0] بيانات الصف:", row)

    const range = `${sheetName}!A:G`
    console.log("[v0] إضافة بيانات إلى المدى:", range)

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    })

    console.log("[v0] ✅ تمت إضافة الحجز إلى Google Sheets بنجاح")
    return { success: true, response: response.data }
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في إضافة البيانات إلى Google Sheets:", error.message)
    console.error("[v0] تفاصيل الخطأ:", error)
    throw error
  }
}

export async function createGoogleSheet(
  sheetName: string,
): Promise<{ success: boolean; sheetId?: string; spreadsheetId?: string; spreadsheetUrl?: string; error?: string }> {
  try {
    console.log("[v0] 📄 إنشاء جدول Google Sheet جديد:", sheetName)

    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      console.error("[v0] ❌ بيانات اعتماد Google غير موجودة")
      return { success: false, error: "Google credentials not configured" }
    }

    const privateKey = cleanPrivateKey(process.env.GOOGLE_PRIVATE_KEY)

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    console.log("[v0] إنشاء جدول بنظام إعادة المحاولة...")

    const spreadsheet = await retryWithBackoff(async () => {
      return await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: sheetName,
            locale: "ar_EG",
            timeZone: "Africa/Cairo",
          },
        },
      })
    })

    const spreadsheetId = spreadsheet.data.spreadsheetId
    if (!spreadsheetId) {
      throw new Error("Failed to get spreadsheet ID from response")
    }

    console.log("[v0] ✅ تم إنشاء الجدول:", spreadsheetId)

    const sheetsData = spreadsheet.data.sheets || []
    if (sheetsData.length > 0) {
      const defaultSheetId = sheetsData[0].properties?.sheetId

      try {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                updateSheetProperties: {
                  properties: {
                    sheetId: defaultSheetId,
                    title: "الحجوزات",
                  },
                  fields: "title",
                },
              },
            ],
          },
        })

        console.log("[v0] ✅ تم تعديل اسم الورقة إلى 'الحجوزات'")
      } catch (error: any) {
        console.warn("[v0] ⚠️ لم يتمكن من تعديل اسم الورقة، جاري المتابعة:", error.message)
      }
    }

    console.log("[v0] جاري إضافة رأس الجدول...")
    const headers = ["التاريخ", "الوقت", "الاسم", "رقم الجوال", "الخدمة", "النموذج", "التفاصيل"]

    const sheetTitle = sheetsData.length > 0 ? sheetsData[0].properties?.title : "Sheet1"

    await retryWithBackoff(async () => {
      return await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetTitle}!A1:G1`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [headers],
        },
      })
    })

    console.log("[v0] ✅ تمت إضافة رأس الجدول")

    console.log("[v0] جاري تنسيق رأس الجدول...")
    try {
      await retryWithBackoff(async () => {
        return await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: 0,
                    startRowIndex: 0,
                    endRowIndex: 1,
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: {
                        red: 0.2,
                        green: 0.6,
                        blue: 0.8,
                      },
                      textFormat: {
                        foregroundColor: {
                          red: 1,
                          green: 1,
                          blue: 1,
                        },
                        bold: true,
                      },
                      horizontalAlignment: "CENTER",
                    },
                  },
                  fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
                },
              },
              {
                autoResizeDimensions: {
                  dimensions: {
                    sheetId: 0,
                    dimension: "COLUMNS",
                    startIndex: 0,
                    endIndex: 7,
                  },
                },
              },
            ],
          },
        })
      })
    } catch (error: any) {
      console.warn("[v0] ⚠️ لم يتمكن من تنسيق رأس الجدول، جاري المتابعة:", error.message)
    }

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
    console.log("[v0] ✅ تم إنشاء جدول جديد بنجاح:", spreadsheetUrl)

    return {
      success: true,
      sheetId: 0,
      spreadsheetId,
      spreadsheetUrl,
    }
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في إنشاء جدول Google Sheet:", error.message)
    console.error("[v0] تفاصيل الخطأ:", error)
    return { success: false, error: error.message }
  }
}
