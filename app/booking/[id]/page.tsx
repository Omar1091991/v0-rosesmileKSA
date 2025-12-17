import { notFound } from "next/navigation"
import Image from "next/image"
import BookingFormClient from "@/components/booking-form-client"
import { db } from "@/lib/db"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

async function getBookingForm(id: string) {
  try {
    const formResult = await db.query("SELECT * FROM booking_forms WHERE id = $1", [id])

    if (formResult.rows.length === 0) {
      return null
    }

    const dbForm = formResult.rows[0]

    const servicesResult = await db.query(
      `SELECT id, title_ar, title_en, description_ar
       FROM services 
       WHERE id = ANY($1::int[]) AND is_active = true
       ORDER BY order_index`,
      [dbForm.services || []],
    )

    const fields = typeof dbForm.fields === "string" ? JSON.parse(dbForm.fields) : dbForm.fields || {}
    const customServices = fields.custom_services || []

    return {
      ...dbForm,
      services: servicesResult.rows,
      custom_services: customServices,
    }
  } catch (error) {
    console.error("[v0] Error fetching booking form:", error)
    return null
  }
}

export default async function BookingPage({ params }: { params: { id: string } }) {
  const form = await getBookingForm(params.id)

  if (!form || !form.is_active) {
    notFound()
  }

  const allServices = [
    ...form.services.map((s: any) => ({ ...s, isCustom: false })),
    ...form.custom_services.map((s: any) => ({ ...s, isCustom: true })),
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
            {form.image_url && (
              <div className="relative w-full max-w-md mx-auto aspect-square rounded-xl overflow-hidden mb-6 shadow-lg">
                <Image
                  src={form.image_url || "/placeholder.svg"}
                  alt={form.title_ar}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{form.title_ar}</h1>
              {form.description_ar && (
                <p
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: form.description_ar.replace(/\n/g, "<br />") }}
                />
              )}
            </div>

            {/* Booking Form */}
            <BookingFormClient formId={form.id} services={allServices} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
