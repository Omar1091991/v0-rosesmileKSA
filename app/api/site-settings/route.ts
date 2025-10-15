import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] GET /api/site-settings - Fetching settings...")

    if (!process.env.DATABASE_PUBLIC_URL && !process.env.DATABASE_URL) {
      console.error("[v0] DATABASE_URL not configured")
      return NextResponse.json(
        {
          settings: [],
          error: "قاعدة البيانات غير مهيأة",
        },
        { status: 200 },
      )
    }

    let tableExists = false
    try {
      const tableCheck = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'site_settings'
        )
      `)
      tableExists = tableCheck.rows[0].exists
      console.log("[v0] Table exists:", tableExists)
    } catch (tableError: any) {
      console.error("[v0] Error checking table:", tableError.message)
      return NextResponse.json(
        {
          settings: [],
          error: "فشل في التحقق من جدول الإعدادات",
        },
        { status: 200 },
      )
    }

    if (!tableExists) {
      console.log("[v0] site_settings table does not exist")
      return NextResponse.json(
        {
          settings: [],
          error: "جدول الإعدادات غير موجود. يرجى تشغيل سكريبت التهيئة",
        },
        { status: 200 },
      )
    }

    const result = await query("SELECT * FROM site_settings ORDER BY key")
    console.log("[v0] Successfully fetched", result.rows.length, "settings")

    return NextResponse.json({ settings: result.rows }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error in GET /api/site-settings:", error)

    return NextResponse.json(
      {
        settings: [],
        error: error.message || "فشل في جلب إعدادات الموقع",
      },
      { status: 200 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("[v0] POST /api/site-settings - Creating new setting...")
    const body = await request.json()
    console.log("[v0] Request body:", body)

    const result = await query(
      `INSERT INTO site_settings (key, value_ar, value_en, type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [body.key, body.value_ar, body.value_en || body.value_ar, body.type || "text"],
    )

    console.log("[v0] Successfully created setting:", result.rows[0])
    return NextResponse.json(result.rows[0], { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error creating site setting:", error)
    return NextResponse.json({ error: error.message || "فشل في إضافة الإعداد" }, { status: 200 })
  }
}

export async function PATCH(request: Request) {
  try {
    console.log("[v0] PATCH /api/site-settings - Updating setting...")
    const body = await request.json()
    const { id, ...updates } = body
    console.log("[v0] Updating setting ID:", id, "with:", updates)

    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await query(
      `UPDATE site_settings SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id],
    )

    console.log("[v0] Successfully updated setting:", result.rows[0])
    return NextResponse.json(result.rows[0], { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error updating site setting:", error)
    return NextResponse.json({ error: error.message || "فشل في تحديث الإعداد" }, { status: 200 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "معرف الإعداد مطلوب" }, { status: 200 })
    }

    await query("DELETE FROM site_settings WHERE id = $1", [id])

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error deleting site setting:", error)
    return NextResponse.json({ error: error.message || "فشل في حذف الإعداد" }, { status: 200 })
  }
}
