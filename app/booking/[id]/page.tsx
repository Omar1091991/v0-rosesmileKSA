import { createAdminClient } from "@/lib/supabase/admin"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
            <form className="space-y-6" action="/api/bookings" method="POST">
              <input type="hidden" name="form_id" value={form.id} />

              <div className="space-y-2">
                <Label htmlFor="full_name">الاسم الكامل *</Label>
                <Input id="full_name" name="full_name" required placeholder="أدخل اسمك الكامل" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الجوال *</Label>
                <Input id="phone" name="phone" required type="tel" placeholder="05xxxxxxxx" dir="ltr" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_id">الخدمة المطلوبة *</Label>
                <Select name="service_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service: any) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.title_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea id="notes" name="notes" placeholder="أي ملاحظات أو استفسارات..." rows={4} />
              </div>

              <Button type="submit" className="w-full text-lg py-6">
                إرسال طلب الحجز
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
