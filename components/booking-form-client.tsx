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
  const [showSuccess, setShowSuccess] = useState(false)
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
          service_id: selectedService?.isCustom ? null : Number(formData.service_id),
          service_name: selectedService?.title_ar || "",
          notes: formData.notes,
          booking_form_id: Number(formId),
          status: "pending",
        }),
      })

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json()
        throw new Error(errorData.error || "فشل في إنشاء الحجز")
      }

      setShowSuccess(true)

      setFormData({
        full_name: "",
        phone: "",
        service_id: "",
        notes: "",
      })
    } catch (error: any) {
      console.error("[v0] Error submitting booking:", error)

      toast({
        title: "❌ خطأ في الإرسال",
        description:
          error.message === 'duplicate key value violates unique constraint "bookings_pkey"'
            ? "حدث خطأ في النظام. يرجى المحاولة مرة أخرى"
            : error.message || "فشل في إرسال طلب الحجز. يرجى المحاولة مرة أخرى",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-green-800">تم إرسال طلبك بنجاح!</h2>
            <p className="text-lg text-green-700">شكراً لك على التواصل معنا</p>
            <p className="text-green-600">سيتم التواصل معك في أسرع وقت ممكن</p>
          </div>

          <div className="pt-4">
            <Button onClick={() => router.push("/")} className="bg-green-600 hover:bg-green-700">
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white via-pink-50/30 to-blue-50/30 shadow-2xl border-2 border-pink-100/50 backdrop-blur-sm">
      <CardContent className="pt-8 pb-8 px-6 sm:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="px-4 py-3 rounded-lg inline-block shadow-md" style={{ backgroundColor: "#063465" }}>
              <Label htmlFor="full_name" className="text-base font-bold text-white">
                الاسم الكامل *
              </Label>
            </div>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              placeholder="أدخل اسمك الكامل"
              className="h-12 text-base border-2 transition-all duration-200"
              style={{ borderColor: "#063465" }}
            />
          </div>

          <div className="space-y-2">
            <div className="px-4 py-3 rounded-lg inline-block shadow-md" style={{ backgroundColor: "#063465" }}>
              <Label htmlFor="phone" className="text-base font-bold text-white">
                رقم الجوال *
              </Label>
            </div>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              type="tel"
              placeholder="05xxxxxxxx"
              dir="ltr"
              className="h-12 text-base border-2 transition-all duration-200"
              style={{ borderColor: "#063465" }}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-700 text-right block">الخدمة المطلوبة *</Label>
            <RadioGroup
              value={formData.service_id}
              onValueChange={(value) => setFormData({ ...formData, service_id: value })}
              required
              className="space-y-3"
              dir="rtl"
            >
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`flex items-center gap-3 overflow-hidden border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                    formData.service_id === service.id
                      ? "border-pink-400 shadow-lg scale-[1.02]"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <Label
                    htmlFor={service.id}
                    className="flex-1 px-5 py-4 cursor-pointer font-bold text-white text-lg leading-relaxed transition-all duration-300"
                    style={{
                      background:
                        formData.service_id === service.id
                          ? "linear-gradient(to right, #f5479e, #ff6bb5)"
                          : "linear-gradient(to right, #063465, #0a4a8f)",
                    }}
                    onClick={() => setFormData({ ...formData, service_id: service.id })}
                  >
                    {service.title_ar}
                  </Label>
                  <div className="px-4">
                    <RadioGroupItem value={service.id} id={service.id} className="shrink-0" />
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-semibold text-gray-700">
              ملاحظات إضافية
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أي ملاحظات أو استفسارات..."
              rows={4}
              className="text-base border-2 border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-200 resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-7 font-bold text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "#063465" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              "إرسال طلب الحجز 📋"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default BookingFormClient
