import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST() {
  try {
    console.log("[v0] Initializing doctor_cases table...")

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS doctor_cases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        title_ar TEXT NOT NULL,
        title_en TEXT,
        description_ar TEXT,
        description_en TEXT,
        before_image_url TEXT NOT NULL,
        after_image_url TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_doctor_cases_doctor_id ON doctor_cases(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_doctor_cases_order ON doctor_cases(order_index);
    `

    await query(createTableSQL)

    console.log("[v0] doctor_cases table created successfully")

    return NextResponse.json({
      success: true,
      message: "تم إنشاء جدول حالات الأطباء بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error initializing doctor_cases table:", error)

    // حتى لو حدث خطأ، نتحقق إذا كان الجدول موجود
    try {
      await query("SELECT id FROM doctor_cases LIMIT 1")
      return NextResponse.json({
        success: true,
        message: "جدول حالات الأطباء موجود بالفعل",
      })
    } catch {
      return NextResponse.json(
        {
          error: "فشل في إنشاء جدول حالات الأطباء",
          details: error.message,
        },
        { status: 500 },
      )
    }
  }
}
