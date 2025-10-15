import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST() {
  try {
    console.log("[v0] Initializing booking forms tables...")

    const createBookingFormsTable = `
      CREATE TABLE IF NOT EXISTS booking_forms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name_ar TEXT NOT NULL,
        name_en TEXT,
        description_ar TEXT,
        description_en TEXT,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        is_main BOOLEAN DEFAULT false,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    const createBookingFormServicesTable = `
      CREATE TABLE IF NOT EXISTS booking_form_services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        booking_form_id UUID REFERENCES booking_forms(id) ON DELETE CASCADE,
        service_id UUID REFERENCES services(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(booking_form_id, service_id)
      );
    `

    // إنشاء الجداول
    await query(createBookingFormsTable)
    await query(createBookingFormServicesTable)

    console.log("[v0] Tables created successfully")

    // التحقق من وجود نماذج
    const existingForms = await query("SELECT id FROM booking_forms LIMIT 1")

    // إنشاء نموذج افتراضي إذا لم يكن موجوداً
    if (!existingForms.rows || existingForms.rows.length === 0) {
      console.log("[v0] Creating default booking form...")

      const newForm = await query(
        `INSERT INTO booking_forms (name_ar, name_en, description_ar, description_en, is_main, is_active, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          "نموذج الحجز الرئيسي",
          "Main Booking Form",
          "احجز موعدك الآن واحصل على أفضل الخدمات الطبية",
          "Book your appointment now and get the best medical services",
          true,
          true,
          0,
        ],
      )

      console.log("[v0] Created default form:", newForm.rows[0])

      // ربط النموذج بجميع الخدمات النشطة
      if (newForm.rows[0]) {
        const services = await query("SELECT id FROM services WHERE is_active = true")

        if (services.rows && services.rows.length > 0) {
          for (const service of services.rows) {
            await query(
              "INSERT INTO booking_form_services (booking_form_id, service_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
              [newForm.rows[0].id, service.id],
            )
          }
          console.log("[v0] Linked form to", services.rows.length, "services")
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
        error: error.message || "فشل في تهيئة نماذج الحجز",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
