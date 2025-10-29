import { neon, Pool } from "@neondatabase/serverless"

const connectionString = process.env.SUPABASE_POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.warn("[v0] ⚠️ SUPABASE_POSTGRES_URL غير متاح - تأكد من إضافة متغير البيئة في Vercel")
}

// إنشاء Pool للاستعلامات العادية
const pool = connectionString ? new Pool({ connectionString }) : null

// إنشاء SQL client للاستعلامات باستخدام tagged templates
const sql = connectionString ? neon(connectionString) : null

// دالة للاستعلام باستخدام parameterized queries
export async function query(text: string, params?: any[]) {
  if (!pool) {
    console.error("[v0] ❌ لا يوجد اتصال بقاعدة البيانات - SUPABASE_POSTGRES_URL غير محدد")
    throw new Error("Database connection not configured. Please add SUPABASE_POSTGRES_URL environment variable.")
  }

  console.log("[v0] الاستعلام:", text.substring(0, 100))

  try {
    const result = await pool.query(text, params || [])
    console.log("[v0] ✅ نجح الاستعلام - عدد الصفوف:", result.rows.length)

    return {
      rows: result.rows || [],
      rowCount: result.rowCount || 0,
    }
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في الاستعلام:", error.message)
    console.error("[v0] الاستعلام:", text.substring(0, 200))
    throw error
  }
}

// دالة مساعدة للاستعلامات باستخدام tagged templates
export async function queryTemplate(strings: TemplateStringsArray, ...values: any[]) {
  if (!sql) {
    throw new Error("Database connection not configured. Please add SUPABASE_POSTGRES_URL environment variable.")
  }

  try {
    const result = await sql(strings, ...values)
    return {
      rows: result || [],
      rowCount: result?.length || 0,
    }
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في الاستعلام:", error.message)
    throw error
  }
}

export const db = {
  query,
  sql: queryTemplate,
}

export { sql }
