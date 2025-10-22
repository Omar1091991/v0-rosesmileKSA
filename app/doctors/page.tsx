import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingDialog } from "@/components/booking-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function DoctorsPage() {
  let doctors = []
  try {
    const result = await query("SELECT * FROM doctors WHERE is_active = true ORDER BY order_index")
    doctors = result.rows || []
  } catch (error) {
    console.error("[v0] Error fetching doctors:", error)
  }

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {doctors?.map((doctor, index) => (
                <AnimatedSection key={doctor.id} animation="scale-in" delay={index * 0.1}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                    <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 p-4 sm:p-6">
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
                          <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-5xl sm:text-6xl cursor-pointer hover:opacity-90 transition-opacity">
                            👨‍⚕️
                          </div>
                        )}
                      </Link>
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold">{doctor.name_ar}</h3>
                          <p className="text-primary font-medium text-base sm:text-lg">{doctor.specialty_ar}</p>
                        </div>
                        {doctor.bio_ar && (
                          <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">{doctor.bio_ar}</p>
                        )}
                        {doctor.qualifications_ar && doctor.qualifications_ar.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs sm:text-sm font-semibold">المؤهلات:</p>
                            <div className="flex flex-wrap gap-2">
                              {doctor.qualifications_ar.map((qual, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {qual}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/doctors/${doctor.id}`} className="flex-1">
                          <button className="w-full py-2 px-3 sm:px-4 text-sm sm:text-base bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                            عرض التفاصيل
                          </button>
                        </Link>
                        <BookingDialog
                          trigger={
                            <button className="flex-1 py-2 px-3 sm:px-4 text-sm sm:text-base bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                              احجز الآن
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
                <BookingDialog />
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <SiteFooter />
    </div>
  )
}
