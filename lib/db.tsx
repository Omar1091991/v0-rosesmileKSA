import { neon } from "@neondatabase/serverless"

const connectionString = process.env.STORAGE_DATABASE_URL

if (!connectionString) {
  console.warn("[v0] ⚠️ STORAGE_DATABASE_URL غير متاح - تأكد من إضافة متغير البيئة في Vercel")
}

const sqlClient = connectionString ? neon(connectionString) : null

export const sql =
  sqlClient ||
  (() => {
    throw new Error("Database connection not configured. Please add STORAGE_DATABASE_URL environment variable.")
  })
// </CHANGE>

export async function query(text: string, params?: any[]) {
  if (!sqlClient) {
    console.error("[v0] ❌ لا يوجد اتصال بقاعدة البيانات - STORAGE_DATABASE_URL غير محدد")
    throw new Error("Database connection not configured. Please add STORAGE_DATABASE_URL environment variable.")
  }

  try {
    let result

    if (params && params.length > 0) {
      result = await (sqlClient as any).query(text, params)
    } else {
      result = await (sqlClient as any).query(text, [])
    }

    if (Array.isArray(result)) {
      return {
        rows: result,
        rowCount: result.length,
      }
    } else {
      return {
        rows: result?.rows || result || [],
        rowCount: result?.rows?.length || result?.length || 0,
      }
    }
  } catch (error: any) {
    console.error("[v0] ❌ خطأ في الاستعلام:", error.message)
    console.error("[v0] الاستعلام:", text.substring(0, 200))
    throw error
  }
}

export const db = {
  query,
}
