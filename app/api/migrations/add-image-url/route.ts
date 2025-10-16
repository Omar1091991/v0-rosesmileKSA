import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST() {
  try {
    // Check if column already exists
    const checkResult = await db.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'booking_forms' 
       AND column_name = 'image_url'`,
    )

    if (checkResult.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Column image_url already exists in booking_forms table",
        alreadyExists: true,
      })
    }

    // Add the image_url column
    await db.query(`
      ALTER TABLE booking_forms 
      ADD COLUMN image_url TEXT
    `)

    return NextResponse.json({
      success: true,
      message: "Successfully added image_url column to booking_forms table",
    })
  } catch (error: any) {
    console.error("Error adding image_url column:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to add image_url column",
      },
      { status: 500 },
    )
  }
}
