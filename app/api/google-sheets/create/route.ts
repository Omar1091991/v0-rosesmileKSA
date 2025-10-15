import { NextResponse } from "next/server"
import { google } from "googleapis"

import GOOGLE_CREDENTIALS from "@/lib/google-credentials.json"

export async function POST(request: Request) {
  try {
    const { sheetName } = await request.json()

    if (!sheetName) {
      return NextResponse.json({ error: "اسم الجدول مطلوب" }, { status: 400 })
    }

    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const drive = google.drive({ version: "v3", auth })

    // Try to create the spreadsheet
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: sheetName,
        },
        sheets: [
          {
            properties: {
              title: "الحجوزات",
            },
          },
        ],
      },
    })

    const spreadsheetId = createResponse.data.spreadsheetId

    if (!spreadsheetId) {
      throw new Error("فشل في إنشاء Google Sheet")
    }

    // Add header row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "الحجوزات!A1:G1",
      valueInputOption: "RAW",
      requestBody: {
        values: [["التاريخ والوقت", "الاسم الكامل", "رقم الهاتف", "الخدمة", "التاريخ", "الوقت", "ملاحظات"]],
      },
    })

    // Format header row
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
                  backgroundColor: { red: 0.2, green: 0.4, blue: 0.8 },
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    fontSize: 12,
                    bold: true,
                  },
                  horizontalAlignment: "CENTER",
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
            },
          },
        ],
      },
    })

    // Make the sheet publicly writable
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        role: "writer",
        type: "anyone",
      },
    })

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`

    return NextResponse.json({
      success: true,
      sheetId: spreadsheetId,
      sheetUrl,
      message: "تم إنشاء Google Sheet بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error creating Google Sheet:", error)

    let errorMessage = "فشل في إنشاء Google Sheet"
    let helpText = ""
    let helpLink = ""

    if (error.message?.includes("permission") || error.code === 403) {
      errorMessage = "لا توجد صلاحيات كافية - يجب تفعيل Google APIs"
      helpText =
        "يجب تفعيل Google Sheets API و Google Drive API في Google Cloud Console. اذهب إلى صفحة إعدادات Google للحصول على التعليمات الكاملة."
      helpLink = "/dashboard/google-setup"
    } else if (error.code === 401) {
      errorMessage = "خطأ في المصادقة"
      helpText = "تحقق من صحة بيانات Service Account"
    } else if (error.message?.includes("API has not been used")) {
      errorMessage = "Google Sheets API غير مفعّل"
      helpText = "يجب تفعيل Google Sheets API في مشروع Google Cloud"
      helpLink = `https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=${GOOGLE_CREDENTIALS.project_id}`
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
        help: helpText,
        helpLink,
        projectId: GOOGLE_CREDENTIALS.project_id,
        serviceAccountEmail: GOOGLE_CREDENTIALS.client_email,
      },
      { status: error.code || 500 },
    )
  }
}
