"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingDialog } from "@/components/booking-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import { useEffect, useState } from "react"

function stripHtmlTags(html: string): string {
  if (!html) return ""
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim()
}

function getExcerpt(text: string, maxLength = 100): string {
  const plainText = stripHtmlTags(text)
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + "..."
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [colors, setColors] = useState({
    cardDetailsButtonBg: "#f3f4f6",
    cardDetailsButtonText: "#1f2937",
    cardDetailsButtonHoverBg: "#e5e7eb",
    cardBookButtonBg: "#ec4899",
    cardBookButtonText: "#ffffff",
    cardBookButtonHoverBg: "#db2777",
  })

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        // Handle both array and object formats
        const doctorsData = Array.isArray(data) ? data : data.doctors || []
        console.log("[v0] Loaded doctors:", doctorsData.length)
        setDoctors(doctorsData)
      })
      .catch((error) => console.error("[v0] Error fetching doctors:", error))

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
            bookBg: settings.card_book_button_bg_color,
            bookText: settings.card_book_button_text_color,
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
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">أطباؤنا المتميزون</h1>
                <p className="text-base sm:text-lg text-muted-foreground text-balance leading-relaxed">
                  فريق طبي متخصص من أفضل الأطباء والاستشاريين بخبرات عالمية
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <section className="py-12 sm:py-16 md:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {doctors?.map((doctor: any, index: number) => (
                <AnimatedSection key={doctor.id} animation="scale-in" delay={index * 0.1}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
                    <CardContent className="pt-3 sm:pt-4 space-y-2 sm:space-y-3 p-2 sm:p-4 flex flex-col flex-1">
                      <Link href={`/doctors/${doctor.id}`} className="block">
                        {doctor.image_url ? (
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity">
                            <img
                              src={doctor.image_url || "/placeholder.svg"}
                              alt={doctor.name_ar}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-3xl sm:text-4xl md:text-5xl cursor-pointer hover:opacity-90 transition-opacity">
                            👨‍⚕️
                          </div>
                        )}
                      </Link>

                      <div className="space-y-1 flex-1 flex flex-col">
                        <div>
                          <h3 className="text-sm sm:text-base md:text-lg font-bold leading-tight line-clamp-2">
                            {doctor.name_ar}
                          </h3>
                          <p className="text-primary font-medium text-xs sm:text-sm mt-0.5 line-clamp-1">
                            {doctor.specialty_ar}
                          </p>
                        </div>

                        {doctor.bio_ar && (
                          <p className="text-muted-foreground leading-relaxed text-xs line-clamp-2 hidden sm:block">
                            {getExcerpt(doctor.bio_ar, 60)}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-auto pt-1 sm:pt-2">
                        <Link href={`/doctors/${doctor.id}`} className="flex-1">
                          <button
                            className="w-full py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors"
                            style={{
                              backgroundColor: colors.cardDetailsButtonBg,
                              color: colors.cardDetailsButtonText,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.cardDetailsButtonHoverBg
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = colors.cardDetailsButtonBg
                            }}
                          >
                            التفاصيل
                          </button>
                        </Link>
                        <BookingDialog
                          trigger={
                            <button
                              className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors"
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
                              احجز
                            </button>
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            {(!doctors || doctors.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-base sm:text-lg">لا يوجد أطباء متاحون حالياً</p>
              </div>
            )}
          </div>
        </section>

        <AnimatedSection animation="fade-up">
          <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">احجز موعدك مع أفضل الأطباء</h2>
                <p className="text-base sm:text-lg text-muted-foreground">نحن هنا لخدمتك على مدار الساعة</p>
                <BookingDialog
                  trigger={
                    <button
                      className="py-3 px-6 sm:px-8 text-white rounded-lg transition-colors text-base sm:text-lg font-semibold"
                      style={{ backgroundColor: "#1a4f8b" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#153d6f")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a4f8b")}
                    >
                      احجز موعد
                    </button>
                  }
                />
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <SiteFooter />
    </div>
  )
}
