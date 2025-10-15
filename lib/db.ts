import { Pool } from "pg"

let pool: Pool | null = null

export function getDb() {
  if (!process.env.DATABASE_URL) {
    console.warn("[v0] DATABASE_URL is not set. Database operations will fail.")
    throw new Error("DATABASE_URL environment variable is required")
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  try {
    const db = getDb()
    return await db.query(text, params)
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

export const db = {
  query,
  getDb,
}
