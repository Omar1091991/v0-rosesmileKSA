"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingDialogProps {
  trigger?: React.ReactNode
  formId?: string
}

export function BookingDialog({ trigger, formId }: BookingDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [googleSheetId, setGoogleSheetId] = useState<string>("")
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    service_name: "",
    notes: "",
  })

  useEffect(() => {
    const fetchFormData = async () => {
      if (formId) {
        try {
          const response = await fetch(`/api/booking-forms?id=${formId}`)
          if (response.ok) {
            const form = await response.json()
            console.log("[v0] Form data:", form)
            setGoogleSheetId(form.google_sheet_id || "")
            if (form.booking_form_services) {
              setServices(form.booking_form_services.map((s: any) => s.services))
            }
          }
        } catch (error) {
          console.error("[v0] Error fetching form data:", error)
        }
      } else {
        try {
          const response = await fetch("/api/services")
          if (response.ok) {
            const data = await response.json()
            setServices(data.filter((s: any) => s.is_active))
          }
        } catch (error) {
          console.error("[v0] Error fetching services:", error)
        }
      }
    }

    fetchFormData()
  }, [formId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error: dbError } = await supabase.from("bookings").insert([
        {
          full_name: formData.full_name,
          phone: formData.phone,
          service_name: formData.service_name,
          notes: formData.notes,
          status: "pending",
        },
      ])

      if (dbError) {
        console.error("[v0] Database error:", dbError)
        throw dbError
      }

      console.log("[v0] Booking saved to database successfully")

      if (googleSheetId) {
        console.log("[v0] Sending to Google Sheets:", googleSheetId)

        const sheetsResponse = await fetch("/api/google-sheets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            phone: formData.phone,
            service_name: formData.service_name,
            notes: formData.notes,
            timestamp: new Date().toISOString(),
            sheet_id: googleSheetId,
          }),
        })

        const sheetsResult = await sheetsResponse.json()
        console.log("[v0] Google Sheets result:", sheetsResult)
      }

      setOpen(false)
      setFormData({ full_name: "", phone: "", service_name: "", notes: "" })
      router.push("/booking-success")
    } catch (error) {
      console.error("[v0] Error submitting booking:", error)
      alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2">
            <Calendar className="h-5 w-5" />
            احجز موعد
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>احجز موعدك الآن</DialogTitle>
          <DialogDescription>املأ النموذج وسنتواصل معك لتأكيد الموعد</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">الاسم الكامل</Label>
            <Input
              id="full_name"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="أدخل اسمك الكامل"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="05xxxxxxxx"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">الخدمة المطلوبة</Label>
            <Select
              value={formData.service_name}
              onValueChange={(value) => setFormData({ ...formData, service_name: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الخدمة" />
              </SelectTrigger>
              <SelectContent>
                {services.length > 0 ? (
                  services.map((service) => (
                    <SelectItem key={service.id} value={service.title_ar}>
                      {service.title_ar}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="طب الأسنان">طب الأسنان</SelectItem>
                    <SelectItem value="تجميل الأسنان">تجميل الأسنان</SelectItem>
                    <SelectItem value="تقويم الأسنان">تقويم الأسنان</SelectItem>
                    <SelectItem value="زراعة الأسنان">زراعة الأسنان</SelectItem>
                    <SelectItem value="علاج اللثة">علاج اللثة</SelectItem>
                    <SelectItem value="طب الأطفال">طب الأطفال</SelectItem>
                    <SelectItem value="أخرى">أخرى</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أي ملاحظات أو استفسارات"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري الإرسال..." : "إرسال الطلب"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
