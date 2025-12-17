"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Offer {
  id: number
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  price_before?: number
  price_after?: number
  original_price?: number
  discounted_price?: number
  discount_percentage?: number
  valid_from?: string
  valid_until?: string
  image_url?: string
  is_active?: boolean
  order_index?: number
}

export default function OffersClientPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState<"ar" | "en">("ar")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "ar" | "en" | null
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const isArabic = currentLanguage === "ar"

  useEffect(() => {
    async function fetchOffers() {
      try {
        console.log("[v0] Fetching offers from API...")
        const res = await fetch("/api/offers")
        const data = await res.json()
        console.log("[v0] Offers response:", data)

        if (Array.isArray(data)) {
          setOffers(data.filter((offer) => offer.is_active !== false))
        } else if (data.offers) {
          setOffers(data.offers.filter((offer) => offer.is_active !== false))
        } else {
          setOffers([])
        }
      } catch (error) {
        console.error("[v0] Error fetching offers:", error)
        setOffers([])
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">
                {isArabic ? "عروضنا الحصرية" : "Our Exclusive Offers"}
              </h1>
              <p className="text-lg text-muted-foreground text-balance leading-relaxed">
                {isArabic
                  ? "استفد من عروضنا الخاصة والمحدودة على مختلف الخدمات الطبية"
                  : "Take advantage of our special and limited offers on various medical services"}
              </p>
            </div>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {offers?.map((offer) => {
                const priceAfter = offer.price_after || offer.discounted_price
                const priceBefore = offer.price_before || offer.original_price
                const title = isArabic ? offer.title_ar : offer.title_en || offer.title_ar
                const description = isArabic ? offer.description_ar : offer.description_en || offer.description_ar

                return (
                  <Card key={offer.id} className="hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                    {offer.image_url && (
                      <div className="w-full aspect-video overflow-hidden bg-muted">
                        <img
                          src={offer.image_url || "/placeholder.svg"}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-bold flex-1">{title}</h3>
                        {offer.discount_percentage && (
                          <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                            {isArabic ? `خصم ${offer.discount_percentage}%` : `${offer.discount_percentage}% OFF`}
                          </Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground leading-relaxed">{description}</p>

                      {priceBefore && priceAfter && (
                        <div className="flex items-center gap-4 py-4 border-y border-border">
                          <div className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary" />
                            <div>
                              <div className="text-3xl font-bold text-primary">
                                {priceAfter} {isArabic ? "ريال" : "SAR"}
                              </div>
                              <div className="text-sm text-muted-foreground line-through">
                                {priceBefore} {isArabic ? "ريال" : "SAR"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {(offer.valid_from || offer.valid_until) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {isArabic ? "العرض ساري حتى: " : "Valid until: "}
                            {offer.valid_until
                              ? new Date(offer.valid_until).toLocaleDateString(isArabic ? "ar-SA" : "en-US")
                              : isArabic
                                ? "نهاية الشهر"
                                : "End of month"}
                          </span>
                        </div>
                      )}

                      <Link href="/booking/1">
                        <button
                          className="w-full py-3 px-4 text-white rounded-md transition-colors font-semibold"
                          style={{ backgroundColor: "#1a4f8b" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#153d6f")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a4f8b")}
                        >
                          {isArabic ? "احجز الآن واستفد من العرض" : "Book Now and Get This Offer"}
                        </button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {(!offers || offers.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {isArabic ? "لا توجد عروض متاحة حالياً" : "No offers available at the moment"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isArabic
                    ? "تابعنا للحصول على آخر العروض والخصومات"
                    : "Follow us to get the latest offers and discounts"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                {isArabic ? "لا تفوت الفرصة" : "Don't Miss the Opportunity"}
              </h2>
              <p className="text-lg text-primary-foreground/80">
                {isArabic
                  ? "احجز موعدك الآن واستفد من عروضنا الحصرية"
                  : "Book your appointment now and take advantage of our exclusive offers"}
              </p>
              <Link href="/booking/1">
                <button
                  className="py-3 px-8 text-white rounded-md transition-colors font-semibold text-lg"
                  style={{ backgroundColor: "#1a4f8b" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#153d6f")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a4f8b")}
                >
                  {isArabic ? "احجز موعد الآن" : "Book Appointment Now"}
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
