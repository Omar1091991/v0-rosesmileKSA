import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import BookingFormClient from "@/components/booking-form-client"
import { db } from "@/lib/db"

async function getBookingForm(id: string) {
  try {
    const formResult = await db.query("SELECT * FROM booking_forms WHERE id = $1", [id])

    if (formResult.rows.length === 0) {
      return null
    }

    const servicesResult = await db.query(
      `
      SELECT s.id, s.title_ar, s.title_en
      FROM booking_form_services bfs
      JOIN services s ON bfs.service_id = s.id
      WHERE bfs.booking_form_id = $1
    `,
      [id],
    )

    const dbForm = formResult.rows[0]
    const fields = typeof dbForm.fields === "string" ? JSON.parse(dbForm.fields) : dbForm.fields || {}
    const customServices = fields.custom_services || []

    return {
      ...dbForm,
      custom_services: customServices,
      booking_form_services: servicesResult.rows.map((s) => ({ service_id: s.id, services: s })),
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
    ...(form.booking_form_services?.map((s: any) => s.services) || []),
    ...(form.custom_services || []),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{form.title_ar}</h1>
          {form.description_ar && (
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: form.description_ar.replace(/\n/g, "<br />") }}
            />
          )}
        </div>

        {/* Image */}
        {form.image_url && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
            <Image
              src={form.image_url || "/placeholder.svg"}
              alt={form.title_ar}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Services */}
        {allServices.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                الخدمات المتاحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allServices.map((service: any, index: number) => (
                  <div key={service.id || index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{service.title_ar}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Form */}
        <BookingFormClient formId={form.id} services={allServices} />
      </div>
    </div>
  )
}
