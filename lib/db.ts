import { neon } from "@neondatabase/serverless"

const connectionString = process.env.STORAGE_DATABASE_URL

if (!connectionString) {
  console.warn("[v0] ⚠️ STORAGE_DATABASE_URL غير متاح - تأكد من إضافة متغير البيئة في Vercel")
}

const sql = connectionString ? neon(connectionString) : null

export async function query(text: string, params?: any[]) {
  if (!sql) {
    console.error("[v0] ❌ لا يوجد اتصال بقاعدة البيانات - STORAGE_DATABASE_URL غير محدد")
    throw new Error("Database connection not configured. Please add STORAGE_DATABASE_URL environment variable.")
  }

  try {
    console.log("[v0] 🔄 تنفيذ استعلام:", text.substring(0, 100))

    let result

    if (params && params.length > 0) {
      // استخدام sql.query() مع المعاملات
      result = await (sql as any).query(text, params)
    } else {
      // استخدام sql.query() بدون معاملات
      result = await (sql as any).query(text, [])
    }

    console.log("[v0] ✅ نجح الاستعلام - عدد النتائج:", result?.rows?.length || 0)

    return {
      rows: result?.rows || [],
      rowCount: result?.rows?.length || 0,
    }
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في الاستعلام:", error.message)
    console.error("[v0] الاستعلام:", text)
    console.error("[v0] المعاملات:", params)
    throw error
  }
}

export const db = {
  query,
}
