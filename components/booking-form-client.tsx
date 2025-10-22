"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Service {
  id: string
  title_ar: string
  title_en?: string
  description_ar?: string
  isCustom?: boolean
}

interface BookingFormClientProps {
  formId: string
  services: Service[]
}

export function BookingFormClient({ formId, services }: BookingFormClientProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    service_id: "",
    notes: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.service_id) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الخدمة المطلوبة",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const selectedService = services.find((s) => s.id === formData.service_id)

      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          service_id: selectedService?.isCustom ? null : formData.service_id,
          service_name: selectedService?.title_ar || "",
          notes: formData.notes,
          booking_form_id: formId,
          status: "pending",
        }),
      })

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json()
        throw new Error(errorData.error || "فشل في إنشاء الحجز")
      }

      toast({
        title: "نجح",
        description: "تم إرسال طلب الحجز بنجاح",
      })

      router.push("/booking-success")
    } catch (error: any) {
      console.error("[v0] Error submitting booking:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل في إرسال طلب الحجز",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">الاسم الكامل *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              placeholder="أدخل اسمك الكامل"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الجوال *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              type="tel"
              placeholder="05xxxxxxxx"
              dir="ltr"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-right block">الخدمة المطلوبة *</Label>
            <RadioGroup
              value={formData.service_id}
              onValueChange={(value) => setFormData({ ...formData, service_id: value })}
              required
              className="space-y-2"
              dir="rtl"
            >
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setFormData({ ...formData, service_id: service.id })}
                >
                  <Label htmlFor={service.id} className="flex-1 cursor-pointer font-medium text-right leading-relaxed">
                    {service.title_ar}
                  </Label>
                  <RadioGroupItem value={service.id} id={service.id} className="mt-1 shrink-0" />
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات إضافية</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أي ملاحظات أو استفسارات..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              "إرسال طلب الحجز"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default BookingFormClient
