import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const result = await query("SELECT * FROM offers WHERE id = $1", [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("[v0] Error fetching offer:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
