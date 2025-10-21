import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export async function POST() {
  try {
    console.log("[v0] 🔧 Starting booking_forms table fix migration...")

    // Read the SQL file
    const sqlPath = join(process.cwd(), "scripts", "002_fix_booking_forms_table.sql")
    const sql = readFileSync(sqlPath, "utf-8")

    console.log("[v0] Executing SQL migration...")

    // Execute the migration
    await db.query(sql)

    console.log("[v0] ✅ Migration completed successfully!")

    return NextResponse.json({
      success: true,
      message: "تم إصلاح جدول booking_forms بنجاح!",
    })
  } catch (error: any) {
    console.error("[v0] ❌ Migration failed:", error.message)
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
