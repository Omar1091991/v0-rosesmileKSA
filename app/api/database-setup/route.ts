import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (action === "add_phone_column") {
      console.log("[v0] Running phone column migration...")

      const migrationSQL = `
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                AND column_name = 'phone'
            ) THEN
                ALTER TABLE users ADD COLUMN phone VARCHAR(50);
                RAISE NOTICE 'تم إضافة عمود phone بنجاح';
            ELSE
                RAISE NOTICE 'عمود phone موجود بالفعل';
            END IF;
        END $$;
      `

      await db.query(migrationSQL)
      console.log("[v0] Phone column migration completed successfully")
      return NextResponse.json({ success: true, message: "تم التحقق من عمود phone بنجاح" })
    }

    if (action === "fix_doctor_cases") {
      console.log("[v0] Running doctor cases fix migration...")

      const migrationSQL = `
        ALTER TABLE doctor_cases 
          ALTER COLUMN title_ar DROP NOT NULL,
          ALTER COLUMN title_en DROP NOT NULL,
          ALTER COLUMN description_ar DROP NOT NULL,
          ALTER COLUMN description_en DROP NOT NULL;
      `

      await db.query(migrationSQL)
      console.log("[v0] Doctor cases migration completed successfully")
      return NextResponse.json({ success: true, message: "تم إصلاح جدول حالات الأطباء بنجاح" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] Database setup error:", error)
    return NextResponse.json({ error: error.message || "حدث خطأ أثناء تنفيذ العملية" }, { status: 500 })
  }
}
