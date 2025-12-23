import { NextResponse } from "next/server"
import { google } from "googleapis"
import { db } from "@/lib/db"

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"]

async function getGoogleAuth() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
    : {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  })

  return auth
}

export async function POST(request: Request) {
  try {
    const { formId, formName } = await request.json()

    if (!formId || !formName) {
      return NextResponse.json({ error: "معرف النموذج واسمه مطلوبان" }, { status: 400 })
    }

    // التحقق من وجود النموذج
    const formResult = await db.query("SELECT id, google_sheet_id, google_sheet_url FROM booking_forms WHERE id = $1", [
      formId,
    ])

    if (formResult.rows.length === 0) {
      return NextResponse.json({ error: "النموذج غير موجود" }, { status: 404 })
    }

    // إذا كان هناك شيت مرتبط بالفعل
    if (formResult.rows[0].google_sheet_id) {
      return NextResponse.json({
        success: true,
        sheetId: formResult.rows[0].google_sheet_id,
        sheetUrl: formResult.rows[0].google_sheet_url,
        message: "الشيت مرتبط بالفعل",
      })
    }

    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })
    const drive = google.drive({ version: "v3", auth })

    // إنشاء شيت جديد
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `حجوزات - ${formName}`,
          locale: "ar",
        },
        sheets: [
          {
            properties: {
              title: "الحجوزات",
              gridProperties: {
                frozenRowCount: 1,
              },
              rightToLeft: true,
            },
          },
        ],
      },
    })

    const spreadsheetId = spreadsheet.data.spreadsheetId!
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`

    // إضافة العناوين
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "الحجوزات!A1:J1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            "رقم الحجز",
            "الاسم",
            "رقم الهاتف",
            "الخدمة",
            "الحالة",
            "تاريخ الحجز",
            "وقت الإنشاء",
            "ملاحظات",
            "مصدر الحجز",
            "تم التواصل",
          ],
        ],
      },
    })

    // تنسيق الصف الأول (العناوين)
    await sheets.spreadsheets.batchUpdate({
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
                  backgroundColor: { red: 0.2, green: 0.4, blue: 0.6 },
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true,
                    fontSize: 11,
                  },
                  horizontalAlignment: "CENTER",
                  verticalAlignment: "MIDDLE",
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: 0,
                endIndex: 1,
              },
              properties: {
                pixelSize: 40,
              },
              fields: "pixelSize",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: 0,
                dimension: "COLUMNS",
                startIndex: 0,
                endIndex: 10,
              },
              properties: {
                pixelSize: 130,
              },
              fields: "pixelSize",
            },
          },
        ],
      },
    })

    // نقل الشيت للمجلد المحدد إذا وجد
    if (process.env.GOOGLE_FOLDER_ID) {
      await drive.files.update({
        fileId: spreadsheetId,
        addParents: process.env.GOOGLE_FOLDER_ID,
        fields: "id, parents",
      })
    }

    // تحديث النموذج بمعرف الشيت
    await db.query("UPDATE booking_forms SET google_sheet_id = $1, google_sheet_url = $2 WHERE id = $3", [
      spreadsheetId,
      spreadsheetUrl,
      formId,
    ])

    return NextResponse.json({
      success: true,
      sheetId: spreadsheetId,
      sheetUrl: spreadsheetUrl,
      message: "تم إنشاء وربط الشيت بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error creating Google Sheet:", error)
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء إنشاء الشيت" }, { status: 500 })
  }
}
