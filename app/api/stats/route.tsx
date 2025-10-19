import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get("filter") || "all" // all, today, date
    const date = searchParams.get("date") // YYYY-MM-DD format

    console.log("[v0] Stats API - Filter:", filter, "Date:", date)

    let dateCondition = ""

    if (filter === "today") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString().split("T")[0]
      dateCondition = `AND DATE(created_at) = '${todayStr}'`
    } else if (filter === "date" && date) {
      dateCondition = `AND DATE(created_at) = '${date}'`
    }

    // Get counts for all tables
    const usersQuery =
      filter === "all"
        ? sql`SELECT COUNT(*) as count FROM users`
        : sql`SELECT COUNT(*) as count FROM users WHERE DATE(created_at)::text = ${filter === "today" ? new Date().toISOString().split("T")[0] : date}`

    const servicesQuery =
      filter === "all"
        ? sql`SELECT COUNT(*) as count FROM services`
        : sql`SELECT COUNT(*) as count FROM services WHERE DATE(created_at)::text = ${filter === "today" ? new Date().toISOString().split("T")[0] : date}`

    const doctorsQuery =
      filter === "all"
        ? sql`SELECT COUNT(*) as count FROM doctors`
        : sql`SELECT COUNT(*) as count FROM doctors WHERE DATE(created_at)::text = ${filter === "today" ? new Date().toISOString().split("T")[0] : date}`

    const offersQuery =
      filter === "all"
        ? sql`SELECT COUNT(*) as count FROM offers`
        : sql`SELECT COUNT(*) as count FROM offers WHERE DATE(created_at)::text = ${filter === "today" ? new Date().toISOString().split("T")[0] : date}`

    const bookingsQuery =
      filter === "all"
        ? sql`SELECT COUNT(*) as count FROM bookings`
        : sql`SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at)::text = ${filter === "today" ? new Date().toISOString().split("T")[0] : date}`

    const articlesQuery =
      filter === "all"
        ? sql`SELECT COUNT(*) as count FROM articles`
        : sql`SELECT COUNT(*) as count FROM articles WHERE DATE(created_at)::text = ${filter === "today" ? new Date().toISOString().split("T")[0] : date}`

    const [usersResult, servicesResult, doctorsResult, offersResult, bookingsResult, articlesResult] =
      await Promise.all([usersQuery, servicesQuery, doctorsQuery, offersQuery, bookingsQuery, articlesQuery])
    // </CHANGE>

    const stats = {
      users: Number.parseInt(usersResult[0]?.count || "0"),
      services: Number.parseInt(servicesResult[0]?.count || "0"),
      doctors: Number.parseInt(doctorsResult[0]?.count || "0"),
      offers: Number.parseInt(offersResult[0]?.count || "0"),
      bookings: Number.parseInt(bookingsResult[0]?.count || "0"),
      articles: Number.parseInt(articlesResult[0]?.count || "0"),
    }

    console.log("[v0] Stats:", stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
