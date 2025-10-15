import { Pool } from "pg"

let pool: Pool | null = null

export function getDb() {
  const connectionString = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL

  if (!connectionString) {
    console.error("[v0] DATABASE_PUBLIC_URL or DATABASE_URL is not set. Please configure Railway database.")
    throw new Error("DATABASE_PUBLIC_URL or DATABASE_URL environment variable is required for Railway connection")
  }

  if (!pool) {
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
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  try {
    const db = getDb()
    const result = await db.query(text, params)
    return result
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

export const db = {
  query,
  getDb,
}
