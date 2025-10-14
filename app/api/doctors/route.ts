import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data: doctors, error } = await supabase.from("doctors").select("*").order("order_index")

    if (error) throw error

    return NextResponse.json({ doctors })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("doctors")
      .insert([
        {
          name_ar: body.name_ar,
          name_en: body.name_en || body.name_ar,
          specialty_ar: body.specialty_ar,
          specialty_en: body.specialty_en || body.specialty_ar,
          bio_ar: body.bio_ar,
          bio_en: body.bio_en || body.bio_ar,
          qualifications_ar: body.qualifications_ar || [],
          qualifications_en: body.qualifications_en || [],
          image_url: body.image_url,
          is_active: body.is_active ?? true,
          order_index: body.order_index ?? 0,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ doctor: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("doctors")
      .update({
        name_ar: body.name_ar,
        name_en: body.name_en,
        specialty_ar: body.specialty_ar,
        specialty_en: body.specialty_en,
        bio_ar: body.bio_ar,
        bio_en: body.bio_en,
        qualifications_ar: body.qualifications_ar,
        qualifications_en: body.qualifications_en,
        image_url: body.image_url,
        is_active: body.is_active,
        order_index: body.order_index,
      })
      .eq("id", body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ doctor: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("doctors").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
