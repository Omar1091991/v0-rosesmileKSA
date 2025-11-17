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

export async function testGoogleSheetsConnection(): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  try {
    console.log("[v0] 🔍 اختبار اتصال Google Sheets...")

    const requiredVars = {
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    }

    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      return {
        success: false,
        message: `متغيرات البيئة المفقودة: ${missingVars.join(", ")}`,
        details: {
          missingVars,
          solution: "أضف المتغيرات المفقودة في إعدادات Vercel ثم أعد نشر المشروع. تأكد من استخدام بيانات اعتماد مشروع rosesmile-booking",
        },
      }
    }

    console.log("[v0] ✅ جميع المتغيرات موجودة")
    console.log("[v0] طول GOOGLE_PRIVATE_KEY:", process.env.GOOGLE_PRIVATE_KEY!.length)
    console.log("[v0] GOOGLE_SERVICE_ACCOUNT_EMAIL:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)

    let privateKey: string
    try {
      privateKey = cleanPrivateKey(process.env.GOOGLE_PRIVATE_KEY!)
      console.log("[v0] ✅ تم تنظيف Private Key بنجاح")
    } catch (error: any) {
      console.error("[v0] ❌ خطأ في تنظيف Private Key:", error.message)
      return {
        success: false,
        message: "خطأ في تنسيق Private Key",
        details: {
          error: error.message,
          solution: "تأكد من نسخ Private Key بالكامل من ملف JSON، بما في ذلك السطور BEGIN و END",
          hint: "في Vercel، يمكنك لصق المفتاح مباشرة مع الأسطر الجديدة، أو استبدال \\n بأسطر جديدة فعلية",
        },
      }
    }

    let auth: any
    try {
      auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: privateKey,
        },
        scopes: [
          "https://www.googleapis.com/auth/spreadsheets",
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/drive.file",
        ],
      })
      console.log("[v0] ✅ تم إنشاء Google Auth بنجاح")
    } catch (error: any) {
      console.error("[v0] ❌ خطأ في إنشاء Google Auth:", error.message)
      return {
        success: false,
        message: "خطأ في إنشاء Google Auth",
        details: {
          error: error.message,
          solution: "تحقق من صحة Service Account Email و Private Key",
        },
      }
    }

    const sheets = google.sheets({ version: "v4", auth })
    const drive = google.drive({ version: "v3", auth })

    console.log("[v0] اختبار إنشاء جدول تجريبي...")

    let testSheet: any
    try {
      testSheet = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `Test Sheet - ${Date.now()}`,
          },
        },
      })
      console.log("[v0] ✅ تم إنشاء جدول تجريبي بنجاح")
    } catch (error: any) {
      console.error("[v0] ❌ خطأ في إنشاء جدول تجريبي:", error.message)
      console.error("[v0] تفاصيل الخطأ:", JSON.stringify(error, null, 2))

      let errorMessage = "فشل في إنشاء جدول تجريبي"
      let solution = "تحقق من الصلاحيات والإعدادات"

      if (error.code === 403) {
        errorMessage = "لا توجد صلاحيات كافية"
        solution =
          "تأكد من تفعيل Google Sheets API و Google Drive API في Google Cloud Console:\n" +
          "1. اذهب إلى https://console.cloud.google.com/apis/library\n" +
          "2. ابحث عن 'Google Sheets API' وفعّله\n" +
          "3. ابحث عن 'Google Drive API' وفعّله"
      } else if (error.code === 401 || error.message.includes("invalid_grant")) {
        errorMessage = "بيانات الاعتماد غير صالحة"
        solution =
          "قم بإنشاء Service Account جديد:\n" +
          "1. اذهب إلى Google Cloud Console\n" +
          "2. IAM & Admin > Service Accounts\n" +
          "3. أنشئ Service Account جديد وحمّل مفتاح JSON\n" +
          "4. حدّث المتغيرات في Vercel"
      } else if (error.code === 429) {
        errorMessage = "تم تجاوز حد الطلبات"
        solution = "انتظر دقيقة ثم حاول مرة أخرى"
      }

      return {
        success: false,
        message: errorMessage,
        details: {
          error: error.message,
          errorCode: error.code,
          solution,
        },
      }
    }

    const testSheetId = testSheet.data.spreadsheetId

    if (!testSheetId) {
      return {
        success: false,
        message: "فشل في الحصول على معرف الجدول",
        details: {
          error: "لم يتم إرجاع spreadsheetId من Google API",
        },
      }
    }

    try {
      await drive.files.delete({
        fileId: testSheetId,
      })
      console.log("[v0] ✅ تم حذف الجدول التجريبي")
    } catch (error: any) {
      console.warn("[v0] ⚠️ لم يتمكن من حذف الجدول التجريبي:", error.message)
      // This is not critical, so we don't fail the test
    }

    return {
      success: true,
      message: "✅ الاتصال بـ Google Sheets يعمل بشكل صحيح!",
      details: {
        serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        privateKeyLength: privateKey.length,
        canCreateSheets: true,
        canDeleteSheets: true,
        testSheetId,
        project: "rosesmile-booking"
      },
    }
  } catch (error: any) {
    console.error("[v0] ❌ خطأ غير متوقع في اختبار الاتصال:", error.message)
    console.error("[v0] Stack trace:", error.stack)

    return {
      success: false,
      message: "خطأ غير متوقع في اختبار الاتصال",
      details: {
        error: error.message,
        errorCode: error.code,
        solution: "تحقق من السجلات (logs) للحصول على مزيد من التفاصيل",
      },
    }
  }
}

