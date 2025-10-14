import { NextResponse } from "next/server"
import { google } from "googleapis"

const GOOGLE_CREDENTIALS = {
  type: "service_account",
  project_id: "medical-rose-smile",
  private_key_id: "741d06699e36731f203d4d2d2bad20a80a6b9164",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDSiAK/gx05cx22\nEi73Vz66slFNpzCwGRDVgoiw8bM9mJr8vGQMwwhhzYb4rPwF9VnpNAdpN472gX8q\nyjlGh9X/XjmRxVvr2LGCM5s9UQ+ev17vfNYLlp1KQy7DAO5Dih4bXRBY9bM3NS77\nzvAAcuqpe8XiAWyqvOAwa1Y8iP6SqnvZVOID4eE+ZkXJUd6e/IpjDcXIjEOa5pVk\npSVjdA1BspiveoQTt4LlNJ9PnsqAOavTLBVox3yzH+JQey+u3Q+RSQwFU7OTii7y\n5S0kBNo4ur+TwpRvmh5gSyqRwG3/NP//wQtOpNmInu2uLLABTBW5vNi/Ae05wckb\njqhlt+1lAgMBAAECggEABFFFvSezMbpqoZE95VSktK9ze2QyW2ooLji/FOHgCyNW\nCljStHBLe7X7Tp49jOG7Nk0a2c2J4QRG11nOUuP2P4ZvJ84kVHHdMg5c4KUI7Ph/\nuemVeidckmlOTDF4sWnjtCv0ad6gDkHI9OEJivjQVylypW/iCp5U+qk424Tzs45B\n7fmcqwSfr/Kn/KpcSRLBv/hyPBkVMkbUwXjZ8sSSscmtioRGhtRxhiOpWOEsvvQl\nGb7SkY93tDNvRKJcnHGrQPgwNaqX0vcEkdFw6VmW+3kCd9ynUcXvxVZGc8WRStwL\nI/e3P+8Ejcsn45jADi8614vGLI4kHQaatLG5YpzAAQKBgQD8LTfofjzsFaxUKkz1\n2pFLbzrpf0ZbApYPcYqEpmCczv2mfNFMq2Q8bkx1Vt68LJ25RGwkQJWe4hSsNruo\nTY7bZtxn+8ww0GSWPOKPS1QZaql6Z5YSZORMWDjjtwsyArdj81bfSc6lLA1rmcaK\nzQ/h//eXzXx57pwc6ZoZjBnJpQKBgQDVuScjToqJnyMZXpJxQY3BewY//fl4t4wi\n2CGYbh6W2wRP4Ad+b2DsEVkGDyCCHJUUe7eAUnk+pEFoX4hvOgOYPA3wouZ3CXZy\ndN2GdSqYOLxUPqB5MtoZBut1s9jXVWEJwrpSLk9BKNBs++VzHwm4h7+XvOPMmFgC\nbIpB1WbIwQKBgQCzi2pj8QVlPaUdo6R54y1RnRc/yiuIftXilv99pIvi+YklMXc/\ndEQAtrNfVANvzQBbOTkZspYUsnjviGSh1t6gnaLNsjxWgPks8pqIVaTCF+wkx33V\nCNp29NVEZD3nVIHH+yheAEnN1giUFL+Eca4eRcW94kL++YFTIItkJxjxNQKBgANC\n1/4J7MM80mRItSNVRLx3DBld3rig1FqTwa95vq2+mco+ON8NBAWWHi2hfXV+yieN\n27bxizgReY4GJybLU9K219+cHLgkRNJqRhcPIp8//l+qtPgkdn97Q4yAOgbPHrPv\nbLhkTIFKBiQjk9S13IgcSigekbtFd9JRpaprfy4BAoGBAMJi1WJqWsBFf5lkY3pe\nQgJ5rxl3yiu13JLPNKAc6iMYQfwhSZ1LGmK180AR9xa0ihLgyWGcp5hEmwW0FEED\nMeM2NcegD6BmmkN6F0eR4K/9blZjMDtViEpMnpzxFPzoAmcOVcOQ4DbNEGgQmMKa\nk5EnqjOliEcfzUnmTFcpGyVV\n-----END PRIVATE KEY-----\n",
  client_email: "rosesmile-sheets-connectorv0@medical-rose-smile.iam.gserviceaccount.com",
  client_id: "112534401080956123656",
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
