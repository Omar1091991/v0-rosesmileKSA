import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // إضافة عمود password إذا لم يكن موجوداً
    await db.query(`
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS password TEXT;
    `)

    return NextResponse.json({
      success: true,
      message: "تم إضافة عمود كلمة المرور بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error adding password column:", error)
    return NextResponse.json(
      {
        error: error.message || "فشل في إضافة عمود كلمة المرور",
      },
      { status: 500 },
    )
  }
}
