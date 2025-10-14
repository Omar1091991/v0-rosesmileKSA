import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data: gallery, error } = await supabase
      .from("gallery")
      .select("*")
      .order("order_index", { ascending: true })

    if (error) throw error
    return NextResponse.json(gallery || [])
  } catch (error: any) {
    console.error("[v0] Error fetching gallery:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase.from("gallery").insert(body).select().single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error creating gallery image:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase.from("gallery").update(updates).eq("id", id).select().single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error updating gallery image:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("gallery").delete().eq("id", id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting gallery image:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
