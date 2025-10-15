import { NextResponse } from "next/server"
import { google } from "googleapis"

import GOOGLE_CREDENTIALS from "@/lib/google-credentials.json"

export async function POST(request: Request) {
  try {
    const { sheetName } = await request.json()

    if (!sheetName) {
      return NextResponse.json({ error: "اسم الجدول مطلوب" }, { status: 400 })
    }

    console.log("[v0] Creating Google Sheet with name:", sheetName)
    console.log("[v0] Using service account:", GOOGLE_CREDENTIALS.client_email)
    console.log("[v0] Project ID:", GOOGLE_CREDENTIALS.project_id)

    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
      ],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const drive = google.drive({ version: "v3", auth })

    console.log("[v0] Attempting to create spreadsheet...")

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

    console.log("[v0] Spreadsheet created successfully:", spreadsheetId)

    // Add header row
    console.log("[v0] Adding header row...")
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "الحجوزات!A1:G1",
      valueInputOption: "RAW",
      requestBody: {
        values: [["التاريخ والوقت", "الاسم الكامل", "رقم الهاتف", "الخدمة", "التاريخ", "الوقت", "ملاحظات"]],
      },
    })

    // Format header row
    console.log("[v0] Formatting header row...")
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
    console.log("[v0] Setting permissions...")
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        role: "writer",
        type: "anyone",
      },
    })

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`

    console.log("[v0] Google Sheet created successfully:", sheetUrl)

    return NextResponse.json({
      success: true,
      sheetId: spreadsheetId,
      sheetUrl,
      message: "تم إنشاء Google Sheet بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error creating Google Sheet:", error)
    console.error("[v0] Error details:", {
      message: error.message,
      code: error.code,
      errors: error.errors,
      response: error.response?.data,
    })

    let errorMessage = "فشل في إنشاء Google Sheet"
    let helpText = ""
    let helpLink = ""

    if (error.message?.includes("permission") || error.code === 403 || error.message?.includes("forbidden")) {
      errorMessage = "لا توجد صلاحيات كافية - يجب تفعيل Google APIs"
      helpText = `يجب تفعيل Google Sheets API و Google Drive API في مشروع Google Cloud (${GOOGLE_CREDENTIALS.project_id}). اضغط على الرابط أدناه للتفعيل.`
      helpLink = `/google-sheets-guide`
    } else if (error.code === 401) {
      errorMessage = "خطأ في المصادقة"
      helpText = "تحقق من صحة بيانات Service Account في ملف google-credentials.json"
    } else if (error.message?.includes("API has not been used") || error.message?.includes("not enabled")) {
      errorMessage = "Google APIs غير مفعّلة"
      helpText = `يجب تفعيل Google Sheets API و Google Drive API في مشروع ${GOOGLE_CREDENTIALS.project_id}`
      helpLink = `/google-sheets-guide`
    } else if (error.message?.includes("quota")) {
      errorMessage = "تم تجاوز حد الاستخدام"
      helpText = "تم تجاوز حد استخدام Google Sheets API. حاول مرة أخرى لاحقاً."
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
        help: helpText,
        helpLink,
        projectId: GOOGLE_CREDENTIALS.project_id,
        serviceAccountEmail: GOOGLE_CREDENTIALS.client_email,
        requiredAPIs: [
          {
            name: "Google Sheets API",
            url: `https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=${GOOGLE_CREDENTIALS.project_id}`,
          },
          {
            name: "Google Drive API",
            url: `https://console.cloud.google.com/apis/library/drive.googleapis.com?project=${GOOGLE_CREDENTIALS.project_id}`,
          },
        ],
      },
      { status: error.code || 500 },
    )
  }
}
