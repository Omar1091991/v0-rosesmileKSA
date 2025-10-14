import { NextResponse } from "next/server"
import { createRailwayClient } from "@/lib/railway-db"
import fs from "fs"
import path from "path"

export async function POST() {
  try {
    console.log("[v0] بدء إعداد قاعدة بيانات Railway...")

    // قراءة سكريبت SQL
    const sqlPath = path.join(process.cwd(), "scripts", "railway_complete_setup.sql")
    const sqlScript = fs.readFileSync(sqlPath, "utf-8")

    console.log("[v0] تم قراءة السكريبت بنجاح")

    // الاتصال بقاعدة البيانات
    const db = createRailwayClient()

    console.log("[v0] تنفيذ السكريبت...")

    // تنفيذ السكريبت
    await db.query(sqlScript)

    console.log("[v0] تم تنفيذ السكريبت بنجاح")

    // التحقق من الجداول
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    const tables = tablesResult.rows.map((row: any) => row.table_name)

    console.log("[v0] الجداول المنشأة:", tables)

    await db.end()

    return NextResponse.json({
      success: true,
      message: "تم إنشاء قاعدة البيانات بنجاح",
      tables,
    })
  } catch (error: any) {
    console.error("[v0] خطأ في إعداد قاعدة البيانات:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stack,
      },
      { status: 500 },
    )
  }
}
