"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Home, Phone } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-switcher"

export default function BookingSuccessPage() {
  const { isArabic } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-2xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? "تم إرسال طلبك بنجاح!" : "Your request has been sent successfully!"}
          </h1>
          <p className="text-muted-foreground text-lg">{isArabic ? "شكراً لثقتك بنا" : "Thank you for trusting us"}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-3">
          <p className="text-foreground font-medium">
            {isArabic ? "سيتم التواصل معك في أقرب وقت ممكن" : "We will contact you as soon as possible"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isArabic
              ? "سيقوم فريقنا بمراجعة طلبك والتواصل معك خلال 24 ساعة لتأكيد موعدك"
              : "Our team will review your request and contact you within 24 hours to confirm your appointment"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button asChild className="flex-1 gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              {isArabic ? "العودة للرئيسية" : "Back to Home"}
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 gap-2 bg-transparent">
            <Link href="tel:+966500000000">
              <Phone className="h-4 w-4" />
              {isArabic ? "اتصل بنا" : "Call Us"}
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          {isArabic ? "رقم الطلب:" : "Request Number:"} #{Math.random().toString(36).substring(2, 9).toUpperCase()}
        </p>
      </div>
    </div>
  )
}
