import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingDialog } from "@/components/booking-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Phone } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("order_index")
    .limit(6)

  // Fetch doctors
  const { data: doctors } = await supabase
    .from("doctors")
    .select("*")
    .eq("is_active", true)
    .order("order_index")
    .limit(3)

  // Fetch offers
  const { data: offers } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(2)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">ابتسامتك هي عنوان صحتك</h1>
              <p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed">
                نقدم أفضل الخدمات الطبية بأحدث التقنيات في مكة المكرمة
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <BookingDialog />
                <Button variant="outline" size="lg" asChild>
                  <Link href="/services">
                    تصفح خدماتنا
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-none bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="pt-6 space-y-4">
                  <div className="text-5xl font-bold text-primary">01</div>
                  <h3 className="text-xl font-semibold">أطباء متخصصون</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    فريق طبي متميز من أفضل الأطباء والاستشاريين في مختلف التخصصات
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-gradient-to-br from-secondary/5 to-primary/5">
                <CardContent className="pt-6 space-y-4">
                  <div className="text-5xl font-bold text-secondary">02</div>
                  <h3 className="text-xl font-semibold">أحدث التقنيات</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    نستخدم أحدث الأجهزة والتقنيات الطبية لضمان أفضل النتائج
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="pt-6 space-y-4">
                  <div className="text-5xl font-bold text-primary">03</div>
                  <h3 className="text-xl font-semibold">رعاية شاملة</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    نقدم رعاية طبية شاملة ومتابعة مستمرة لضمان راحتك وصحتك
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/10 to-primary/5">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">خدماتنا الطبية</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                نقدم مجموعة شاملة من الخدمات الطبية المتخصصة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-4xl">{service.icon || "🏥"}</div>
                    <h3 className="text-xl font-semibold">{service.title_ar}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description_ar}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link href="/services">
                  عرض جميع الخدمات
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        {doctors && doctors.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">أطباؤنا المتميزون</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">فريق طبي متخصص بخبرات عالمية</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="text-center">
                    <CardContent className="pt-6 space-y-4">
                      <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center text-4xl">
                        {doctor.image_url ? (
                          <img
                            src={doctor.image_url || "/placeholder.svg"}
                            alt={doctor.name_ar}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          "👨‍⚕️"
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{doctor.name_ar}</h3>
                        <p className="text-primary font-medium">{doctor.specialty_ar}</p>
                      </div>
                      {doctor.bio_ar && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio_ar}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/doctors">
                    تعرف على جميع الأطباء
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {offers && offers.length > 0 && (
          <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
            <div className="container">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">عروضنا الحصرية</h2>
                <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">استفد من عروضنا الخاصة المحدودة</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {offers.map((offer) => (
                  <Card key={offer.id} className="bg-background text-foreground">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">{offer.title_ar}</h3>
                        {offer.discount_percentage && (
                          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                            خصم {offer.discount_percentage}%
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{offer.description_ar}</p>
                      {offer.price_before && offer.price_after && (
                        <div className="flex items-center gap-4">
                          <span className="text-3xl font-bold text-primary">{offer.price_after} ريال</span>
                          <span className="text-lg text-muted-foreground line-through">{offer.price_before} ريال</span>
                        </div>
                      )}
                      <BookingDialog trigger={<Button className="w-full">احجز الآن</Button>} />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/offers">
                    عرض جميع العروض
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">لماذا تختار عيادات ابتسامة الورود؟</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                "فريق طبي متخصص ومؤهل",
                "أحدث التقنيات والأجهزة الطبية",
                "بيئة نظيفة ومعقمة",
                "أسعار تنافسية وعروض مميزة",
                "مواعيد مرنة تناسب الجميع",
                "خدمة عملاء متميزة",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">هل أنت مستعد لبدء رحلتك نحو صحة أفضل؟</h2>
              <p className="text-lg text-muted-foreground text-balance">
                احجز موعدك الآن واحصل على استشارة طبية مجانية
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <BookingDialog />
                <Button variant="outline" size="lg" asChild>
                  <Link href="tel:+966123456789">
                    <Phone className="ml-2 h-5 w-5" />
                    اتصل بنا الآن
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
