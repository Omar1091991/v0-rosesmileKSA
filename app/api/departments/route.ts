import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data: departments, error } = await supabase
      .from("departments")
      .select("*")
      .order("order_index", { ascending: true })

    if (error) throw error
    return NextResponse.json({ departments })
  } catch (error: any) {
    console.error("[v0] Error fetching departments:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase.from("departments").insert(body).select().single()

    if (error) throw error
    return NextResponse.json({ department: data })
  } catch (error: any) {
    console.error("[v0] Error creating department:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase.from("departments").update(updates).eq("id", id).select().single()

    if (error) throw error
    return NextResponse.json({ department: data })
  } catch (error: any) {
    console.error("[v0] Error updating department:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("departments").delete().eq("id", id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting department:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
