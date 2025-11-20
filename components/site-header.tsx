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

  useEffect(() => {
    async function fetchData() {
      try {
        const formsResponse = await fetch("/api/booking-forms")
        const forms = await formsResponse.json()
        const mainForm = forms.find((f: any) => f.is_main)
        if (mainForm) {
          setMainBookingFormId(mainForm.id)
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
      <style jsx>{`
        .header-logo-text {
          color: var(--header-logo-text-color, #ffffff);
        }
        .header-nav-link {
          color: var(--header-nav-text-color, #ffffff);
        }
        .header-nav-link:hover {
          color: var(--header-nav-hover-color, rgba(255, 255, 255, 0.8));
        }
        .header-icon {
          color: var(--header-nav-text-color, #ffffff);
        }
        header {
          background-color: var(--header-background-color, #ec4899) !important;
        }
      `}</style>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3 px-2 sm:px-0">
            <Image
              src="/images/untitled-2.png"
              alt="ابتسامة الورود"
              width={50}
              height={50}
              className="h-12 w-auto"
              priority
            />
            <div className="text-xl font-bold header-logo-text hidden sm:block">ابتسامة الورود</div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium header-nav-link transition-colors">
              الرئيسية
            </Link>
            <Link href="/services" className="text-sm font-medium header-nav-link transition-colors">
              الخدمات
            </Link>
            <Link href="/doctors" className="text-sm font-medium header-nav-link transition-colors">
              الأطباء
            </Link>
            <Link href="/departments" className="text-sm font-medium header-nav-link transition-colors">
              الأقسام
            </Link>
            <Link href="/offers" className="text-sm font-medium header-nav-link transition-colors">
              العروض
            </Link>
            <Link href="/articles" className="text-sm font-medium header-nav-link transition-colors">
              المقالات
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="header-icon">
              <LanguageSwitcher />
            </div>

            <Button size="sm" asChild>
              <Link href={bookingLink}>احجز موعد</Link>
            </Button>
          </div>

          <button className="md:hidden p-3 header-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background">
            <nav className="container flex flex-col gap-4 py-4 px-6">
              <Link
                href="/"
                className="text-sm font-medium header-nav-link transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                href="/services"
                className="text-sm font-medium header-nav-link transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الخدمات
              </Link>
              <Link
                href="/doctors"
                className="text-sm font-medium header-nav-link transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الأطباء
              </Link>
              <Link
                href="/departments"
                className="text-sm font-medium header-nav-link transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الأقسام
              </Link>
              <Link
                href="/offers"
                className="text-sm font-medium header-nav-link transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                العروض
              </Link>
              <Link
                href="/articles"
                className="text-sm font-medium header-nav-link transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                المقالات
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <LanguageSwitcher />

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
