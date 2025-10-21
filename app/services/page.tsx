import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingDialog } from "@/components/booking-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { query } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

async function getServices() {
  try {
    const result = await query("SELECT * FROM services WHERE is_active = true ORDER BY order_index")
    return result.rows || []
  } catch (error) {
    console.error("[v0] Error fetching services:", error)
    return []
  }
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <AnimatedSection animation="fade-up">
          <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-balance">خدماتنا الطبية</h1>
                <p className="text-lg text-muted-foreground text-balance leading-relaxed">
                  نقدم مجموعة شاملة من الخدمات الطبية المتخصصة بأحدث التقنيات وأعلى معايير الجودة
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Services Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services?.map((service, index) => (
                <AnimatedSection key={service.id} animation="scale-in" delay={index * 0.1}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
                    <CardContent className="pt-6 space-y-4 flex flex-col flex-1">
                      <Link href={`/services/${service.id}`} className="block">
                        {service.image_url ? (
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity">
                            <img
                              src={service.image_url || "/placeholder.svg"}
                              alt={service.title_ar}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-6xl cursor-pointer hover:opacity-90 transition-opacity">
                            {service.icon || "🏥"}
                          </div>
                        )}
                      </Link>

                      <div className="space-y-2 flex-1">
                        <h3 className="text-2xl font-bold">{service.title_ar}</h3>
                        {service.subtitle_ar && (
                          <p className="text-muted-foreground leading-relaxed">{service.subtitle_ar}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 mt-auto">
                        <Link href={`/services/${service.id}`}>
                          <Button variant="outline" className="w-full bg-transparent">
                            التفاصيل
                          </Button>
                        </Link>
                        <BookingDialog trigger={<Button className="w-full">احجز موعد</Button>} />
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            {(!services || services.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">لا توجد خدمات متاحة حالياً</p>
              </div>
            )}
          </div>
        </section>

        <AnimatedSection animation="fade-up">
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">هل تحتاج لاستشارة طبية؟</h2>
                <p className="text-lg text-muted-foreground">احجز موعدك الآن واحصل على استشارة مجانية</p>
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
