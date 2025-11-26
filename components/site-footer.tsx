"use client"

import Link from "next/link"
import { Phone, MapPin, Clock } from "lucide-react"
import { SocialMediaLinks } from "@/components/social-media-links"
import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-switcher"

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
  const [workingHours, setWorkingHours] = useState<{
    saturday: { hours: string; closed: boolean }
    sunday: { hours: string; closed: boolean }
    monday: { hours: string; closed: boolean }
    tuesday: { hours: string; closed: boolean }
    wednesday: { hours: string; closed: boolean }
    thursday: { hours: string; closed: boolean }
    friday: { hours: string; closed: boolean }
  }>({
    saturday: { hours: "+966 12 345 6789", closed: false },
    sunday: { hours: "+966 12 345 6789", closed: false },
    monday: { hours: "+966 12 345 6789", closed: false },
    tuesday: { hours: "+966 12 345 6789", closed: false },
    wednesday: { hours: "+966 12 345 6789", closed: false },
    thursday: { hours: "+966 12 345 6789", closed: false },
    friday: { hours: "+966 12 345 6789", closed: true },
  })
  const [workingHoursTitle, setWorkingHoursTitle] = useState<string>("ساعات العمل")
  const [siteName, setSiteName] = useState<string>("ابتسامة الورود")

  const language = useLanguage()

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/site-settings")
        const settingsData = await response.json()
        const settings = Array.isArray(settingsData) ? settingsData : settingsData.settings || []

        const getValue = (key: string, defaultValue = "") => {
          const langKey = language === "ar" ? `${key}_ar` : `${key}_en`
          const setting = settings.find((s: any) => s.key === langKey || s.key === key)
          if (setting) {
            return language === "ar"
              ? setting.value_ar || defaultValue
              : setting.value_en || setting.value_ar || defaultValue
          }
          return defaultValue
        }

        setFooterBgColor(getValue("footer_background_color"))
        setFooterPhone(getValue("footer_phone", "+966 12 345 6789"))
        setFooterEmail(getValue("footer_email", "info@rosesmileksa.com"))
        setFooterNote(
          getValue(
            "footer_note",
            language === "ar"
              ? "عيادات طبية متخصصة في مكة المكرمة نقدم أفضل الخدمات الطبية بأحدث التقنيات"
              : "Specialized medical clinic in Makkah providing the best medical services with latest technologies",
          ),
        )
        setFooterHeadingColor(getValue("footer_heading_color"))
        setFooterTextColor(getValue("footer_text_color"))
        setFooterLinkColor(getValue("footer_link_color"))
        setFooterLinkHoverColor(getValue("footer_link_hover_color"))
        setFooterCopyrightColor(getValue("footer_copyright_color"))

        setWorkingHoursTitle(getValue("working_hours_title", language === "ar" ? "ساعات العمل" : "Working Hours"))

        setWorkingHours({
          saturday: {
            hours: getValue("saturday_hours", language === "ar" ? "1 م - 9 م" : "1 PM - 9 PM"),
            closed: getValue("saturday_closed", "false") === "true",
          },
          sunday: {
            hours: getValue("sunday_hours", language === "ar" ? "1 م - 9 م" : "1 PM - 9 PM"),
            closed: getValue("sunday_closed", "false") === "true",
          },
          monday: {
            hours: getValue("monday_hours", language === "ar" ? "1 م - 9 م" : "1 PM - 9 PM"),
            closed: getValue("monday_closed", "false") === "true",
          },
          tuesday: {
            hours: getValue("tuesday_hours", language === "ar" ? "1 م - 9 م" : "1 PM - 9 PM"),
            closed: getValue("tuesday_closed", "false") === "true",
          },
          wednesday: {
            hours: getValue("wednesday_hours", language === "ar" ? "1 م - 9 م" : "1 PM - 9 PM"),
            closed: getValue("wednesday_closed", "false") === "true",
          },
          thursday: {
            hours: getValue("thursday_hours", language === "ar" ? "2 م - 8 م" : "2 PM - 8 PM"),
            closed: getValue("thursday_closed", "false") === "true",
          },
          friday: {
            hours: getValue("friday_hours", language === "ar" ? "مغلق" : "Closed"),
            closed: getValue("friday_closed", "true") === "true",
          },
        })
        setSiteName(getValue("site_name", language === "ar" ? "ابتسامة الورود" : "Rose Smile Clinic"))
      } catch (error) {
        console.error("Error fetching footer settings:", error)
      }
    }
    fetchSettings()
  }, [language])

  const t = {
    siteName: siteName,
    quickLinks: language === "ar" ? "روابط سريعة" : "Quick Links",
    services: language === "ar" ? "الخدمات" : "Services",
    doctors: language === "ar" ? "الأطباء" : "Doctors",
    departments: language === "ar" ? "الأقسام" : "Departments",
    offers: language === "ar" ? "العروض" : "Offers",
    privacyPolicy: language === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
    termsConditions: language === "ar" ? "الشروط والأحكام" : "Terms & Conditions",
    contactUs: language === "ar" ? "تواصل معنا" : "Contact Us",
    workingHours: workingHoursTitle,
    address: language === "ar" ? "مكة المكرمة، المملكة العربية السعودية" : "Makkah, Saudi Arabia",
    copyright:
      language === "ar"
        ? `© ${new Date().getFullYear()} عيادات ${siteName}. جميع الحقوق محفوظة.`
        : `© ${new Date().getFullYear()} ${siteName} Clinic. All rights reserved.`,
    days: {
      saturday: language === "ar" ? "السبت" : "Saturday",
      sunday: language === "ar" ? "الأحد" : "Sunday",
      monday: language === "ar" ? "الاثنين" : "Monday",
      tuesday: language === "ar" ? "الثلاثاء" : "Tuesday",
      wednesday: language === "ar" ? "الأربعاء" : "Wednesday",
      thursday: language === "ar" ? "الخميس" : "Thursday",
      friday: language === "ar" ? "الجمعة" : "Friday",
    },
    closed: language === "ar" ? "مغلق" : "Closed",
  }

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
              <h3 className="text-base sm:text-lg font-bold footer-heading">{t.siteName}</h3>
              <p className="text-xs sm:text-sm footer-text leading-relaxed">{footerNote}</p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold footer-heading">{t.quickLinks}</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/services" className="text-xs sm:text-sm footer-link transition-colors">
                  {t.services}
                </Link>
                <Link href="/doctors" className="text-xs sm:text-sm footer-link transition-colors">
                  {t.doctors}
                </Link>
                <Link href="/departments" className="text-xs sm:text-sm footer-link transition-colors">
                  {t.departments}
                </Link>
                <Link href="/offers" className="text-xs sm:text-sm footer-link transition-colors">
                  {t.offers}
                </Link>
                <Link href="/privacy-policy" className="text-xs sm:text-sm footer-link transition-colors">
                  {t.privacyPolicy}
                </Link>
                <Link href="/terms-conditions" className="text-xs sm:text-sm footer-link transition-colors">
                  {t.termsConditions}
                </Link>
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold footer-heading">{t.contactUs}</h3>
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
                  <span>{t.address}</span>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold footer-heading">{t.workingHours}</h3>
              <div className="text-xs sm:text-sm footer-text space-y-2">
                <div className="flex items-start gap-2">
                  <Clock
                    className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5"
                    style={{ color: footerHeadingColor || "#ec4899" }}
                  />
                  <div className="space-y-1">
                    {Object.entries(workingHours).map(([day, { hours, closed }]) => (
                      <div key={day} className={closed ? "opacity-60" : ""}>
                        <span className="font-medium" style={{ color: footerHeadingColor || "#ffffff" }}>
                          {t.days[day as keyof typeof t.days]}:{" "}
                        </span>
                        <span>{closed ? t.closed : hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/40 flex justify-center">
            <SocialMediaLinks />
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/40 text-center text-xs sm:text-sm footer-copyright">
            <p>{t.copyright}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
