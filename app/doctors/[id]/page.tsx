"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/animated-section"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-switcher"
import { useEffect, useState } from "react"

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const language = useLanguage()
  const [doctor, setDoctor] = useState<any>(null)
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setDoctor(null)
        setCases([])

        const response = await fetch(`/api/doctors?id=${params.id}`)
        const data = await response.json()

        if (data.length > 0) {
          setDoctor(data[0])

          const casesResponse = await fetch(`/api/doctor-cases?doctor_id=${params.id}`)
          const casesData = await casesResponse.json()
          setCases(casesData || [])
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching doctor:", error)
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

  if (!doctor) {
    return <div className="flex min-h-screen items-center justify-center">الطبيب غير موجود</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <AnimatedSection animation="fade-up">
          <section className="bg-gradient-to-b from-muted/50 to-background py-12 sm:py-16 md:py-24">
            <div className="container px-4 sm:px-6 lg:px-8">
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 hover:underline mb-6 sm:mb-8"
                style={{ color: "#1a4f8b" }}
              >
                <ArrowRight className="h-4 w-4" />
                {language === "ar" ? "العودة إلى الأطباء" : "Back to Doctors"}
              </Link>

              <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start max-w-6xl">
                <AnimatedSection animation="scale-in">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-muted">
                    {doctor.image_url ? (
                      <img
                        src={doctor.image_url || "/placeholder.svg"}
                        alt={language === "ar" ? doctor.name_ar : doctor.name_en || doctor.name_ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-7xl sm:text-9xl">👨‍⚕️</div>
                    )}
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={0.2}>
                  <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
                    <div>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                        {language === "ar" ? doctor.name_ar : doctor.name_en || doctor.name_ar}
                      </h1>
                    </div>

                    <div>
                      <Badge className="text-base sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2">
                        {language === "ar" ? doctor.specialty_ar : doctor.specialty_en || doctor.specialty_ar}
                      </Badge>
                    </div>

                    {((language === "ar" && doctor.bio_ar) || (language === "en" && doctor.bio_en)) && (
                      <div className="space-y-2">
                        <h2 className="text-lg sm:text-xl font-semibold">
                          {language === "ar" ? "نبذة عن الطبيب" : "About the Doctor"}
                        </h2>
                        <div
                          className="text-muted-foreground leading-relaxed text-base sm:text-lg whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: (language === "ar" ? doctor.bio_ar : doctor.bio_en || doctor.bio_ar).replace(
                              /<(?!\/?(?:strong|em|s|b|i|del|span)\b)[^>]*>/gi,
                              "",
                            ),
                          }}
                        />
                      </div>
                    )}

                    <Link href="/booking/1">
                      <button
                        className="w-full py-3 px-4 sm:px-6 text-white rounded-lg transition-colors text-base sm:text-lg font-semibold"
                        style={{ backgroundColor: "#1a4f8b" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#153d6f")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a4f8b")}
                      >
                        {language === "ar"
                          ? `احجز موعد مع ${doctor.name_ar}`
                          : `Book with ${doctor.name_en || doctor.name_ar}`}
                      </button>
                    </Link>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {cases && cases.length > 0 && (
          <section className="py-12 sm:py-16 md:py-24">
            <div className="container px-4 sm:px-6 lg:px-8">
              <AnimatedSection animation="fade-up">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    {language === "ar" ? `حالات ${doctor.name_ar}` : `${doctor.name_en || doctor.name_ar}'s Cases`}
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    {language === "ar"
                      ? "نماذج من الحالات التي تم علاجها بنجاح"
                      : "Examples of successfully treated cases"}
                  </p>
                </div>
              </AnimatedSection>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {cases.map((case_, index) => (
                  <AnimatedSection key={case_.id} animation="scale-in" delay={index * 0.05}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="aspect-square">
                          <img
                            src={case_.image_url || "/placeholder.svg"}
                            alt={
                              language === "ar"
                                ? case_.caption_ar || "حالة"
                                : case_.caption_en || case_.caption_ar || "Case"
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {((language === "ar" && case_.caption_ar) || (language === "en" && case_.caption_en)) && (
                          <div className="p-2 sm:p-3">
                            <p className="text-xs sm:text-sm text-center">
                              {language === "ar" ? case_.caption_ar : case_.caption_en || case_.caption_ar}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        <AnimatedSection animation="fade-up">
          <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {language === "ar"
                    ? `احجز موعدك مع ${doctor.name_ar}`
                    : `Book with ${doctor.name_en || doctor.name_ar}`}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  {language === "ar" ? "نحن هنا لخدمتك على مدار الساعة" : "We are here to serve you 24/7"}
                </p>
                <Link href="/booking/1">
                  <button
                    className="py-3 px-6 sm:px-8 text-white rounded-lg transition-colors text-base sm:text-lg font-semibold"
                    style={{ backgroundColor: "#1a4f8b" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#153d6f")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a4f8b")}
                  >
                    {language === "ar" ? "احجز موعد" : "Book Appointment"}
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
