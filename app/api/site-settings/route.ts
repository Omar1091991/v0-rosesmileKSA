import { NextResponse } from "next/server"

async function getDbQuery() {
  try {
    const db = await import("@/lib/db")
    return db.query
  } catch (error) {
    console.error("[v0] Failed to load database module:", error)
    return null
  }
}

export async function GET() {
  try {
    console.log("[v0] GET /api/site-settings - Starting...")

    const query = await getDbQuery()
    if (!query) {
      console.error("[v0] Database module not available")
      return NextResponse.json(
        {
          settings: [],
          error: "قاعدة البيانات غير متاحة",
        },
        { status: 200 },
      )
    }

    const result = await query("SELECT * FROM site_settings ORDER BY setting_key")
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
    const query = await getDbQuery()
    if (!query) {
      return NextResponse.json({ error: "قاعدة البيانات غير متاحة" }, { status: 200 })
    }

    const body = await request.json()
    const result = await query(
      `INSERT INTO site_settings (setting_key, setting_value, setting_type, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        body.setting_key || body.key,
        body.setting_value || body.value,
        body.setting_type || body.type || "text",
        body.category || "general",
      ],
    )

    return NextResponse.json(result.rows[0], { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error creating site setting:", error)
    return NextResponse.json({ error: error.message || "فشل في إضافة الإعداد" }, { status: 200 })
  }
}

export async function PATCH(request: Request) {
  try {
    const query = await getDbQuery()
    if (!query) {
      return NextResponse.json({ error: "قاعدة البيانات غير متاحة" }, { status: 200 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await query(
      `UPDATE site_settings SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id],
    )

    return NextResponse.json(result.rows[0], { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error updating site setting:", error)
    return NextResponse.json({ error: error.message || "فشل في تحديث الإعداد" }, { status: 200 })
  }
}

export async function DELETE(request: Request) {
  try {
    const query = await getDbQuery()
    if (!query) {
      return NextResponse.json({ error: "قاعدة البيانات غير متاحة" }, { status: 200 })
    }

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
