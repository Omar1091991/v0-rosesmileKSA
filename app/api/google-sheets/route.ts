import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { full_name, phone, service_name, notes, timestamp, sheet_id } = body

    const spreadsheetId = sheet_id

    if (!spreadsheetId) {
      console.log("[v0] Google Sheet ID not provided")
      return NextResponse.json({
        success: true,
        message: "Booking saved to database (Google Sheets not configured)",
      })
    }

    const credentials = {
      type: "service_account",
      project_id: "medical-rose-smile",
      private_key_id: "0b6233770e6adf9764dc1edf8276dbfb37d3ed1d",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3NChg7U/7z1GZ\nVg4ZPJbcDAwCYkBmrCSbu8LAzNcISNZfR9bkjPmYRsxJaZLqsGj/a12jcX619HAL\nYWNigXwGAzg5ZiuvvUiwFH4m4VK0Iy1kQD+vK1Z+f8FUHNespXKovg4Yigq9andS\nY4e5q+DUXFSgFaujWoowWgexCAkH0LOBirbpIDfNV4ef8dMhF5Q0PbQdiwzz5VTE\n5IGdXh1rI3mCYDEfiEqwzMPN9EaMm4XiKNjKTRYlZ5KImojUlD+vAid7DCc/SjB8\nsXnSjnPH+CuBVoNBs5hCzs+vN1oMCmHvz8aXPwWlKW63k3AMmZ/dmzIcEsK44CHa\nGytGASujAgMBAAECggEAHeYBtvvTw1UszHj6WQ0F08iVhygQuZDbcpz8Zimn6D62\n2ZroS6lkLIFVYp+7rdh3ckPL5tolYz2OsZTFuvRF0NdirB9r/sTF4ZKemerI7AQX\nqtY/bm+EsKVZ4EfKvO7NXROTSlbw9MO00HnU0yzlRtMArpWKyuCCT+zJd49HpgIW\nYxOTNiGT6Zf8KfuQQsSZbW4h+Gftp5pU/bIt4DzHz/gmc2VaT+zx43IUTpsmQQbB\ndnjejxhAe+A1RLDZW9zutslfjPi6F+nEIYFIDy8+XKPoZorf3CglcjefkggQf3KQ\nJQRgP6a+gcGfrbRB9Le4ty2l94c65F0VCgioOcDgrQKBgQD73B18Gj3AKulrui6X\nc2cdSnhttRGK6vcEMX3v047O9Z414zAANP4L/77e7wFJfbfDJGAx56B2+u2BX7+p\n+hy8cHMHXS0+ayNNwBon1Zjz3BRVALQIFI57O6kNUXicRLHk9GfYhzz/AHNzO9+t\nLH0h4WS+X7yPVveokddmLfZ4DQKBgQC6Nx8reP9zsWqDM/pNaycMGecuiB6ZqIUU\nuZLJyXWAAtjxoV791/K3B2niIDjGdSEMHAuGwM91KxtEkCUay1UwBy7EDaLOb8tn\nZ0/M0BvkC6tr4kWso00qqY8OQuX+mF8FNTignoTUHbBPrgQGQP9Ey1Du2sooPQMw\nGOp/OpoWbwKBgQCZmQPiS56dM45nRIRlmNup4WDQhzzLm8BJrmU/faX6UZDLDGKZ\nvbexWabuDpSaXTFUsTp5NOmHpkByRhJ9dytPQMTmGM0e4/gD0sQgxwMgtXcw39zr\nkJ3USe4vUSBdLQfQub0bMF7ipUPDYyBmXFtz7iGieIBmaoNfKpJSnnVRgQKBgFQf\nLp+O66eyEDHxOzPaIiufUAZ/S4OS03vHUX6C2efYYXTWt3jpIyZ33OdgMwXESAeW\na8aWN6HwtULF810lWfh2ZjP/DPtBGZw+2Zfms5LTir8T2vHgW63YJ14D7q6S2uoZ\nXtmAgvTn7IwySnMgzbCgQJGGmSiQV25U8ypCqPVVAoGBAIxBi6/0NoUJaglSHrUJ\n6+ZBR7Z1KVKvd5t/2mAkqdp0PDi1Um5AjNOf6blW93AGsXHSUgGhkaTHfmUCxbTW\nMATbCXLjOhXQHJx4Sl+lBELtSeVeDpU0NWS5v3yeZucZuGJgfNu9vamrWgJwWK0h\nG05pVwGAivkUEjUi1oU9A0nB\n-----END PRIVATE KEY-----\n",
      client_email: "rosesmile-sheets-connectorv0@medical-rose-smile.iam.gserviceaccount.com",
      client_id: "112534401080956123656",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/rosesmile-sheets-connectorv0%40medical-rose-smile.iam.gserviceaccount.com",
    }

    // إعداد Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    // إضافة البيانات إلى Google Sheet
    const values = [[new Date(timestamp).toLocaleString("ar-SA"), full_name, phone, service_name, notes || "-"]]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "الحجوزات!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Booking submitted successfully to Google Sheets",
    })
  } catch (error: any) {
    console.error("[v0] Error in Google Sheets API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit to Google Sheets",
      },
      { status: 500 },
    )
  }
}
