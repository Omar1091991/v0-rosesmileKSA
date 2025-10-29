// سكريبت لنقل البيانات من Neon إلى Supabase تلقائياً
import { neon } from "@neondatabase/serverless"
import pg from "pg"
const { Pool } = pg

const neonConnectionString = process.env.STORAGE_DATABASE_URL
const supabaseConnectionString = process.env.SUPABASE_POSTGRES_URL

if (!neonConnectionString) {
  console.error("❌ STORAGE_DATABASE_URL غير متاح (Neon)")
  process.exit(1)
}

if (!supabaseConnectionString) {
  console.error("❌ SUPABASE_POSTGRES_URL غير متاح")
  process.exit(1)
}

console.log("🔄 بدء نقل البيانات من Neon إلى Supabase...")

const neonSql = neon(neonConnectionString)
const supabasePool = new Pool({
  connectionString: supabaseConnectionString,
  ssl: { rejectUnauthorized: false }
})

async function migrateTable(tableName, columns) {
  try {
    console.log(`\n🔄 نقل جدول ${tableName}...`)
    
    // جلب البيانات من Neon
    const data = await neonSql`SELECT * FROM ${neonSql(tableName)}`
    
    if (data.length === 0) {
      console.log(`⚠️  جدول ${tableName} فارغ - تخطي`)
      return
    }
    
    console.log(`📊 وجدنا ${data.length} صف في ${tableName}`)
    
    // إدراج البيانات في Supabase
    const client = await supabasePool.connect()
    
    try {
      for (const row of data) {
        const columnNames = Object.keys(row).join(', ')
        const placeholders = Object.keys(row).map((_, i) => `$${i + 1}`).join(', ')
        const values = Object.values(row)
        
        const query = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`
        
        await client.query(query, values)
      }
      
      console.log(`✅ تم نقل ${data.length} صف إلى ${tableName}`)
      
      // تحديث sequence للـ id
      await client.query(`SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), COALESCE(MAX(id), 1)) FROM ${tableName}`)
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error(`❌ خطأ في نقل جدول ${tableName}:`, error.message)
  }
}

async function migrate() {
  try {
    // ترتيب الجداول حسب التبعيات (الجداول المستقلة أولاً)
    const tables = [
      'users',
      'site_settings',
      'doctors',
      'services',
      'departments',
      'doctor_cases',
      'offers',
      'articles',
      'booking_forms',
      'booking_form_services',
      'bookings',
      'gallery'
    ]
    
    for (const table of tables) {
      await migrateTable(table)
    }
    
    console.log("\n✅✅✅ تم نقل جميع البيانات بنجاح! ✅✅✅\n")
    
  } catch (error) {
    console.error("❌ خطأ في عملية النقل:", error)
  } finally {
    await supabasePool.end()
  }
}

migrate()
