import { Pool } from "pg"

let pool: Pool | null = null

export function getDb() {
  const connectionString = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL

  if (!connectionString) {
    console.error("[v0] DATABASE_PUBLIC_URL or DATABASE_URL is not set. Please configure Railway database.")
    return null
  }

  if (!pool) {
    console.log("[v0] Creating new database pool connection...")
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })

    pool.on("error", (err) => {
      console.error("[v0] Unexpected database error:", err)
    })

    pool.on("connect", () => {
      console.log("[v0] Database pool connected successfully")
    })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  try {
    const db = getDb()
    if (!db) {
      throw new Error("Database connection not available. DATABASE_URL not configured.")
    }
    console.log("[v0] Executing query:", text.substring(0, 100) + "...")
    const result = await db.query(text, params)
    console.log("[v0] Query successful, returned", result.rows.length, "rows")
    return result
  } catch (error: any) {
    console.error("[v0] Database query error:", error.message)
    console.error("[v0] Query was:", text)
    throw error
  }
}

export const db = {
  query,
  getDb,
}
