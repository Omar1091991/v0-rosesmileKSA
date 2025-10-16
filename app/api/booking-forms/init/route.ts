import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST() {
  try {
    const existingForms = await query("SELECT id FROM booking_forms LIMIT 1")

    if (!existingForms.rows || existingForms.rows.length === 0) {
      const newForm = await query(
        `INSERT INTO booking_forms (title_ar, title_en, description_ar, description_en, fields, is_active, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          "نموذج الحجز الرئيسي",
          "Main Booking Form",
          "احجز موعدك الآن واحصل على أفضل الخدمات الطبية",
          "Book your appointment now and get the best medical services",
          "[]",
          true,
          0,
        ],
      )

      if (newForm.rows[0]) {
        const services = await query("SELECT id FROM services WHERE is_active = true")

        if (services.rows && services.rows.length > 0) {
          for (const service of services.rows) {
            await query(
              "INSERT INTO booking_form_services (booking_form_id, service_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
              [newForm.rows[0].id, service.id],
            )
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "تم تهيئة نماذج الحجز بنجاح",
    })
  } catch (error: any) {
    console.error("Error initializing booking forms:", error)
    return NextResponse.json(
      {
        error: error.message || "فشل في تهيئة نماذج الحجز",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
