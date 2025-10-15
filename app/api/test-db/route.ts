import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET() {
  try {
    console.log("[v0] Testing database connection...")

    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL environment variable is not set",
          hint: "Please add DATABASE_URL to your environment variables",
        },
        { status: 500 },
      )
    }

    // Log the connection string (hide password)
    const urlWithoutPassword = databaseUrl.replace(/:([^@]+)@/, ":****@")
    console.log("[v0] Connecting to:", urlWithoutPassword)

    // Create a connection pool
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 10000,
    })

    // Test the connection
    const client = await pool.connect()
    console.log("[v0] Connected successfully!")

    // Run a simple query
    const result = await client.query("SELECT NOW() as current_time, version() as pg_version")

    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    client.release()
    await pool.end()

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      connectionString: urlWithoutPassword,
      serverTime: result.rows[0].current_time,
      postgresVersion: result.rows[0].pg_version,
      tables: tablesResult.rows.map((row) => row.table_name),
      tableCount: tablesResult.rows.length,
    })
  } catch (error: any) {
    console.error("[v0] Database connection error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        hint:
          error.code === "ENOTFOUND"
            ? "The database host cannot be found. Make sure you are using the PUBLIC Railway URL, not the internal one."
            : "Check your database connection string and network settings",
      },
      { status: 500 },
    )
  }
}
