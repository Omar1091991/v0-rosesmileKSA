import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingDialog } from "@/components/booking-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { AnimatedSection } from "@/components/animated-section"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DoctorDetailPage({ params }: { params: { id: string } }) {
  const doctorResult = await db.query("SELECT * FROM doctors WHERE id = $1", [params.id])

  if (doctorResult.rows.length === 0) {
    notFound()
  }

  const doctor = doctorResult.rows[0]
  const casesResult = await db.query("SELECT * FROM doctor_cases WHERE doctor_id = $1 ORDER BY order_index", [
    params.id,
  ])
  const cases = casesResult.rows

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <AnimatedSection animation="fade-up">
          <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
            <div className="container">
              <Link href="/doctors" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                <ArrowRight className="h-4 w-4" />
                العودة إلى الأطباء
              </Link>

              <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl">
                <AnimatedSection animation="scale-in">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-muted">
                    {doctor.image_url ? (
                      <img
                        src={doctor.image_url || "/placeholder.svg"}
                        alt={doctor.name_ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-9xl">👨‍⚕️</div>
                    )}
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={0.2}>
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-2">{doctor.name_ar}</h1>
                      {doctor.name_en && <p className="text-2xl text-muted-foreground">{doctor.name_en}</p>}
                    </div>

                    <div>
                      <Badge className="text-lg px-4 py-2">{doctor.specialty_ar}</Badge>
                      {doctor.specialty_en && (
                        <Badge variant="outline" className="text-lg px-4 py-2 mr-2">
                          {doctor.specialty_en}
                        </Badge>
                      )}
                    </div>

                    {doctor.bio_ar && (
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold">نبذة عن الطبيب</h2>
                        <div
                          className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: doctor.bio_ar.replace(/<(?!\/?(?:strong|em|s|b|i|del|span)\b)[^>]*>/gi, ""),
                          }}
                        />
                      </div>
                    )}

                    {doctor.bio_en && (
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold">About the Doctor</h2>
                        <div
                          className="text-muted-foreground leading-relaxed whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: doctor.bio_en.replace(/<(?!\/?(?:strong|em|s|b|i|del|span)\b)[^>]*>/gi, ""),
                          }}
                        />
                      </div>
                    )}

                    <BookingDialog
                      trigger={
                        <button className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold">
                          احجز موعد مع {doctor.name_ar.split(" ")[0]}
                        </button>
                      }
                    />
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {cases && cases.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container">
              <AnimatedSection animation="fade-up">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">حالات {doctor.name_ar.split(" ")[0]}</h2>
                  <p className="text-lg text-muted-foreground">نماذج من الحالات التي تم علاجها بنجاح</p>
                </div>
              </AnimatedSection>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {cases.map((case_, index) => (
                  <AnimatedSection key={case_.id} animation="scale-in" delay={index * 0.05}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="aspect-square">
                          <img
                            src={case_.image_url || "/placeholder.svg"}
                            alt={case_.caption_ar || "حالة"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {case_.caption_ar && (
                          <div className="p-3">
                            <p className="text-sm text-center">{case_.caption_ar}</p>
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
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">احجز موعدك مع {doctor.name_ar.split(" ")[0]}</h2>
                <p className="text-lg text-muted-foreground">نحن هنا لخدمتك على مدار الساعة</p>
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
