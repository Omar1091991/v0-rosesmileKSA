import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST() {
  console.log("[v0] 🔄 بدء إضافة عمود custom_services...")

  try {
    if (!process.env.DATABASE_URL) {
      console.error("[v0] ❌ DATABASE_URL غير محدد")
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL غير محدد. يرجى إضافة DATABASE_URL في متغيرات البيئة.",
        },
        { status: 500 },
      )
    }

    console.log("[v0] ✅ DATABASE_URL موجود")

    const sql = neon(process.env.DATABASE_URL)
    console.log("[v0] ✅ تم إنشاء اتصال SQL")

    console.log("[v0] 🔄 تنفيذ ALTER TABLE...")
    await sql`
      ALTER TABLE booking_forms 
      ADD COLUMN IF NOT EXISTS custom_services JSONB DEFAULT '[]'::jsonb
    `

    console.log("[v0] ✅ تم إضافة عمود custom_services بنجاح")

    return NextResponse.json({
      success: true,
      message: "تم إضافة عمود custom_services بنجاح إلى جدول booking_forms",
    })
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في إضافة عمود custom_services:", error)

    const errorMessage = error?.message || error?.toString() || "حدث خطأ غير معروف"
    const errorDetails = {
      message: errorMessage,
      code: error?.code,
      detail: error?.detail,
      hint: error?.hint,
      stack: error?.stack,
    }

    console.error("[v0] تفاصيل الخطأ:", JSON.stringify(errorDetails, null, 2))

    return NextResponse.json(
      {
        success: false,
        error: `فشل في إضافة عمود custom_services: ${errorMessage}`,
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}
