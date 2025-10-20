"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { Calendar, Loader2 } from "lucide-react"
import { useLanguage } from "@/components/language-switcher"
import Image from "next/image"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const language = useLanguage()
  const formId = params.formId as string

  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [customServices, setCustomServices] = useState<any[]>([])
  const [googleSheetId, setGoogleSheetId] = useState<string>("")
  const [formTitle, setFormTitle] = useState<string>("")
  const [formImage, setFormImage] = useState<string>("")
  const [formDescription, setFormDescription] = useState<string>("")
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
            setFormTitle(language === "ar" ? form.title_ar : form.title_en || form.title_ar)
            setFormImage(form.image_url || "")
            setFormDescription(language === "ar" ? form.description_ar : form.description_en || form.description_ar)
            setGoogleSheetId(form.google_sheet_id || "")
            if (form.booking_form_services) {
              setServices(form.booking_form_services.map((s: any) => s.services))
            }
            if (form.custom_services) {
              setCustomServices(form.custom_services)
            }
          }
        } catch (error) {
          console.error("Error fetching form data:", error)
        }
      } else {
        try {
          const response = await fetch("/api/services")
          if (response.ok) {
            const data = await response.json()
            setServices(data.filter((s: any) => s.is_active))
          }
        } catch (error) {
          console.error("Error fetching services:", error)
        }
      }
    }

    fetchFormData()
  }, [formId, language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          service_name: formData.service_name,
          notes: formData.notes,
          status: "pending",
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في حفظ الحجز")
      }

      if (googleSheetId) {
        await fetch("/api/google-sheets", {
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
      }

      router.push("/booking-success")
    } catch (error) {
      console.error("Error submitting booking:", error)
      alert(
        language === "ar"
          ? "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى"
          : "An error occurred while submitting the request. Please try again",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container max-w-2xl px-4">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-2">
              {formImage ? (
                <div className="flex justify-center mb-4">
                  <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={formImage || "/placeholder.svg"}
                      alt={formTitle}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 448px"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Calendar className="h-12 w-12 text-primary" />
                  </div>
                </div>
              )}
              <CardTitle className="text-2xl md:text-3xl">
                {formTitle || (language === "ar" ? "احجز موعدك الآن" : "Book Your Appointment")}
              </CardTitle>
              <CardDescription className="text-base">
                {formDescription ||
                  (language === "ar"
                    ? "املأ النموذج وسنتواصل معك لتأكيد الموعد"
                    : "Fill out the form and we will contact you to confirm the appointment")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">{language === "ar" ? "الاسم الكامل" : "Full Name"}</Label>
                  <Input
                    id="full_name"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{language === "ar" ? "رقم الهاتف" : "Phone Number"}</Label>
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
                  <Label htmlFor="service">{language === "ar" ? "الخدمة المطلوبة" : "Required Service"}</Label>
                  <Select
                    value={formData.service_name}
                    onValueChange={(value) => setFormData({ ...formData, service_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "ar" ? "اختر الخدمة" : "Select Service"} />
                    </SelectTrigger>
                    <SelectContent>
                      {customServices.length > 0 && (
                        <SelectGroup>
                          <SelectLabel className="text-blue-600 font-semibold">
                            {language === "ar" ? "الخدمات المخصصة" : "Custom Services"}
                          </SelectLabel>
                          {customServices.map((service) => (
                            <SelectItem key={service.id} value={service.title_ar} className="pr-6">
                              {language === "ar" ? service.title_ar : service.title_en || service.title_ar}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}

                      {services.length > 0 && (
                        <SelectGroup>
                          <SelectLabel className="text-primary font-semibold">
                            {language === "ar" ? "الخدمات العامة" : "General Services"}
                          </SelectLabel>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.title_ar} className="pr-6">
                              {language === "ar" ? service.title_ar : service.title_en || service.title_ar}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}

                      {customServices.length === 0 && services.length === 0 && (
                        <SelectGroup>
                          <SelectLabel className="text-muted-foreground">
                            {language === "ar" ? "الخدمات المتاحة" : "Available Services"}
                          </SelectLabel>
                          <SelectItem value="طب الأسنان">{language === "ar" ? "طب الأسنان" : "Dentistry"}</SelectItem>
                          <SelectItem value="تجميل الأسنان">
                            {language === "ar" ? "تجميل الأسنان" : "Cosmetic Dentistry"}
                          </SelectItem>
                          <SelectItem value="تقويم الأسنان">
                            {language === "ar" ? "تقويم الأسنان" : "Orthodontics"}
                          </SelectItem>
                          <SelectItem value="زراعة الأسنان">
                            {language === "ar" ? "زراعة الأسنان" : "Dental Implants"}
                          </SelectItem>
                          <SelectItem value="علاج اللثة">
                            {language === "ar" ? "علاج اللثة" : "Gum Treatment"}
                          </SelectItem>
                          <SelectItem value="طب الأطفال">
                            {language === "ar" ? "طب الأطفال" : "Pediatric Dentistry"}
                          </SelectItem>
                          <SelectItem value="أخرى">{language === "ar" ? "أخرى" : "Other"}</SelectItem>
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">
                    {language === "ar" ? "ملاحظات إضافية (اختياري)" : "Additional Notes (Optional)"}
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={language === "ar" ? "أي ملاحظات أو استفسارات" : "Any notes or inquiries"}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      {language === "ar" ? "جاري الإرسال..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Calendar className="ml-2 h-5 w-5" />
                      {language === "ar" ? "إرسال الطلب" : "Submit Request"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
