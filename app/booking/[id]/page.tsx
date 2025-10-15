import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingFormClient } from "@/components/booking-form-client"

export const dynamic = "force-dynamic"

interface BookingFormPageProps {
  params: {
    id: string
  }
}

export default async function BookingFormPage({ params }: BookingFormPageProps) {
  const formResult = await db.query(
    `
    SELECT * FROM booking_forms WHERE id = $1 AND is_active = true
  `,
    [params.id],
  )

  if (formResult.rows.length === 0) {
    notFound()
  }

  const form = formResult.rows[0]

  const servicesResult = await db.query(
    `
    SELECT s.id, s.title_ar, s.title_en, s.description_ar
    FROM booking_form_services bfs
    JOIN services s ON bfs.service_id = s.id
    WHERE bfs.booking_form_id = $1
  `,
    [params.id],
  )

  const services = servicesResult.rows

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {form.image_url && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <Image src={form.image_url || "/placeholder.svg"} alt={form.name_ar} fill className="object-cover" />
          </div>
        )}

        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold">{form.name_ar}</CardTitle>
            {form.description_ar && <p className="text-muted-foreground">{form.description_ar}</p>}
          </CardHeader>
          <CardContent>
            <BookingFormClient formId={form.id} googleSheetId={form.google_sheet_id} services={services} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
