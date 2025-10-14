import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctor_id")

    const supabase = createAdminClient()

    let query = supabase.from("doctor_cases").select("*").order("order_index", { ascending: true })

    if (doctorId) {
      query = query.eq("doctor_id", doctorId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createAdminClient()

    const { data, error } = await supabase.from("doctor_cases").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const supabase = createAdminClient()

    const { data, error } = await supabase.from("doctor_cases").update(updates).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    const supabase = createAdminClient()

    const { error } = await supabase.from("doctor_cases").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
