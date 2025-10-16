#!/usr/bin/env node

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function addImageUrlColumn() {
  try {
    console.log('Adding image_url column to booking_forms table...')
    
    // Check if column already exists
    const checkResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'booking_forms' 
      AND column_name = 'image_url'
    `
    
    if (checkResult.length > 0) {
      console.log('✅ Column image_url already exists in booking_forms table')
      return
    }
    
    // Add the image_url column
    await sql`
      ALTER TABLE booking_forms 
      ADD COLUMN image_url TEXT
    `
    
    console.log('✅ Successfully added image_url column to booking_forms table')
  } catch (error) {
    console.error('❌ Error adding image_url column:', error)
    throw error
  }
}

addImageUrlColumn()
  .then(() => {
    console.log('Migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
