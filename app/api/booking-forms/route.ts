import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { google } from "googleapis"
import GOOGLE_CREDENTIALS from "@/lib/google-credentials.json"

// Function to create a Google Sheet directly
async function createGoogleSheet(sheetName: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
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
