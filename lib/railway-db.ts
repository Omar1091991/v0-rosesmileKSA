import { Pool } from "@neondatabase/serverless"

// إنشاء اتصال مع Railway PostgreSQL
export function createRailwayClient() {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:FvUMkvYFIakqHVioZTEIftAPZGnaMrPl@shortline.proxy.rlwy.net:32732/railway"

  const pool = new Pool({ connectionString })

  return {
    query: async (text: string, params?: any[]) => {
      const client = await pool.connect()
      try {
        const result = await client.query(text, params)
        return result
      } finally {
        client.release()
      }
    },
    end: () => pool.end(),
  }
}
