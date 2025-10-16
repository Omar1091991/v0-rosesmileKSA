import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST() {
  try {
    console.log("Adding missing columns to booking_forms table...")

    // Add missing columns
    await db.query(`
      ALTER TABLE booking_forms 
      ADD COLUMN IF NOT EXISTS name_ar VARCHAR(255),
      ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
      ADD COLUMN IF NOT EXISTS image_url TEXT,
      ADD COLUMN IF NOT EXISTS is_main BOOLEAN DEFAULT false
    `)

    // Update existing records to copy title to name if name is null
    await db.query(`
      UPDATE booking_forms 
      SET name_ar = title_ar 
      WHERE name_ar IS NULL AND title_ar IS NOT NULL
    `)

    await db.query(`
      UPDATE booking_forms 
      SET name_en = title_en 
      WHERE name_en IS NULL AND title_en IS NOT NULL
    `)

    return NextResponse.json({
      success: true,
      message: "تم إضافة الأعمدة المفقودة بنجاح",
    })
  } catch (error: any) {
    console.error("Error adding columns:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
