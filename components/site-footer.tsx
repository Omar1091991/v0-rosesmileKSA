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
  const [footerHeadingColor, setFooterHeadingColor] = useState<string>("")
  const [footerTextColor, setFooterTextColor] = useState<string>("")
  const [footerLinkColor, setFooterLinkColor] = useState<string>("")
  const [footerLinkHoverColor, setFooterLinkHoverColor] = useState<string>("")
  const [footerCopyrightColor, setFooterCopyrightColor] = useState<string>("")

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

        const headingColorSetting = settings.find((s: any) => s.key === "footer_heading_color")
        if (headingColorSetting?.value_ar) {
          setFooterHeadingColor(headingColorSetting.value_ar)
        }

        const textColorSetting = settings.find((s: any) => s.key === "footer_text_color")
        if (textColorSetting?.value_ar) {
          setFooterTextColor(textColorSetting.value_ar)
        }

        const linkColorSetting = settings.find((s: any) => s.key === "footer_link_color")
        if (linkColorSetting?.value_ar) {
          setFooterLinkColor(linkColorSetting.value_ar)
        }

        const linkHoverColorSetting = settings.find((s: any) => s.key === "footer_link_hover_color")
        if (linkHoverColorSetting?.value_ar) {
          setFooterLinkHoverColor(linkHoverColorSetting.value_ar)
        }

        const copyrightColorSetting = settings.find((s: any) => s.key === "footer_copyright_color")
        if (copyrightColorSetting?.value_ar) {
          setFooterCopyrightColor(copyrightColorSetting.value_ar)
        }
      } catch (error) {
        console.error("Error fetching footer settings:", error)
      }
    }
    fetchSettings()
  }, [])

  return (
    <>
      <style jsx>{`
        .footer-heading {
          color: ${footerHeadingColor || "#ffffff"};
        }
        .footer-text {
          color: ${footerTextColor || "hsl(var(--muted-foreground))"};
        }
        .footer-link {
          color: ${footerLinkColor || "hsl(var(--muted-foreground))"};
        }
        .footer-link:hover {
          color: ${footerLinkHoverColor || "hsl(var(--primary))"};
        }
        .footer-copyright {
          color: ${footerCopyrightColor || "hsl(var(--muted-foreground))"};
        }
      `}</style>

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
              <h3 className="text-base sm:text-lg font-bold footer-heading">ابتسامة الورود</h3>
              <p className="text-xs sm:text-sm footer-text leading-relaxed">{footerNote}</p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold footer-heading">روابط سريعة</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/services" className="text-xs sm:text-sm footer-link transition-colors">
                  الخدمات
                </Link>
                <Link href="/doctors" className="text-xs sm:text-sm footer-link transition-colors">
                  الأطباء
                </Link>
                <Link href="/departments" className="text-xs sm:text-sm footer-link transition-colors">
                  الأقسام
                </Link>
                <Link href="/offers" className="text-xs sm:text-sm footer-link transition-colors">
                  العروض
                </Link>
                <Link href="/privacy-policy" className="text-xs sm:text-sm footer-link transition-colors">
                  سياسة الخصوصية
                </Link>
                <Link href="/terms-conditions" className="text-xs sm:text-sm footer-link transition-colors">
                  الشروط والأحكام
                </Link>
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold footer-heading">تواصل معنا</h3>
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm footer-text">
                  <Phone
                    className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
                    style={{ color: footerHeadingColor || "#ec4899" }}
                  />
                  <span className="break-all">{footerPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm footer-text">
                  <MapPin
                    className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5"
                    style={{ color: footerHeadingColor || "#ec4899" }}
                  />
                  <span>مكة المكرمة، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold footer-heading">ساعات العمل</h3>
              <div className="text-xs sm:text-sm footer-text space-y-2">
                <p>السبت - الخميس</p>
                <p className="font-medium" style={{ color: footerHeadingColor || "#ffffff" }}>
                  9 صباحاً - 10 مساءً
                </p>
                <p className="text-xs mt-4">الجمعة: مغلق</p>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/40 flex justify-center">
            <SocialMediaLinks />
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/40 text-center text-xs sm:text-sm footer-copyright">
            <p>© 2025 عيادات ابتسامة الورود. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
