import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    const supabase = createAdminClient()

    await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS booking_forms (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title_ar TEXT NOT NULL,
          title_en TEXT,
          description_ar TEXT,
          description_en TEXT,
          image_url TEXT,
          google_sheet_url TEXT,
          is_active BOOLEAN DEFAULT true,
          is_main BOOLEAN DEFAULT false,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS booking_form_services (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          booking_form_id UUID REFERENCES booking_forms(id) ON DELETE CASCADE,
          service_id UUID REFERENCES services(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(booking_form_id, service_id)
        );

        -- إنشاء نموذج الحجز الرئيسي الافتراضي
        INSERT INTO booking_forms (title_ar, title_en, description_ar, description_en, is_main, is_active)
        VALUES (
          'نموذج الحجز الرئيسي',
          'Main Booking Form',
          'احجز موعدك الآن واحصل على أفضل الخدمات الطبية',
          'Book your appointment now and get the best medical services',
          true,
          true
        )
        ON CONFLICT DO NOTHING;
      `,
    })

    return NextResponse.json({ success: true, message: "تم إنشاء الجداول بنجاح" })
  } catch (error: any) {
    console.error("[v0] Error initializing booking forms:", error)

    try {
      const supabase = createAdminClient()

      // محاولة إنشاء نموذج افتراضي مباشرة
      const { error: insertError } = await supabase.from("booking_forms").insert([
        {
          title_ar: "نموذج الحجز الرئيسي",
          title_en: "Main Booking Form",
          description_ar: "احجز موعدك الآن واحصل على أفضل الخدمات الطبية",
          description_en: "Book your appointment now and get the best medical services",
          is_main: true,
          is_active: true,
        },
      ])

      if (insertError && !insertError.message.includes("already exists")) {
        throw insertError
      }

      return NextResponse.json({ success: true, message: "تم التهيئة بنجاح" })
    } catch (fallbackError: any) {
      return NextResponse.json({ error: fallbackError.message }, { status: 500 })
    }
  }
}
