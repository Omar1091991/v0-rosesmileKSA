"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AnimatedSection } from "@/components/animated-section"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-switcher"
import { useEffect, useState } from "react"

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const { language, isArabic } = useLanguage()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setService(null)

        const response = await fetch(`/api/services?id=${params.id}`)
        const data = await response.json()

        if (data.service) {
          setService(data.service)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching service:", error)
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <LoadingSpinner />
        <SiteFooter />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {isArabic ? "الخدمة غير موجودة" : "Service not found"}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <AnimatedSection animation="fade-up">
          <section className="bg-gradient-to-b from-muted/50 to-background py-12 sm:py-16 md:py-24">
            <div className="container px-4 sm:px-6 lg:px-8">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-primary hover:underline mb-6 sm:mb-8"
              >
                <ArrowRight className="h-4 w-4" />
                {isArabic ? "العودة إلى الخدمات" : "Back to Services"}
              </Link>

              <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start max-w-6xl">
                <AnimatedSection animation="scale-in">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-muted">
                    {service.image_url ? (
                      <img
                        src={service.image_url || "/placeholder.svg"}
                        alt={isArabic ? service.title_ar : service.title_en || service.title_ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-7xl sm:text-9xl">
                        {service.icon || "🏥"}
                      </div>
                    )}
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={0.2}>
                  <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
                    <div>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                        {isArabic ? service.title_ar : service.title_en || service.title_ar}
                      </h1>
                    </div>

                    {((isArabic && service.description_ar) || (!isArabic && service.description_en)) && (
                      <div className="space-y-2">
                        <h2 className="text-lg sm:text-xl font-semibold">
                          {isArabic ? "وصف الخدمة" : "Service Description"}
                        </h2>
                        <div
                          className="text-muted-foreground leading-relaxed text-base sm:text-lg prose prose-lg max-w-none whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: (isArabic
                              ? service.description_ar
                              : service.description_en || service.description_ar
                            ).replace(/<(?!\/?(?:strong|em|s|b|i|del|span)\b)[^>]*>/gi, ""),
                          }}
                        />
                      </div>
                    )}

                    <Link href="/booking/1">
                      <button className="w-full py-3 px-4 sm:px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-base sm:text-lg font-semibold">
                        {isArabic
                          ? `احجز موعد لـ ${service.title_ar}`
                          : `Book for ${service.title_en || service.title_ar}`}
                      </button>
                    </Link>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection animation="fade-up">
          <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {isArabic ? "احجز موعدك الآن" : "Book Your Appointment Now"}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  {isArabic ? "نحن هنا لخدمتك على مدار الساعة" : "We are here to serve you 24/7"}
                </p>
                <Link href="/booking/1">
                  <button
                    className="py-3 px-6 sm:px-8 text-white rounded-lg transition-colors text-base sm:text-lg font-semibold"
                    style={{ backgroundColor: "#1a4f8b" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#153d6f")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a4f8b")}
                  >
                    {isArabic ? "احجز موعد" : "Book Appointment"}
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <SiteFooter />
    </div>
  )
}
