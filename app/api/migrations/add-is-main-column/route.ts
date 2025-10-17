import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST() {
  try {
    // Add is_main column if it doesn't exist
    await db.query(`
      ALTER TABLE booking_forms 
      ADD COLUMN IF NOT EXISTS is_main BOOLEAN DEFAULT false
    `)

    // Set the first booking form as main if no main form exists
    const result = await db.query(`
      UPDATE booking_forms 
      SET is_main = true 
      WHERE id = (
        SELECT id FROM booking_forms 
        ORDER BY order_index, id 
        LIMIT 1
      )
      AND NOT EXISTS (
        SELECT 1 FROM booking_forms WHERE is_main = true
      )
      RETURNING id
    `)

    return NextResponse.json({
      success: true,
      message: "تم إضافة عمود is_main بنجاح",
      mainFormId: result.rows[0]?.id || null,
    })
  } catch (error: any) {
    console.error("Error adding is_main column:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
