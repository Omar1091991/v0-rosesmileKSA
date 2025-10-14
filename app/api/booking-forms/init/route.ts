import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    const supabase = createAdminClient()

    // إنشاء جدول booking_forms
    const createBookingFormsTable = `
      CREATE TABLE IF NOT EXISTS booking_forms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name_ar TEXT NOT NULL,
        name_en TEXT,
        description_ar TEXT,
        description_en TEXT,
        image_url TEXT,
        google_sheet_id TEXT,
        is_active BOOLEAN DEFAULT true,
        is_main BOOLEAN DEFAULT false,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE booking_forms DISABLE ROW LEVEL SECURITY;
    `

    // إنشاء جدول booking_form_services
    const createBookingFormServicesTable = `
      CREATE TABLE IF NOT EXISTS booking_form_services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        booking_form_id UUID REFERENCES booking_forms(id) ON DELETE CASCADE,
        service_id UUID REFERENCES services(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(booking_form_id, service_id)
      );
      
      ALTER TABLE booking_form_services DISABLE ROW LEVEL SECURITY;
    `

    // محاولة إنشاء الجداول
    try {
      // استخدام from().select() للتحقق من وجود الجدول
      const { error: checkError } = await supabase.from("booking_forms").select("id").limit(1)

      if (checkError && checkError.message.includes("does not exist")) {
        // الجدول غير موجود، نحتاج لإنشائه
        console.log("[v0] Tables do not exist, creating them...")

        // إنشاء الجداول عبر SQL مباشر
        const { error: createError } = await supabase.rpc("exec_sql", {
          sql: createBookingFormsTable + createBookingFormServicesTable,
        })

        if (createError) {
          console.error("[v0] Error creating tables via RPC:", createError)
          // إذا فشل RPC، نحاول طريقة بديلة
          throw new Error("يرجى تشغيل السكريبت SQL يدوياً من لوحة تحكم Supabase")
        }
      }
    } catch (error: any) {
      console.error("[v0] Error checking/creating tables:", error)
      // نستمر في المحاولة لإنشاء النموذج الافتراضي
    }

    // التحقق من وجود نماذج
    const { data: existingForms, error: selectError } = await supabase.from("booking_forms").select("id").limit(1)

    console.log("[v0] Existing forms check:", { existingForms, selectError })

    // إنشاء نموذج افتراضي إذا لم يكن موجوداً
    if (!existingForms || existingForms.length === 0) {
      const { data: newForm, error: insertError } = await supabase
        .from("booking_forms")
        .insert([
          {
            name_ar: "نموذج الحجز الرئيسي",
            name_en: "Main Booking Form",
            description_ar: "احجز موعدك الآن واحصل على أفضل الخدمات الطبية",
            description_en: "Book your appointment now and get the best medical services",
            is_main: true,
            is_active: true,
            order_index: 0,
          },
        ])
        .select()
        .single()

      console.log("[v0] Created default form:", { newForm, insertError })

      if (insertError) {
        throw new Error(`فشل في إنشاء النموذج الافتراضي: ${insertError.message}`)
      }

      // ربط النموذج بجميع الخدمات النشطة
      if (newForm) {
        const { data: services } = await supabase.from("services").select("id").eq("is_active", true)

        if (services && services.length > 0) {
          const serviceLinks = services.map((service) => ({
            booking_form_id: newForm.id,
            service_id: service.id,
          }))

          await supabase.from("booking_form_services").insert(serviceLinks)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "تم تهيئة نماذج الحجز بنجاح",
    })
  } catch (error: any) {
    console.error("[v0] Error initializing booking forms:", error)
    return NextResponse.json(
      {
        error: error.message || "فشل في تهيئة الجداول. يرجى تشغيل السكريبت SQL يدوياً من لوحة تحكم Supabase.",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
