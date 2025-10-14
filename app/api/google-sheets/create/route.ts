import { NextResponse } from "next/server"
import { google } from "googleapis"

const GOOGLE_CREDENTIALS = {
  type: "service_account",
  project_id: "medical-rose-smile",
  private_key_id: "0b6233770e6a0e8e0e8e0e8e0e8e0e8e0e8e0e8e",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDGxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\nxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq\n-----END PRIVATE KEY-----\n",
  client_email: "rosesmile-sheets-connectorv0@medical-rose-smile.iam.gserviceaccount.com",
  client_id: "103579579579579579579",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/rosesmile-sheets-connectorv0%40medical-rose-smile.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

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

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "الحجوزات!A1:G1",
      valueInputOption: "RAW",
      requestBody: {
        values: [["التاريخ والوقت", "الاسم الكامل", "رقم الهاتف", "الخدمة", "التاريخ", "الوقت", "ملاحظات"]],
      },
    })

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
    return NextResponse.json({ error: error.message || "فشل في إنشاء Google Sheet" }, { status: 500 })
  }
}
