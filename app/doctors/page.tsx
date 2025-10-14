import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingDialog } from "@/components/booking-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"

export default async function DoctorsPage() {
  const supabase = await createClient()

  const { data: doctors } = await supabase.from("doctors").select("*").eq("is_active", true).order("order_index")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">أطباؤنا المتميزون</h1>
              <p className="text-lg text-muted-foreground text-balance leading-relaxed">
                فريق طبي متخصص من أفضل الأطباء والاستشاريين بخبرات عالمية
              </p>
            </div>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors?.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="pt-6 space-y-4">
                    {doctor.image_url ? (
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={doctor.image_url || "/placeholder.svg"}
                          alt={doctor.name_ar}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center text-6xl">
                        👨‍⚕️
                      </div>
                    )}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-2xl font-bold">{doctor.name_ar}</h3>
                        <p className="text-primary font-medium text-lg">{doctor.specialty_ar}</p>
                      </div>
                      {doctor.bio_ar && (
                        <p className="text-muted-foreground leading-relaxed text-sm">{doctor.bio_ar}</p>
                      )}
                      {doctor.qualifications_ar && doctor.qualifications_ar.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">المؤهلات:</p>
                          <div className="flex flex-wrap gap-2">
                            {doctor.qualifications_ar.map((qual, index) => (
                              <Badge key={index} variant="secondary">
                                {qual}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <BookingDialog
                      trigger={
                        <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                          احجز مع {doctor.name_ar.split(" ")[0]}
                        </button>
                      }
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!doctors || doctors.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">لا يوجد أطباء متاحون حالياً</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">احجز موعدك مع أفضل الأطباء</h2>
              <p className="text-lg text-muted-foreground">نحن هنا لخدمتك على مدار الساعة</p>
              <BookingDialog />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
