"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-switcher"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mainBookingFormId, setMainBookingFormId] = useState<string>("")
  const [logoUrl, setLogoUrl] = useState<string>("/images/untitled-2.png")
  const [siteName, setSiteName] = useState<string>("ابتسامة الورود")
  const language = useLanguage()

  useEffect(() => {
    async function fetchData() {
      try {
        const formsResponse = await fetch("/api/booking-forms")
        const forms = await formsResponse.json()
        const mainForm = forms.find((f: any) => f.is_main)
        if (mainForm) {
          setMainBookingFormId(mainForm.id)
        }

        const settingsResponse = await fetch("/api/site-settings")
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          const settings = Array.isArray(settingsData) ? settingsData : settingsData.settings || []

          const logoSetting = settings.find((s: any) => s.key === "site_logo_url")
          const nameKey = language.language === "ar" ? "site_name_ar" : "site_name_en"
          const nameSetting = settings.find((s: any) => s.key === nameKey)

          if (logoSetting?.value_ar) {
            setLogoUrl(logoSetting.value_ar)
          }
          if (language.language === "ar") {
            setSiteName(nameSetting?.value_ar || "ابتسامة الورود")
          } else {
            setSiteName(nameSetting?.value_en || "Rose Smile Clinic")
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [language])

  const bookingLink = mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"

  const t = {
    home: language.language === "ar" ? "الرئيسية" : "Home",
    services: language.language === "ar" ? "الخدمات" : "Services",
    doctors: language.language === "ar" ? "الأطباء" : "Doctors",
    departments: language.language === "ar" ? "الأقسام" : "Departments",
    offers: language.language === "ar" ? "العروض" : "Offers",
    articles: language.language === "ar" ? "المقالات" : "Articles",
    bookAppointment: language.language === "ar" ? "احجز موعد" : "Book Appointment",
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        backgroundColor: "var(--header-background-color, #ec4899)",
      }}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 px-2 sm:px-0">
          <Image
            src={logoUrl || "/placeholder.svg"}
            alt={siteName}
            width={50}
            height={50}
            className="h-12 w-auto"
            priority
          />
          <div
            className="text-xl font-bold hidden sm:block"
            style={{
              color: "var(--header-logo-text-color, #ffffff)",
            }}
          >
            {siteName}
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            {t.home}
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            {t.services}
          </Link>
          <Link
            href="/doctors"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            {t.doctors}
          </Link>
          <Link
            href="/departments"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            {t.departments}
          </Link>
          <Link
            href="/offers"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            {t.offers}
          </Link>
          <Link
            href="/articles"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            {t.articles}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div style={{ color: "var(--header-nav-text-color, #ffffff)" }}>
            <LanguageSwitcher />
          </div>

          <Button
            size="sm"
            asChild
            style={{
              backgroundColor: "var(--book-appointment-button-bg-color, #ec4899)",
              color: "var(--book-appointment-button-text-color, #ffffff)",
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget
            }}
          >
            <Link href={bookingLink}>{t.bookAppointment}</Link>
          </Button>
        </div>

        <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 p-4 bg-background/80 backdrop-blur">
          <Link href="/" className="text-sm font-medium transition-colors">
            {t.home}
          </Link>
          <Link href="/services" className="text-sm font-medium transition-colors">
            {t.services}
          </Link>
          <Link href="/doctors" className="text-sm font-medium transition-colors">
            {t.doctors}
          </Link>
          <Link href="/departments" className="text-sm font-medium transition-colors">
            {t.departments}
          </Link>
          <Link href="/offers" className="text-sm font-medium transition-colors">
            {t.offers}
          </Link>
          <Link href="/articles" className="text-sm font-medium transition-colors">
            {t.articles}
          </Link>
          <Link href={bookingLink} className="text-sm font-medium transition-colors">
            {t.bookAppointment}
          </Link>
          <LanguageSwitcher />
        </div>
      )}
    </header>
  )
}
