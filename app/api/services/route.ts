import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data: services, error } = await supabase.from("services").select("*").order("order_index")

    if (error) throw error

    return NextResponse.json({ services })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("services")
      .insert([
        {
          title_ar: body.title_ar,
          title_en: body.title_en || body.title_ar,
          description_ar: body.description_ar,
          description_en: body.description_en || body.description_ar,
          icon: body.icon,
          image_url: body.image_url,
          is_active: body.is_active ?? true,
          order_index: body.order_index ?? 0,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ service: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("services")
      .update({
        title_ar: body.title_ar,
        title_en: body.title_en,
        description_ar: body.description_ar,
        description_en: body.description_en,
        icon: body.icon,
        image_url: body.image_url,
        is_active: body.is_active,
        order_index: body.order_index,
      })
      .eq("id", body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ service: data })
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
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("services").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
