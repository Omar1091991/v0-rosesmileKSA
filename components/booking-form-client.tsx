"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface BookingFormClientProps {
  formId: string
  services: Array<{
    id: string
    title_ar: string
    title_en: string
    description_ar: string
  }>
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
    setLoading(true)

    try {
      const selectedService = services.find((s) => s.id === formData.service_id)

      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          service_id: formData.service_id,
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

      <div className="space-y-2">
        <Label htmlFor="service_id">الخدمة المطلوبة *</Label>
        <Select
          value={formData.service_id}
          onValueChange={(value) => setFormData({ ...formData, service_id: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الخدمة" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.title_ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
  )
}
