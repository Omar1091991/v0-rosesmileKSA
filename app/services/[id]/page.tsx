import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingDialog } from "@/components/booking-dialog"
import { db } from "@/lib/db"
import { AnimatedSection } from "@/components/animated-section"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const serviceResult = await db.query("SELECT * FROM services WHERE id = $1", [params.id])

  if (serviceResult.rows.length === 0) {
    notFound()
  }

  const service = serviceResult.rows[0]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <AnimatedSection animation="fade-up">
          <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
            <div className="container">
              <Link href="/#services" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                <ArrowRight className="h-4 w-4" />
                العودة إلى الخدمات
              </Link>

              <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl">
                <AnimatedSection animation="scale-in">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-muted">
                    {service.image_url ? (
                      <img
                        src={service.image_url || "/placeholder.svg"}
                        alt={service.title_ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-9xl">
                        {service.icon || "🏥"}
                      </div>
                    )}
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={0.2}>
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-2">{service.title_ar}</h1>
                      {service.title_en && <p className="text-2xl text-muted-foreground">{service.title_en}</p>}
                    </div>

                    {service.description_ar && (
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold">وصف الخدمة</h2>
                        <div
                          className="text-muted-foreground leading-relaxed text-lg prose prose-lg max-w-none whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: service.description_ar.replace(
                              /<(?!\/?(?:strong|em|s|b|i|del|span)\b)[^>]*>/gi,
                              "",
                            ),
                          }}
                        />
                      </div>
                    )}

                    {service.description_en && (
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Service Description</h2>
                        <div
                          className="text-muted-foreground leading-relaxed prose max-w-none whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: service.description_en.replace(
                              /<(?!\/?(?:strong|em|s|b|i|del|span)\b)[^>]*>/gi,
                              "",
                            ),
                          }}
                        />
                      </div>
                    )}

                    <BookingDialog
                      trigger={
                        <button className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold">
                          احجز موعد لـ {service.title_ar}
                        </button>
                      }
                    />
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection animation="fade-up">
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">احجز موعدك الآن</h2>
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
