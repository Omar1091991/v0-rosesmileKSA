import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data: offers, error } = await supabase.from("offers").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ offers })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("offers")
      .insert([
        {
          title_ar: body.title_ar,
          title_en: body.title_en || body.title_ar,
          description_ar: body.description_ar,
          description_en: body.description_en || body.description_ar,
          price_before: body.price_before,
          price_after: body.price_after,
          discount_percentage: body.discount_percentage,
          valid_from: body.valid_from,
          valid_until: body.valid_until,
          image_url: body.image_url,
          is_active: body.is_active ?? true,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ offer: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("offers")
      .update({
        title_ar: body.title_ar,
        title_en: body.title_en,
        description_ar: body.description_ar,
        description_en: body.description_en,
        price_before: body.price_before,
        price_after: body.price_after,
        discount_percentage: body.discount_percentage,
        valid_from: body.valid_from,
        valid_until: body.valid_until,
        image_url: body.image_url,
        is_active: body.is_active,
      })
      .eq("id", body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ offer: data })
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
      return NextResponse.json({ error: "Offer ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("offers").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
