import { createAdminClient } from "@/lib/supabase/admin"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingFormClient } from "@/components/booking-form-client"

interface BookingFormPageProps {
  params: {
    id: string
  }
}

export default async function BookingFormPage({ params }: BookingFormPageProps) {
  const supabase = createAdminClient()

  const { data: form, error } = await supabase
    .from("booking_forms")
    .select(`
      *,
      booking_form_services (
        service_id,
        services (
          id,
          title_ar,
          title_en,
          description_ar
        )
      )
    `)
    .eq("id", params.id)
    .eq("is_active", true)
    .single()

  if (error || !form) {
    notFound()
  }

  const services = form.booking_form_services?.map((s: any) => s.services) || []

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
