import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function addIsMainColumn() {
  try {
    console.log("Adding is_main column to booking_forms table...")

    // Add is_main column if it doesn't exist
    await sql`
      ALTER TABLE booking_forms 
      ADD COLUMN IF NOT EXISTS is_main BOOLEAN DEFAULT false
    `

    console.log("✅ Successfully added is_main column")

    // Set the first booking form as main if no main form exists
    const result = await sql`
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
    `

    if (result.length > 0) {
      console.log(`✅ Set booking form ${result[0].id} as main form`)
    }

    console.log("✅ Migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  }
}

addIsMainColumn()
