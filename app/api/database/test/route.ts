import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Testing database connection...")

    const tables = [
      "profiles",
      "services",
      "doctors",
      "departments",
      "offers",
      "articles",
      "bookings",
      "gallery",
      "site_settings",
      "booking_forms",
      "doctor_cases",
    ]

    const results: any = {}

    for (const table of tables) {
      try {
        const result = await query(`SELECT COUNT(*) FROM ${table}`)
        results[table] = {
          exists: true,
          count: Number.parseInt(result.rows[0].count),
        }
      } catch (error: any) {
        results[table] = {
          exists: false,
          error: error.message,
        }
      }
    }

    return NextResponse.json({
      success: true,
      connection: "متصل",
      tables: results,
    })
  } catch (error: any) {
    console.error("[v0] Database test error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}
