import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { google } from "googleapis"

// Function to create a Google Sheet directly
async function createGoogleSheet(sheetName: string) {
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
      scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const drive = google.drive({ version: "v3", auth })

    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: sheetName },
        sheets: [{ properties: { title: "الحجوزات" } }],
      },
    })

    const spreadsheetId = createResponse.data.spreadsheetId
    if (!spreadsheetId) throw new Error("فشل في إنشاء Google Sheet")

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "الحجوزات!A1:E1",
      valueInputOption: "RAW",
      requestBody: {
        values: [["التاريخ والوقت", "الاسم الكامل", "رقم الهاتف", "الخدمة", "ملاحظات"]],
      },
    })

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.2, green: 0.4, blue: 0.8 },
                  textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 12, bold: true },
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
      requestBody: { role: "writer", type: "anyone" },
    })

    return { sheetId: spreadsheetId, sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` }
  } catch (error) {
    console.error("[v0] Error creating Google Sheet:", error)
    throw error
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const formResult = await db.query("SELECT * FROM booking_forms WHERE id = $1", [id])
      if (formResult.rows.length === 0) {
        return NextResponse.json({ error: "النموذج غير موجود" }, { status: 404 })
      }

      const servicesResult = await db.query(
        `
        SELECT s.id, s.title_ar, s.title_en
        FROM booking_form_services bfs
        JOIN services s ON bfs.service_id = s.id
        WHERE bfs.booking_form_id = $1
      `,
        [id],
      )

      const form = {
        ...formResult.rows[0],
        booking_form_services: servicesResult.rows.map((s) => ({ services: s })),
      }

      return NextResponse.json(form)
    }

    const formsResult = await db.query("SELECT * FROM booking_forms ORDER BY order_index")
    const forms = []

    for (const form of formsResult.rows) {
      const servicesResult = await db.query(
        `
        SELECT s.id, s.title_ar, s.title_en
        FROM booking_form_services bfs
        JOIN services s ON bfs.service_id = s.id
        WHERE bfs.booking_form_id = $1
      `,
        [form.id],
      )

      forms.push({
        ...form,
        booking_form_services: servicesResult.rows.map((s) => ({ services: s })),
      })
    }

    return NextResponse.json(forms)
  } catch (error: any) {
    console.error("[v0] Error fetching booking forms:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { service_ids, ...formData } = body

    console.log("[v0] Creating booking form with data:", formData)

    let googleSheetId = formData.google_sheet_id

    if (!googleSheetId) {
      console.log("[v0] Creating Google Sheet automatically...")
      try {
        const sheetData = await createGoogleSheet(`نموذج حجز - ${formData.name_ar}`)
        googleSheetId = sheetData.sheetId
        console.log("[v0] Google Sheet created successfully:", googleSheetId)
      } catch (sheetError) {
        console.error("[v0] Error creating Google Sheet:", sheetError)
      }
    }

    if (formData.is_main) {
      await db.query("UPDATE booking_forms SET is_main = false WHERE is_main = true")
    }

    const result = await db.query(
      `
      INSERT INTO booking_forms (name_ar, name_en, description_ar, description_en, image_url, google_sheet_id, is_main, is_active, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        formData.name_ar,
        formData.name_en,
        formData.description_ar,
        formData.description_en,
        formData.image_url,
        googleSheetId,
        formData.is_main,
        formData.is_active,
        formData.order_index,
      ],
    )

    const form = result.rows[0]

    if (service_ids && service_ids.length > 0) {
      for (const service_id of service_ids) {
        await db.query("INSERT INTO booking_form_services (booking_form_id, service_id) VALUES ($1, $2)", [
          form.id,
          service_id,
        ])
      }
    }

    return NextResponse.json(form)
  } catch (error: any) {
    console.error("[v0] Error creating booking form:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, service_ids, ...formData } = body

    if (formData.is_main) {
      await db.query("UPDATE booking_forms SET is_main = false WHERE is_main = true AND id != $1", [id])
    }

    const fields = Object.keys(formData)
    const values = Object.values(formData)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await db.query(
      `UPDATE booking_forms SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id],
    )

    if (service_ids !== undefined) {
      await db.query("DELETE FROM booking_form_services WHERE booking_form_id = $1", [id])

      if (service_ids.length > 0) {
        for (const service_id of service_ids) {
          await db.query("INSERT INTO booking_form_services (booking_form_id, service_id) VALUES ($1, $2)", [
            id,
            service_id,
          ])
        }
      }
    }

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error updating booking form:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    await db.query("DELETE FROM booking_forms WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting booking form:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
