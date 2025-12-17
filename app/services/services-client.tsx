"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-switcher"

export function ServicesClient() {
  const [services, setServices] = useState([])
  const language = useLanguage()
  const [colors, setColors] = useState({
    cardDetailsButtonBg: "#f3f4f6",
    cardDetailsButtonText: "#1f2937",
    cardDetailsButtonHoverBg: "#e5e7eb",
    cardBookButtonBg: "#ec4899",
    cardBookButtonText: "#ffffff",
    cardBookButtonHoverBg: "#db2777",
  })

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data.services || []))
      .catch((error) => console.error("[v0] Error fetching services:", error))

    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          const settings = data.settings.reduce((acc: any, setting: any) => {
            acc[setting.key] = setting.value_ar
            return acc
          }, {})

          console.log("[v0] Card colors loaded:", {
            detailsBg: settings.card_details_button_bg_color,
            detailsText: settings.card_details_button_text_color,
          })

          setColors({
            cardDetailsButtonBg: settings.card_details_button_bg_color || "#f3f4f6",
            cardDetailsButtonText: settings.card_details_button_text_color || "#1f2937",
            cardDetailsButtonHoverBg: settings.card_details_button_hover_bg_color || "#e5e7eb",
            cardBookButtonBg: settings.card_book_button_bg_color || "#ec4899",
            cardBookButtonText: settings.card_book_button_text_color || "#ffffff",
            cardBookButtonHoverBg: settings.card_book_button_hover_bg_color || "#db2777",
          })
        }
      })
      .catch((error) => console.error("[v0] Error fetching colors:", error))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <AnimatedSection animation="fade-up">
          <section className="bg-gradient-to-b from-muted/50 to-background py-12 sm:py-16 md:py-24">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">
                  {language.language === "ar" ? "خدماتنا الطبية" : "Our Medical Services"}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground text-balance leading-relaxed">
                  {language.language === "ar"
                    ? "نقدم مجموعة شاملة من الخدمات الطبية المتخصصة بأحدث التقنيات وأعلى معايير الجودة"
                    : "We offer a comprehensive range of specialized medical services with the latest technologies and highest quality standards"}
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <section className="py-12 sm:py-16 md:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {services?.map((service: any, index: number) => (
                <AnimatedSection key={service.id} animation="scale-in" delay={index * 0.1}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
                    <CardContent className="pt-3 sm:pt-4 space-y-2 sm:space-y-3 flex flex-col flex-1 p-2 sm:p-4">
                      <Link href={`/services/${service.id}`} className="block">
                        {service.image_url ? (
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity">
                            <img
                              src={service.image_url || "/placeholder.svg"}
                              alt={language.language === "ar" ? service.title_ar : service.title_en}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-3xl sm:text-4xl md:text-5xl cursor-pointer hover:opacity-90 transition-opacity">
                            {service.icon || "🏥"}
                          </div>
                        )}
                      </Link>

                      <div className="space-y-1 flex-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold line-clamp-2">
                          {language.language === "ar" ? service.title_ar : service.title_en || service.title_ar}
                        </h3>
                        {(language.language === "ar"
                          ? service.subtitle_ar
                          : service.subtitle_en || service.subtitle_ar) && (
                          <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm line-clamp-2 hidden sm:block">
                            {language.language === "ar"
                              ? service.subtitle_ar
                              : service.subtitle_en || service.subtitle_ar}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 sm:gap-2 mt-auto">
                        <Link href={`/services/${service.id}`}>
                          <button
                            className="w-full py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors border"
                            style={{
                              backgroundColor: colors.cardDetailsButtonBg,
                              color: colors.cardDetailsButtonText,
                              borderColor: colors.cardDetailsButtonText,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.cardDetailsButtonHoverBg
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = colors.cardDetailsButtonBg
                            }}
                          >
                            {language.language === "ar" ? "التفاصيل" : "Details"}
                          </button>
                        </Link>
                        <Link href="/booking/1">
                          <button
                            className="w-full py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors"
                            style={{
                              backgroundColor: colors.cardBookButtonBg,
                              color: colors.cardBookButtonText,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.cardBookButtonHoverBg
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = colors.cardBookButtonBg
                            }}
                          >
                            {language.language === "ar" ? "احجز" : "Book"}
                          </button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            {(!services || services.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-base sm:text-lg">
                  {language.language === "ar" ? "لا توجد خدمات متاحة حالياً" : "No services available at the moment"}
                </p>
              </div>
            )}
          </div>
        </section>

        <AnimatedSection animation="fade-up">
          <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {language.language === "ar" ? "هل تحتاج لاستشارة طبية؟" : "Need a Medical Consultation?"}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  {language.language === "ar"
                    ? "احجز موعدك الآن واحصل على استشارة مجانية"
                    : "Book your appointment now and get a free consultation"}
                </p>
                <Link href="/booking/1">
                  <button
                    className="py-3 px-6 sm:px-8 text-white rounded-lg transition-colors text-base sm:text-lg font-semibold"
                    style={{ backgroundColor: "#1a4f8b" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#153d6f")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a4f8b")}
                  >
                    {language.language === "ar" ? "احجز موعد" : "Book Appointment"}
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
