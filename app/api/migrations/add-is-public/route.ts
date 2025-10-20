import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST() {
  try {
    console.log("[v0] 🔄 بدء migration لإضافة عمود is_public...")

    if (!process.env.DATABASE_URL) {
      console.error("[v0] ❌ DATABASE_URL غير موجود")
      return NextResponse.json({ error: "DATABASE_URL غير محدد في متغيرات البيئة" }, { status: 500 })
    }

    console.log("[v0] ✅ DATABASE_URL موجود")

    const sql = neon(process.env.DATABASE_URL)
    console.log("[v0] ✅ تم إنشاء اتصال SQL")

    console.log("[v0] 🔄 تنفيذ ALTER TABLE...")

    await sql`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true
    `

    console.log("[v0] 🔄 تحديث الخدمات الموجودة...")

    await sql`
      UPDATE services SET is_public = true WHERE is_public IS NULL
    `

    console.log("[v0] 🔄 إنشاء فهرس...")

    await sql`
      CREATE INDEX IF NOT EXISTS idx_services_is_public ON services(is_public)
    `

    console.log("[v0] ✅ تم إضافة عمود is_public بنجاح")

    return NextResponse.json({ message: "تم إضافة عمود is_public بنجاح" }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في migration:", error)
    return NextResponse.json(
      {
        error: error.message || "فشل في إضافة عمود is_public",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
