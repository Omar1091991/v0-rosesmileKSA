"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingDialog } from "@/components/booking-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [services, setServices] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [heroContent, setHeroContent] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, doctorsRes, offersRes, contentRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/doctors"),
          fetch("/api/offers"),
          fetch("/api/site-content"),
        ])

        const servicesData = await servicesRes.json()
        const doctorsData = await doctorsRes.json()
        const offersData = await offersRes.json()
        const contentData = await contentRes.json()

        setServices(servicesData.filter((s: any) => s.is_active).slice(0, 6))
        setDoctors(doctorsData.filter((d: any) => d.is_active).slice(0, 3))
        setOffers(offersData.filter((o: any) => o.is_active).slice(0, 2))

        const hero = contentData.find((c: any) => c.section === "hero")
        setHeroContent(hero)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  }

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-20 md:py-32 overflow-hidden">
          <div className="container">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <div className="space-y-8 text-center lg:text-right">
                <motion.h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight" variants={fadeInUp}>
                  {heroContent?.title_ar || "ابتسامة الورود ابتسامتك بتعود"}
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed"
                  variants={fadeInUp}
                >
                  {heroContent?.description_ar || "نقدم أفضل الخدمات الطبية بأحدث التقنيات في مكة المكرمة"}
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                  variants={fadeInUp}
                >
                  <BookingDialog />
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/services">
                      تصفح خدماتنا
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <motion.div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-full" variants={scaleIn}>
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={heroContent?.image_url || "/placeholder.svg?height=600&width=600"}
                    alt="ابتسامة الورود"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                {
                  number: "01",
                  title: "أطباء متخصصون",
                  description: "فريق طبي متميز من أفضل الأطباء والاستشاريين في مختلف التخصصات",
                  gradient: "from-primary/5 to-secondary/5",
                  color: "text-primary",
                },
                {
                  number: "02",
                  title: "أحدث التقنيات",
                  description: "نستخدم أحدث الأجهزة والتقنيات الطبية لضمان أفضل النتائج",
                  gradient: "from-secondary/5 to-primary/5",
                  color: "text-secondary",
                },
                {
                  number: "03",
                  title: "رعاية شاملة",
                  description: "نقدم رعاية طبية شاملة ومتابعة مستمرة لضمان راحتك وصحتك",
                  gradient: "from-primary/5 to-secondary/5",
                  color: "text-primary",
                },
              ].map((feature, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className={`border-none shadow-none bg-gradient-to-br ${feature.gradient} h-full`}>
                    <CardContent className="pt-6 space-y-4">
                      <div className={`text-5xl font-bold ${feature.color}`}>{feature.number}</div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/10 to-primary/5">
          <div className="container">
            <motion.div
              className="text-center space-y-4 mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold">خدماتنا الطبية</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                نقدم مجموعة شاملة من الخدمات الطبية المتخصصة
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {services?.map((service) => (
                <motion.div
                  key={service.id}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="pt-6 space-y-4">
                      {service.image_url ? (
                        <div className="w-full aspect-square relative rounded-lg overflow-hidden">
                          <Image
                            src={service.image_url || "/placeholder.svg"}
                            alt={service.title_ar}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="text-4xl">{service.icon || "🏥"}</div>
                      )}
                      <h3 className="text-xl font-semibold">{service.title_ar}</h3>
                      <p className="text-muted-foreground leading-relaxed">{service.description_ar}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Button variant="outline" size="lg" asChild>
                <Link href="/services">
                  عرض جميع الخدمات
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Doctors Section */}
        {doctors && doctors.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container">
              <motion.div
                className="text-center space-y-4 mb-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-3xl md:text-4xl font-bold">أطباؤنا المتميزون</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">فريق طبي متخصص بخبرات عالمية</p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {doctors.map((doctor) => (
                  <motion.div key={doctor.id} variants={scaleIn} whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                    <Card className="text-center h-full">
                      <CardContent className="pt-6 space-y-4">
                        <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center text-4xl overflow-hidden">
                          {doctor.image_url ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={doctor.image_url || "/placeholder.svg"}
                                alt={doctor.name_ar}
                                fill
                                className="object-cover"
                              />
                            </div>
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
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="text-center mt-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Button variant="outline" size="lg" asChild>
                  <Link href="/doctors">
                    تعرف على جميع الأطباء
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Offers Section */}
        {offers && offers.length > 0 && (
          <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
            <div className="container">
              <motion.div
                className="text-center space-y-4 mb-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-3xl md:text-4xl font-bold">عروضنا الحصرية</h2>
                <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">استفد من عروضنا الخاصة المحدودة</p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {offers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    variants={scaleIn}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-background text-foreground h-full">
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
                            <span className="text-lg text-muted-foreground line-through">
                              {offer.price_before} ريال
                            </span>
                          </div>
                        )}
                        <BookingDialog trigger={<Button className="w-full">احجز الآن</Button>} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="text-center mt-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/offers">
                    عرض جميع العروض
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <motion.div
              className="text-center space-y-4 mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold">لماذا تختار عيادات ابتسامة الورود؟</h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {[
                "فريق طبي متخصص ومؤهل",
                "أحدث التقنيات والأجهزة الطبية",
                "بيئة نظيفة ومعقمة",
                "أسعار تنافسية وعروض مميزة",
                "مواعيد مرنة تناسب الجميع",
                "خدمة عملاء متميزة",
              ].map((item, index) => (
                <motion.div key={index} className="flex items-center gap-3" variants={fadeInUp}>
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5">
          <div className="container">
            <motion.div
              className="max-w-3xl mx-auto text-center space-y-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 className="text-3xl md:text-4xl font-bold text-balance" variants={fadeInUp}>
                هل أنت مستعد لبدء رحلتك نحو صحة أفضل؟
              </motion.h2>
              <motion.p className="text-lg text-muted-foreground text-balance" variants={fadeInUp}>
                احجز موعدك الآن واحصل على استشارة طبية مجانية
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={fadeInUp}>
                <BookingDialog />
                <Button variant="outline" size="lg" asChild>
                  <Link href="tel:+966123456789">
                    <Phone className="ml-2 h-5 w-5" />
                    اتصل بنا الآن
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
