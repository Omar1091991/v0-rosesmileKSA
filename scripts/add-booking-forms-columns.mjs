import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.STORAGE_DATABASE_URL)

async function addBookingFormsColumns() {
  try {
    console.log("Adding missing columns to booking_forms table...")

    // Add name_ar and name_en columns
    await sql`
      ALTER TABLE booking_forms 
      ADD COLUMN IF NOT EXISTS name_ar VARCHAR(255),
      ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
      ADD COLUMN IF NOT EXISTS image_url TEXT,
      ADD COLUMN IF NOT EXISTS is_main BOOLEAN DEFAULT false
    `

    // Update existing records to copy title to name if name is null
    await sql`
      UPDATE booking_forms 
      SET name_ar = title_ar 
      WHERE name_ar IS NULL AND title_ar IS NOT NULL
    `

    await sql`
      UPDATE booking_forms 
      SET name_en = title_en 
      WHERE name_en IS NULL AND title_en IS NOT NULL
    `

    console.log("✅ Successfully added missing columns to booking_forms table")
  } catch (error) {
    console.error("❌ Error adding columns:", error)
    throw error
  }
}

addBookingFormsColumns()
