"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mainBookingFormId, setMainBookingFormId] = useState<string>("")
  const [logoUrl, setLogoUrl] = useState<string>("/images/untitled-2.png")
  const [siteName, setSiteName] = useState<string>("ابتسامة الورود")

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
          const nameSetting = settings.find((s: any) => s.key === "site_name_ar")

          if (logoSetting?.value_ar) {
            setLogoUrl(logoSetting.value_ar)
          }
          if (nameSetting?.value_ar) {
            setSiteName(nameSetting.value_ar)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const bookingLink = mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"

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
            الرئيسية
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            الخدمات
          </Link>
          <Link
            href="/doctors"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            الأطباء
          </Link>
          <Link
            href="/departments"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            الأقسام
          </Link>
          <Link
            href="/offers"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            العروض
          </Link>
          <Link
            href="/articles"
            className="text-sm font-medium transition-colors"
            style={{
              color: "var(--header-nav-text-color, #ffffff)",
            }}
          >
            المقالات
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
              target.style.backgroundColor = "var(--book-appointment-button-hover-bg-color, #db2777)"
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget
              target.style.backgroundColor = "var(--book-appointment-button-bg-color, #ec4899)"
            }}
          >
            <Link href={bookingLink}>احجز موعد</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-3"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            color: "var(--header-nav-text-color, #ffffff)",
          }}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container flex flex-col gap-4 py-4 px-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: "var(--header-nav-text-color, #ffffff)",
              }}
            >
              الرئيسية
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: "var(--header-nav-text-color, #ffffff)",
              }}
            >
              الخدمات
            </Link>
            <Link
              href="/doctors"
              className="text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: "var(--header-nav-text-color, #ffffff)",
              }}
            >
              الأطباء
            </Link>
            <Link
              href="/departments"
              className="text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: "var(--header-nav-text-color, #ffffff)",
              }}
            >
              الأقسام
            </Link>
            <Link
              href="/offers"
              className="text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: "var(--header-nav-text-color, #ffffff)",
              }}
            >
              العروض
            </Link>
            <Link
              href="/articles"
              className="text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: "var(--header-nav-text-color, #ffffff)",
              }}
            >
              المقالات
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <LanguageSwitcher />

              <Button
                size="sm"
                asChild
                onClick={() => setIsMenuOpen(false)}
                style={{
                  backgroundColor: "var(--book-appointment-button-bg-color, #ec4899)",
                  color: "var(--book-appointment-button-text-color, #ffffff)",
                }}
              >
                <Link href={bookingLink}>احجز موعد</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
