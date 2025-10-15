import { Pool } from "pg"

let railwayPool: Pool | null = null

export function createRailwayClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required for Railway")
  }

  if (!railwayPool) {
    railwayPool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })

    railwayPool.on("error", (err) => {
      console.error("[v0] Railway database error:", err)
    })
  }

  return {
    query: async (text: string, params?: any[]) => {
      try {
        const result = await railwayPool!.query(text, params)
        return result
      } catch (error) {
        console.error("[v0] Railway query error:", error)
        throw error
      }
    },
    end: () => railwayPool?.end(),
  }
}
