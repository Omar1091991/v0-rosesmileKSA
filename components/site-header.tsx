"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mainBookingFormId, setMainBookingFormId] = useState<string>("")
  const [headerBgColor, setHeaderBgColor] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [formsResponse, settingsResponse] = await Promise.all([
          fetch("/api/booking-forms"),
          fetch("/api/site-settings"),
        ])

        const forms = await formsResponse.json()
        const mainForm = forms.find((f: any) => f.is_main)
        if (mainForm) {
          setMainBookingFormId(mainForm.id)
        }

        const settingsData = await settingsResponse.json()
        const settings = Array.isArray(settingsData) ? settingsData : settingsData.settings || []
        const headerColorSetting = settings.find((s: any) => s.key === "header_background_color")
        if (headerColorSetting?.value_ar) {
          setHeaderBgColor(headerColorSetting.value_ar)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const bookingLink = mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{
          backgroundColor: headerBgColor || "hsl(var(--background) / 0.95)",
        }}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled-2-Ipgz40KKLVCjXdRLpN2Uu3iW79G489.png"
              alt="ابتسامة الورود"
              width={50}
              height={50}
              className="h-12 w-auto"
              priority
            />
            <div className="text-xl font-bold text-primary hidden sm:block">ابتسامة الورود</div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
              الخدمات
            </Link>
            <Link href="/doctors" className="text-sm font-medium hover:text-primary transition-colors">
              الأطباء
            </Link>
            <Link href="/departments" className="text-sm font-medium hover:text-primary transition-colors">
              الأقسام
            </Link>
            <Link href="/offers" className="text-sm font-medium hover:text-primary transition-colors">
              العروض
            </Link>
            <Link href="/articles" className="text-sm font-medium hover:text-primary transition-colors">
              المقالات
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <Settings className="ml-2 h-4 w-4" />
                لوحة التحكم
              </Link>
            </Button>

            <Button size="sm" asChild>
              <Link href={bookingLink}>احجز موعد</Link>
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background">
            <nav className="container flex flex-col gap-4 py-4">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                href="/services"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الخدمات
              </Link>
              <Link
                href="/doctors"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الأطباء
              </Link>
              <Link
                href="/departments"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الأقسام
              </Link>
              <Link
                href="/offers"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                العروض
              </Link>
              <Link
                href="/articles"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                المقالات
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <LanguageSwitcher />

                <Button variant="outline" size="sm" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href="/dashboard">
                    <Settings className="ml-2 h-4 w-4" />
                    لوحة التحكم
                  </Link>
                </Button>
                <Button size="sm" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href={bookingLink}>احجز موعد</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
