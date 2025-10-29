import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"
    const date = searchParams.get("date")

    console.log("[v0] Stats API - Filter:", filter, "Date:", date)

    let dateCondition = ""
    const params: any[] = []

    if (filter === "today") {
      dateCondition = "WHERE DATE(created_at) = CURRENT_DATE"
    } else if (filter === "date" && date) {
      dateCondition = "WHERE DATE(created_at) = $1"
      params.push(date)
    }

    // Get counts for each table
    const [usersResult, servicesResult, doctorsResult, offersResult, bookingsResult, articlesResult] =
      await Promise.all([
        query("SELECT COUNT(*) as count FROM users"),
        query("SELECT COUNT(*) as count FROM services"),
        query("SELECT COUNT(*) as count FROM doctors"),
        query("SELECT COUNT(*) as count FROM offers"),
        query(`SELECT COUNT(*) as count FROM bookings ${dateCondition}`, params),
        query("SELECT COUNT(*) as count FROM articles"),
      ])

    const stats = {
      users: Number.parseInt(usersResult.rows[0]?.count || "0"),
      services: Number.parseInt(servicesResult.rows[0]?.count || "0"),
      doctors: Number.parseInt(doctorsResult.rows[0]?.count || "0"),
      offers: Number.parseInt(offersResult.rows[0]?.count || "0"),
      bookings: Number.parseInt(bookingsResult.rows[0]?.count || "0"),
      articles: Number.parseInt(articlesResult.rows[0]?.count || "0"),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Stats API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
