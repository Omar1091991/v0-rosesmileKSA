import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingDialog } from "@/components/booking-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase.from("services").select("*").eq("is_active", true).order("order_index")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
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

        {/* Services Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services?.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="pt-6 space-y-4">
                    {service.image_url ? (
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={service.image_url || "/placeholder.svg"}
                          alt={service.title_ar}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-6xl">
                        {service.icon || "🏥"}
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{service.title_ar}</h3>
                      <p className="text-muted-foreground leading-relaxed">{service.description_ar}</p>
                    </div>
                    <BookingDialog
                      trigger={
                        <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                          احجز موعد
                        </button>
                      }
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!services || services.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">لا توجد خدمات متاحة حالياً</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">هل تحتاج لاستشارة طبية؟</h2>
              <p className="text-lg text-muted-foreground">احجز موعدك الآن واحصل على استشارة مجانية</p>
              <BookingDialog />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
