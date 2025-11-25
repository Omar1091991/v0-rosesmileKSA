"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Tag } from "lucide-react"
import { query } from "@/lib/db"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function OffersPage() {
  let offers = []
  try {
    const result = await query("SELECT * FROM offers WHERE is_active = true ORDER BY order_index")
    offers = result.rows || []
  } catch (error) {
    console.error("[v0] Error fetching offers:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">عروضنا الحصرية</h1>
              <p className="text-lg text-muted-foreground text-balance leading-relaxed">
                استفد من عروضنا الخاصة والمحدودة على مختلف الخدمات الطبية
              </p>
            </div>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {offers?.map((offer) => (
                <Card key={offer.id} className="hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                  {offer.image_url && (
                    <div className="w-full aspect-video overflow-hidden bg-muted">
                      <img
                        src={offer.image_url || "/placeholder.svg"}
                        alt={offer.title_ar}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-bold flex-1">{offer.title_ar}</h3>
                      {offer.discount_percentage && (
                        <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                          خصم {offer.discount_percentage}%
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{offer.description_ar}</p>

                    {offer.price_before && offer.price_after && (
                      <div className="flex items-center gap-4 py-4 border-y border-border">
                        <div className="flex items-center gap-2">
                          <Tag className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-3xl font-bold text-primary">{offer.price_after} ريال</div>
                            <div className="text-sm text-muted-foreground line-through">{offer.price_before} ريال</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {(offer.valid_from || offer.valid_until) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          العرض ساري حتى:{" "}
                          {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString("ar-SA") : "نهاية الشهر"}
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
                        احجز الآن واستفد من العرض
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!offers || offers.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">لا توجد عروض متاحة حالياً</p>
                <p className="text-sm text-muted-foreground mt-2">تابعنا للحصول على آخر العروض والخصومات</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">لا تفوت الفرصة</h2>
              <p className="text-lg text-primary-foreground/80">احجز موعدك الآن واستفد من عروضنا الحصرية</p>
              <Link href="/booking/1">
                <button
                  className="py-3 px-8 text-white rounded-md transition-colors font-semibold text-lg"
                  style={{ backgroundColor: "#1a4f8b" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#153d6f")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a4f8b")}
                >
                  احجز موعد الآن
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