export async function createGoogleSheet(
  sheetName: string,
): Promise<{ success: boolean; sheetId?: string; spreadsheetId?: string; spreadsheetUrl?: string; error?: string }> {
  try {
    console.log("[v0] 📄 إنشاء جدول Google Sheet جديد:", sheetName)

    // التحقق المباشر من المتغيرات البيئية فقط
    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      console.error("[v0] ❌ بيانات اعتماد Google غير موجودة")
      return {
        success: false,
        error:
          "بيانات اعتماد Google غير موجودة. يرجى إضافة GOOGLE_PRIVATE_KEY و GOOGLE_SERVICE_ACCOUNT_EMAIL في إعدادات Vercel",
      }
    }

    console.log("[v0] ✅ بيانات الاعتماد موجودة، جاري إنشاء الجدول...")

    const privateKey = cleanPrivateKey(process.env.GOOGLE_PRIVATE_KEY)

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
      ],
    })

    const sheets = google.sheets({ version: "v4", auth })

    console.log("[v0] إنشاء جدول بنظام إعادة المحاولة...")

    const spreadsheet = await retryWithBackoff(async () => {
      const result = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: sheetName,
            locale: "ar_EG",
            timeZone: "Africa/Cairo",
          },
        },
      })

      console.log("[v0] ✅ استجابة Google API:", JSON.stringify(result.data, null, 2))
      return result
    })

    const spreadsheetId = spreadsheet.data.spreadsheetId
    if (!spreadsheetId) {
      throw new Error("Failed to get spreadsheet ID from response")
    }

    console.log("[v0] ✅ تم إنشاء الجدول:", spreadsheetId)

    const sheetsData = spreadsheet.data.sheets || []
    const sheetTitle = sheetsData.length > 0 ? sheetsData[0].properties?.title || "Sheet1" : "Sheet1"

    console.log("[v0] جاري إضافة رأس الجدول...")
    const headers = ["التاريخ", "الوقت", "الاسم", "رقم الجوال", "الخدمة", "النموذج", "التفاصيل"]

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
      console.log("[v0] ✅ تم تنسيق رأس الجدول")
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
    console.error("[v0] تفاصيل الخطأ الكاملة:", JSON.stringify(error, null, 2))

    let userMessage = error.message
    if (error.message.includes("403") || error.code === 403) {
      userMessage =
        "لا توجد صلاحيات كافية. تأكد من:\n1. تفعيل Google Drive API في Google Cloud Console\n2. تفعيل Google Sheets API\n3. إضافة الصلاحيات الصحيحة للـ Service Account"
    } else if (error.message.includes("invalid_grant") || error.code === 401) {
      userMessage =
        "بيانات الاعتماد منتهية الصلاحية أو غير صحيحة. يرجى:\n1. إعادة إنشاء Service Account من Google Cloud Console\n2. تحديث المتغيرات البيئية في Vercel"
    } else if (error.message.includes("429") || error.code === 429) {
      userMessage = "تم تجاوز حد الطلبات. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى"
    } else if (error.message.includes("Private key")) {
      userMessage = "مفتاح Private Key غير صحيح. تأكد من نسخ المفتاح بالكامل من ملف JSON"
    }

    return { success: false, error: userMessage }
  }
}
