import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from("site_content").select("*").order("section")

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("[v0] Error fetching site content:", error)
    return NextResponse.json({ error: error.message || "فشل في جلب محتوى الموقع" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase.from("site_content").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error creating site content:", error)
    return NextResponse.json({ error: error.message || "فشل في إضافة المحتوى" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from("site_content")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error updating site content:", error)
    return NextResponse.json({ error: error.message || "فشل في تحديث المحتوى" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "معرف المحتوى مطلوب" }, { status: 400 })
    }

    const { error } = await supabase.from("site_content").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting site content:", error)
    return NextResponse.json({ error: error.message || "فشل في حذف المحتوى" }, { status: 500 })
  }
}
