"use client"

import type React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Phone, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function HomePage() {
  const [services, setServices] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({})
  const [mainBookingFormId, setMainBookingFormId] = useState<string>("")

  const servicesScrollRef = useRef<HTMLDivElement>(null)
  const doctorsScrollRef = useRef<HTMLDivElement>(null)
  const offersScrollRef = useRef<HTMLDivElement>(null)
  const articlesScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, doctorsRes, offersRes, articlesRes, settingsRes, formsRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/doctors"),
          fetch("/api/offers"),
          fetch("/api/articles"),
          fetch("/api/site-settings"),
          fetch("/api/booking-forms"),
        ])

        const servicesData = await servicesRes.json()
        const doctorsData = await doctorsRes.json()
        const offersData = await offersRes.json()
        const articlesData = await articlesRes.json()
        const settingsData = await settingsRes.json()
        const formsData = await formsRes.json()

        setServices(servicesData.filter((s: any) => s.is_active))
        setDoctors(doctorsData.filter((d: any) => d.is_active))
        setOffers(offersData.filter((o: any) => o.is_active))
        setArticles(articlesData.filter((a: any) => a.is_published))

        const mainForm = formsData.find((f: any) => f.is_main)
        if (mainForm) {
          setMainBookingFormId(mainForm.id)
        }

        const settingsMap: Record<string, string> = {}
        settingsData.forEach((setting: any) => {
          settingsMap[setting.key] = setting.value_ar || ""
        })
        setSiteSettings(settingsMap)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 400
      ref.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      })
    }
  }

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
        <section className="relative bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-12 sm:py-16 md:py-20 lg:py-32 overflow-hidden">
          <div className="container px-4 sm:px-6">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <div className="space-y-6 sm:space-y-8 text-center lg:text-right order-2 lg:order-1">
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight"
                  variants={fadeInUp}
                >
                  {siteSettings.hero_title_ar || "ابتسامة الورود ابتسامتك بتعود"}
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed"
                  variants={fadeInUp}
                >
                  {siteSettings.hero_description_ar || "نقدم أفضل الخدمات الطبية بأحدث التقنيات في مكة المكرمة"}
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                  variants={fadeInUp}
                >
                  <Button size="lg" asChild>
                    <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>احجز موعد</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/services">
                      تصفح خدماتنا
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <motion.div
                className="relative w-full aspect-square max-w-sm sm:max-w-md mx-auto lg:max-w-full order-1 lg:order-2"
                variants={scaleIn}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={siteSettings.hero_image_url || "/placeholder.svg?height=600&width=600"}
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
                  title: siteSettings.feature_1_title_ar || "أطباء متخصصون",
                  description:
                    siteSettings.feature_1_description_ar ||
                    "فريق طبي متميز من أفضل الأطباء والاستشاريين في مختلف التخصصات",
                  gradient: "from-primary/5 to-secondary/5",
                },
                {
                  title: siteSettings.feature_2_title_ar || "أحدث التقنيات",
                  description:
                    siteSettings.feature_2_description_ar || "نستخدم أحدث الأجهزة والتقنيات الطبية لضمان أفضل النتائج",
                  gradient: "from-secondary/5 to-primary/5",
                },
                {
                  title: siteSettings.feature_3_title_ar || "رعاية شاملة",
                  description:
                    siteSettings.feature_3_description_ar || "نقدم رعاية طبية شاملة ومتابعة مستمرة لضمان راحتك وصحتك",
                  gradient: "from-primary/5 to-secondary/5",
                },
              ].map((feature, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className={`border-none shadow-none bg-gradient-to-br ${feature.gradient} h-full`}>
                    <CardContent className="pt-6 space-y-4">
                      <h3 className="text-xl font-semibold text-[#E91E63]">{feature.title}</h3>
                      <p className="text-[#2196F3] leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-secondary/10 to-primary/5">
          <div className="container px-4 sm:px-6">
            <motion.div
              className="text-center space-y-4 mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold">{siteSettings.services_title_ar || "خدماتنا الطبية"}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {siteSettings.services_description_ar || "نقدم مجموعة شاملة من الخدمات الطبية المتخصصة"}
              </p>
            </motion.div>

            <div className="relative">
              <button
                onClick={() => scroll(servicesScrollRef, "left")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg"
                aria-label="السابق"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div
                ref={servicesScrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {services?.map((service) => (
                  <motion.div
                    key={service.id}
                    className="flex-shrink-0 w-80"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardContent className="pt-6 space-y-4">
                        <Link href={`/services/${service.id}`} className="block">
                          {service.image_url ? (
                            <div className="w-full aspect-square relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                              <Image
                                src={service.image_url || "/placeholder.svg"}
                                alt={service.title_ar}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-muted flex items-center justify-center text-6xl cursor-pointer hover:opacity-90 transition-opacity">
                              {service.icon || "🏥"}
                            </div>
                          )}
                        </Link>
                        <h3 className="text-xl font-semibold">{service.title_ar}</h3>
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">{service.description_ar}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                            <Link href={`/services/${service.id}`}>التفاصيل</Link>
                          </Button>
                          <Button size="sm" asChild className="flex-1">
                            <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                              حجز موعد
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => scroll(servicesScrollRef, "right")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg"
                aria-label="التالي"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>

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
                <h2 className="text-3xl md:text-4xl font-bold">
                  {siteSettings.doctors_title_ar || "أطباؤنا المتميزون"}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {siteSettings.doctors_description_ar || "فريق طبي متخصص بخبرات عالمية"}
                </p>
              </motion.div>

              <div className="relative">
                <button
                  onClick={() => scroll(doctorsScrollRef, "left")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg"
                  aria-label="السابق"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                <div
                  ref={doctorsScrollRef}
                  className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {doctors.map((doctor) => (
                    <motion.div
                      key={doctor.id}
                      className="flex-shrink-0 w-80"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <Card className="text-center h-full">
                        <CardContent className="pt-6 space-y-4">
                          <Link href={`/doctors/${doctor.id}`} className="block">
                            <div className="w-full aspect-square mx-auto bg-muted flex items-center justify-center text-4xl overflow-hidden rounded-lg md:rounded-full cursor-pointer hover:opacity-90 transition-opacity">
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
                          </Link>
                          <div>
                            <h3 className="text-xl font-semibold">{doctor.name_ar}</h3>
                            <p className="text-primary font-medium">{doctor.specialty_ar}</p>
                          </div>
                          {doctor.bio_ar && (
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {doctor.bio_ar}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                              <Link href={`/doctors/${doctor.id}`}>التفاصيل</Link>
                            </Button>
                            <Button size="sm" asChild className="flex-1">
                              <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                                حجز موعد
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => scroll(doctorsScrollRef, "right")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg"
                  aria-label="التالي"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>

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

              <div className="relative max-w-4xl mx-auto">
                <button
                  onClick={() => scroll(offersScrollRef, "left")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg"
                  aria-label="السابق"
                >
                  <ChevronRight className="h-6 w-6 text-foreground" />
                </button>

                <div
                  ref={offersScrollRef}
                  className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {offers.map((offer) => (
                    <motion.div
                      key={offer.id}
                      className="flex-shrink-0 w-96"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="bg-background text-foreground h-full">
                        <CardContent className="pt-6 space-y-4">
                          <Link href={`/offers/${offer.id}`} className="block">
                            {offer.image_url && (
                              <div className="w-full aspect-video relative rounded-lg overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition-opacity">
                                <Image
                                  src={offer.image_url || "/placeholder.svg"}
                                  alt={offer.title_ar}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </Link>
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold">{offer.title_ar}</h3>
                            {offer.discount_percentage && (
                              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                                خصم {offer.discount_percentage}%
                              </div>
                            )}
                          </div>
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">{offer.description_ar}</p>
                          {offer.price_before && offer.price_after && (
                            <div className="flex items-center gap-4">
                              <span className="text-3xl font-bold text-primary">{offer.price_after} ريال</span>
                              <span className="text-lg text-muted-foreground line-through">
                                {offer.price_before} ريال
                              </span>
                            </div>
                          )}
                          <Button className="w-full" asChild>
                            <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                              احجز الآن
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => scroll(offersScrollRef, "right")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg"
                  aria-label="التالي"
                >
                  <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
              </div>

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

        {/* Articles Section */}
        {articles && articles.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container">
              <motion.div
                className="text-center space-y-4 mb-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-3xl md:text-4xl font-bold">
                  {siteSettings.articles_title_ar || "مقالاتنا الطبية"}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {siteSettings.articles_description_ar || "اقرأ أحدث المقالات والنصائح الطبية"}
                </p>
              </motion.div>

              <div className="relative">
                <button
                  onClick={() => scroll(articlesScrollRef, "left")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg"
                  aria-label="السابق"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                <div
                  ref={articlesScrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {articles.map((article) => (
                    <motion.div
                      key={article.id}
                      className="flex-shrink-0 w-80"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <Card className="hover:shadow-lg transition-shadow h-full">
                        <CardContent className="pt-6 space-y-4">
                          <Link href={`/articles/${article.id}`} className="block">
                            {article.image_url && (
                              <div className="w-full aspect-video relative rounded-lg overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition-opacity">
                                <Image
                                  src={article.image_url || "/placeholder.svg"}
                                  alt={article.title_ar}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </Link>
                          <h3 className="text-xl font-semibold line-clamp-2">{article.title_ar}</h3>
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {article.content_ar?.substring(0, 150)}...
                          </p>
                          <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                            <Link href={`/articles/${article.id}`}>
                              اقرأ المزيد
                              <ArrowLeft className="mr-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => scroll(articlesScrollRef, "right")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg"
                  aria-label="التالي"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>

              <motion.div
                className="text-center mt-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Button variant="outline" size="lg" asChild>
                  <Link href="/articles">
                    عرض جميع المقالات
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
              <h2 className="text-3xl md:text-4xl font-bold">
                {siteSettings.why_choose_us_title_ar || "لماذا تختار عيادات ابتسامة الورود؟"}
              </h2>
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
                {siteSettings.cta_title_ar || "هل أنت مستعد لبدء رحلتك نحو صحة أفضل؟"}
              </motion.h2>
              <motion.p className="text-lg text-muted-foreground text-balance" variants={fadeInUp}>
                {siteSettings.cta_description_ar || "احجز موعدك الآن واحصل على استشارة طبية مجانية"}
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={fadeInUp}>
                <Button size="lg" asChild>
                  <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>احجز موعد</Link>
                </Button>
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
      <WhatsAppButton />
    </div>
  )
}
