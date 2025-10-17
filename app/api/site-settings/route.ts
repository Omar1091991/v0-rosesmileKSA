import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] GET /api/site-settings - Starting...")

    const result = await query("SELECT * FROM site_settings ORDER BY setting_key")
    console.log("[v0] Successfully fetched", result.rows.length, "settings")

    const settings = result.rows.map((row: any) => ({
      id: row.id,
      key: row.setting_key,
      value_ar: row.setting_value,
      value_en: row.setting_value,
      type: row.setting_type,
      category: row.category,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))

    return NextResponse.json({ settings })
  } catch (error: any) {
    console.error("[v0] Error fetching site settings:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const settingKey = body.setting_key || body.key
    const settingValue = body.setting_value || body.value_ar || body.value
    const settingType = body.setting_type || body.type || "text"
    const category = body.category || "general"

    const result = await query(
      `INSERT INTO site_settings (setting_key, setting_value, setting_type, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [settingKey, settingValue, settingType, category],
    )

    const setting = result.rows[0]
    return NextResponse.json({
      id: setting.id,
      key: setting.setting_key,
      value_ar: setting.setting_value,
      value_en: setting.setting_value,
      type: setting.setting_type,
      category: setting.category,
    })
  } catch (error: any) {
    console.error("[v0] Error creating site setting:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "معرف الإعداد مطلوب" }, { status: 400 })
    }

    const settingValue = body.setting_value || body.value_ar || body.value

    const result = await query(
      `UPDATE site_settings 
       SET setting_value = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [settingValue, id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "الإعداد غير موجود" }, { status: 404 })
    }

    const setting = result.rows[0]
    return NextResponse.json({
      id: setting.id,
      key: setting.setting_key,
      value_ar: setting.setting_value,
      value_en: setting.setting_value,
      type: setting.setting_type,
      category: setting.category,
    })
  } catch (error: any) {
    console.error("[v0] Error updating site setting:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "معرف الإعداد مطلوب" }, { status: 400 })
    }

    await query("DELETE FROM site_settings WHERE id = $1", [id])
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error deleting site setting:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
