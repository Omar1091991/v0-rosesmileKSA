import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const { data: form, error } = await supabase
        .from("booking_forms")
        .select(`
          *,
          booking_form_services (
            service_id,
            services (
              id,
              title_ar,
              title_en
            )
          )
        `)
        .eq("id", id)
        .single()

      if (error) throw error
      return NextResponse.json(form)
    }

    const { data: forms, error } = await supabase
      .from("booking_forms")
      .select(`
        *,
        booking_form_services (
          service_id,
          services (
            id,
            title_ar,
            title_en
          )
        )
      `)
      .order("order_index", { ascending: true })

    if (error) throw error

    return NextResponse.json(forms || [])
  } catch (error: any) {
    console.error("[v0] Error fetching booking forms:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { service_ids, ...formData } = body

    console.log("[v0] Creating booking form with data:", formData)

    let googleSheetId = formData.google_sheet_id

    if (!googleSheetId) {
      console.log("[v0] Creating Google Sheet automatically...")
      try {
        const createSheetResponse = await fetch(new URL("/api/google-sheets/create", request.url).toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheetName: `نموذج حجز - ${formData.name_ar}`,
          }),
        })

        if (createSheetResponse.ok) {
          const sheetData = await createSheetResponse.json()
          googleSheetId = sheetData.sheetId
          console.log("[v0] Google Sheet created successfully:", googleSheetId)
        } else {
          const error = await createSheetResponse.text()
          console.error("[v0] Failed to create Google Sheet:", error)
        }
      } catch (sheetError) {
        console.error("[v0] Error creating Google Sheet:", sheetError)
      }
    }

    // إذا كان النموذج رئيسي، إلغاء تفعيل النماذج الرئيسية الأخرى
    if (formData.is_main) {
      await supabase.from("booking_forms").update({ is_main: false }).eq("is_main", true)
    }

    console.log("[v0] Inserting form with google_sheet_id:", googleSheetId)

    const { data: form, error: formError } = await supabase
      .from("booking_forms")
      .insert([{ ...formData, google_sheet_id: googleSheetId }])
      .select()
      .single()

    if (formError) {
      console.error("[v0] Error inserting form:", formError)
      throw formError
    }

    console.log("[v0] Form created successfully:", form)

    // ربط الخدمات بالنموذج
    if (service_ids && service_ids.length > 0) {
      const serviceLinks = service_ids.map((service_id: string) => ({
        booking_form_id: form.id,
        service_id,
      }))

      console.log("[v0] Linking services:", serviceLinks)

      const { error: linkError } = await supabase.from("booking_form_services").insert(serviceLinks)

      if (linkError) {
        console.error("[v0] Error linking services:", linkError)
        throw linkError
      }
    }

    return NextResponse.json(form)
  } catch (error: any) {
    console.error("[v0] Error creating booking form:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id, service_ids, ...formData } = body

    // إذا كان النموذج رئيسي، إلغاء تفعيل النماذج الرئيسية الأخرى
    if (formData.is_main) {
      await supabase.from("booking_forms").update({ is_main: false }).eq("is_main", true).neq("id", id)
    }

    const { data: form, error: formError } = await supabase
      .from("booking_forms")
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (formError) throw formError

    // تحديث ربط الخدمات
    if (service_ids !== undefined) {
      // حذف الروابط القديمة
      await supabase.from("booking_form_services").delete().eq("booking_form_id", id)

      // إضافة الروابط الجديدة
      if (service_ids.length > 0) {
        const serviceLinks = service_ids.map((service_id: string) => ({
          booking_form_id: id,
          service_id,
        }))

        const { error: linkError } = await supabase.from("booking_form_services").insert(serviceLinks)

        if (linkError) throw linkError
      }
    }

    return NextResponse.json(form)
  } catch (error: any) {
    console.error("[v0] Error updating booking form:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { id } = body

    const { error } = await supabase.from("booking_forms").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting booking form:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
