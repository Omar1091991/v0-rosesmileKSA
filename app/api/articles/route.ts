import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      // جلب مقال واحد بناءً على المعرف
      console.log("[v0] Fetching article with ID:", id)
      const result = await query("SELECT * FROM articles WHERE id = $1", [id])
      console.log("[v0] Found article:", result.rows.length > 0 ? result.rows[0].title_ar : "not found")
      return NextResponse.json(result.rows)
    } else {
      // جلب جميع المقالات
      const result = await query("SELECT * FROM articles ORDER BY created_at DESC")
      return NextResponse.json(result.rows)
    }
  } catch (error: any) {
    console.error("[v0] Error fetching articles:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await query(
      `INSERT INTO articles (title_ar, title_en, content_ar, content_en, excerpt_ar, excerpt_en, image_url, author_ar, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        body.title_ar,
        body.title_en,
        body.content_ar,
        body.content_en,
        body.excerpt_ar,
        body.excerpt_en,
        body.image_url,
        body.author_ar,
        body.is_published ?? true,
      ],
    )

    return NextResponse.json({ article: result.rows[0] })
  } catch (error: any) {
    console.error("[v0] Error creating article:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const allowedFields = [
      "title_ar",
      "title_en",
      "content_ar",
      "content_en",
      "excerpt_ar",
      "excerpt_en",
      "image_url",
      "author_ar",
      "author_en",
      "is_published",
      "published_at",
    ]

    const filteredUpdates: Record<string, any> = {}
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key]
      }
    })

    const fields = Object.keys(filteredUpdates)
    const values = Object.values(filteredUpdates)
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const result = await query(`UPDATE articles SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [
      ...values,
      id,
    ])

    return NextResponse.json({ article: result.rows[0] })
  } catch (error: any) {
    console.error("[v0] Error updating article:", error)
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

    await query("DELETE FROM articles WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting article:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
