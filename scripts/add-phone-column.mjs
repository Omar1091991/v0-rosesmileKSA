import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function addPhoneColumn() {
  try {
    console.log('🔄 إضافة عمود phone إلى جدول users...')
    
    // Check if column already exists
    const checkColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'phone'
    `
    
    if (checkColumn.length > 0) {
      console.log('✅ عمود phone موجود بالفعل')
      return { success: true, message: 'عمود phone موجود بالفعل' }
    }
    
    // Add phone column
    await sql`
      ALTER TABLE users 
      ADD COLUMN phone VARCHAR(50)
    `
    
    console.log('✅ تم إضافة عمود phone بنجاح')
    
    return { 
      success: true, 
      message: 'تم إضافة عمود phone إلى جدول المستخدمين بنجاح' 
    }
    
  } catch (error) {
    console.error('❌ خطأ في إضافة عمود phone:', error)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addPhoneColumn()
    .then(result => {
      console.log('✅ اكتمل:', result.message)
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ فشل:', error.message)
      process.exit(1)
    })
}

export { addPhoneColumn }
