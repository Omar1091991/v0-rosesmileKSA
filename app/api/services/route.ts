import { NextResponse } from "next/server"

async function getDbQuery() {
  try {
    const { query } = await import("@/lib/db")
    return query
  } catch (error) {
    console.error("[v0] Failed to load database module:", error)
    return null
  }
}

export async function GET() {
  try {
    const query = await getDbQuery()

    if (!query) {
      return NextResponse.json([], { status: 200 })
    }

    const result = await query("SELECT * FROM services ORDER BY order_index")
    return NextResponse.json(result.rows, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error in GET /api/services:", error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const query = await getDbQuery()

    if (!query) {
      return NextResponse.json({ error: "Database not available" }, { status: 200 })
    }

    const body = await request.json()

    const result = await query(
      `INSERT INTO services (title_ar, title_en, subtitle_ar, subtitle_en, description_ar, description_en, icon, image_url, is_active, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        body.title_ar,
        body.title_en || body.title_ar,
        body.subtitle_ar || null,
        body.subtitle_en || body.subtitle_ar || null,
        body.description_ar,
        body.description_en || body.description_ar,
        body.icon,
        body.image_url,
        body.is_active ?? true,
        body.order_index ?? 0,
      ],
    )

    return NextResponse.json(result.rows[0], { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error in POST /api/services:", error)
    return NextResponse.json({ error: error.message }, { status: 200 })
  }
}

export async function PATCH(request: Request) {
  try {
    const query = await getDbQuery()

    if (!query) {
      return NextResponse.json({ error: "Database not available" }, { status: 200 })
    }

    const body = await request.json()

    const result = await query(
      `UPDATE services 
       SET title_ar = $1, title_en = $2, subtitle_ar = $3, subtitle_en = $4, 
           description_ar = $5, description_en = $6, icon = $7, image_url = $8, 
           is_active = $9, order_index = $10
       WHERE id = $11
       RETURNING *`,
      [
        body.title_ar,
        body.title_en,
        body.subtitle_ar,
        body.subtitle_en,
        body.description_ar,
        body.description_en,
        body.icon,
        body.image_url,
        body.is_active,
        body.order_index,
        body.id,
      ],
    )

    return NextResponse.json(result.rows[0], { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error in PATCH /api/services:", error)
    return NextResponse.json({ error: error.message }, { status: 200 })
  }
}

export async function DELETE(request: Request) {
  try {
    const query = await getDbQuery()

    if (!query) {
      return NextResponse.json({ error: "Database not available" }, { status: 200 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    await query("DELETE FROM services WHERE id = $1", [id])
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Error in DELETE /api/services:", error)
    return NextResponse.json({ error: error.message }, { status: 200 })
  }
}
