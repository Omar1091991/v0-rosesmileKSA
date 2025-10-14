import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data: doctors, error } = await supabase
      .from("doctors")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(doctors || [])
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
          bio_en: body.bio_en,
          image_url: body.image_url,
          is_active: body.is_active ?? true,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
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
        image_url: body.image_url,
        is_active: body.is_active,
      })
      .eq("id", body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "معرف الطبيب مطلوب" }, { status: 400 })
    }

    const { error } = await supabase.from("doctors").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
