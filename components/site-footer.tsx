"use client"

import Link from "next/link"
import { Phone, MapPin } from "lucide-react"
import { SocialMediaLinks } from "@/components/social-media-links"
import { useEffect, useState } from "react"

export function SiteFooter() {
  const [footerBgColor, setFooterBgColor] = useState<string>("")
  const [footerPhone, setFooterPhone] = useState<string>("+966 12 345 6789")
  const [footerEmail, setFooterEmail] = useState<string>("info@rosesmileksa.com")
  const [footerNote, setFooterNote] = useState<string>(
    "عيادات طبية متخصصة في مكة المكرمة نقدم أفضل الخدمات الطبية بأحدث التقنيات",
  )

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/site-settings")
        const settingsData = await response.json()
        const settings = Array.isArray(settingsData) ? settingsData : settingsData.settings || []

        const footerColorSetting = settings.find((s: any) => s.key === "footer_background_color")
        if (footerColorSetting?.value_ar) {
          setFooterBgColor(footerColorSetting.value_ar)
        }

        const phoneSetting = settings.find((s: any) => s.key === "footer_phone")
        if (phoneSetting?.value_ar) {
          setFooterPhone(phoneSetting.value_ar)
        }

        const emailSetting = settings.find((s: any) => s.key === "footer_email")
        if (emailSetting?.value_ar) {
          setFooterEmail(emailSetting.value_ar)
        }

        const noteSetting = settings.find((s: any) => s.key === "footer_note")
        if (noteSetting?.value_ar) {
          setFooterNote(noteSetting.value_ar)
        }
      } catch (error) {
        console.error("Error fetching footer settings:", error)
      }
    }
    fetchSettings()
  }, [])

  return (
    <footer
      className="border-t border-border/40"
      style={{
        backgroundColor: footerBgColor || "hsl(var(--muted) / 0.3)",
      }}
    >
      <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-primary">ابتسامة الورود</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{footerNote}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">روابط سريعة</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/services"
                className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                الخدمات
              </Link>
              <Link
                href="/doctors"
                className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                الأطباء
              </Link>
              <Link
                href="/departments"
                className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                الأقسام
              </Link>
              <Link
                href="/offers"
                className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                العروض
              </Link>
              <Link
                href="/privacy-policy"
                className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms-conditions"
                className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                الشروط والأحكام
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">تواصل معنا</h3>
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span className="break-all">{footerPhone}</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>مكة المكرمة، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">ساعات العمل</h3>
            <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
              <p>السبت - الخميس</p>
              <p className="font-medium text-foreground">9 صباحاً - 10 مساءً</p>
              <p className="text-xs mt-4">الجمعة: مغلق</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/40 flex justify-center">
          <SocialMediaLinks />
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/40 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2025 عيادات ابتسامة الورود. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
