import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST() {
  try {
    console.log("[v0] Starting service subtitle migration...")

    // Check if columns already exist
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      AND column_name IN ('subtitle_ar', 'subtitle_en')
    `
    const checkResult = await db.query(checkQuery)

    if (checkResult.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: "الأعمدة موجودة بالفعل - لا حاجة للتحديث",
      })
    }

    // Add subtitle columns
    const migrationQuery = `
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS subtitle_ar TEXT,
      ADD COLUMN IF NOT EXISTS subtitle_en TEXT;
    `

    await db.query(migrationQuery)

    console.log("[v0] Service subtitle migration completed successfully")

    return NextResponse.json({
      success: true,
      message: "تم إضافة أعمدة العنوان الفرعي بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error in service subtitle migration:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تنفيذ Migration",
      },
      { status: 500 },
    )
  }
}
