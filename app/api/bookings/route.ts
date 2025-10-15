import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { google } from "googleapis"

async function sendToGoogleSheet(bookingData: any, sheetId: string) {
  try {
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
      universe_domain: "googleapis.com",
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    const timestamp = new Date().toLocaleString("ar-EG", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "الحجوزات!A:E",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [timestamp, bookingData.full_name, bookingData.phone, bookingData.service_name, bookingData.notes || ""],
        ],
      },
    })

    console.log("[v0] Data sent to Google Sheet successfully")
  } catch (error) {
    console.error("[v0] Error sending to Google Sheet:", error)
    throw error
  }
}

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM bookings ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Received booking data:", body)

    const result = await db.query(
      `INSERT INTO bookings (full_name, phone, service_name, service_id, notes, status, booking_form_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        body.full_name,
        body.phone,
        body.service_name,
        body.service_id,
        body.notes || "",
        body.status || "pending",
        body.booking_form_id || null,
      ],
    )

    const booking = result.rows[0]
    console.log("[v0] Booking created in database:", booking)

    if (body.booking_form_id) {
      try {
        const formResult = await db.query("SELECT google_sheet_id FROM booking_forms WHERE id = $1", [
          body.booking_form_id,
        ])

        if (formResult.rows.length > 0 && formResult.rows[0].google_sheet_id) {
          const sheetId = formResult.rows[0].google_sheet_id
          console.log("[v0] Sending to Google Sheet:", sheetId)
          await sendToGoogleSheet(body, sheetId)
        } else {
          console.log("[v0] No Google Sheet ID found for this form")
        }
      } catch (sheetError) {
        console.error("[v0] Error sending to Google Sheet:", sheetError)
      }
    }

    return NextResponse.json({ booking })
  } catch (error: any) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await db.query(`UPDATE bookings SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [
      ...values,
      id,
    ])

    return NextResponse.json({ booking: result.rows[0] })
  } catch (error: any) {
    console.error("[v0] Error updating booking:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    await db.query("DELETE FROM bookings WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting booking:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
