import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export async function POST() {
  try {
    console.log("[v0] Starting booking columns migration...")

    // قراءة ملف SQL
    const sqlPath = join(process.cwd(), "scripts", "001_add_booking_columns.sql")
    const sql = readFileSync(sqlPath, "utf-8")

    console.log("[v0] Executing SQL migration...")

    // تنفيذ السكريبت
    const result = await db.query(sql)

    console.log("[v0] Migration completed successfully")

    return NextResponse.json({
      success: true,
      message: "تم إضافة الأعمدة المفقودة لجدول الحجوزات بنجاح",
      result: result.rows,
    })
  } catch (error: any) {
    console.error("[v0] Migration error:", error)
    return NextResponse.json(
      {
        error: "فشل في تشغيل migration",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
