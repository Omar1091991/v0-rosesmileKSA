"use client"

import type React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useLanguage } from "@/components/language-switcher"
import { HeroSlideshow } from "@/components/hero-slideshow"
import { AutoScrollCarousel } from "@/components/auto-scroll-carousel"

export default function HomePage() {
  const [services, setServices] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({})
  const [mainBookingFormId, setMainBookingFormId] = useState<string>("")
  const language = useLanguage()

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

        const settings = Array.isArray(settingsData) ? settingsData : settingsData.settings || []
        const settingsMap: Record<string, string> = {}
        settings.forEach((setting: any) => {
          settingsMap[setting.key + "_ar"] = setting.value_ar || ""
          settingsMap[setting.key + "_en"] = setting.value_en || setting.value_ar || ""
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

  const renderFormattedText = (text: string) => {
    // السماح فقط بالوسوم الآمنة: strong, em, s, b, i, del
    const sanitizedText = text.replace(/<(?!\/?(?:strong|em|s|b|i|del)\b)[^>]*>/gi, "")
    return <span dangerouslySetInnerHTML={{ __html: sanitizedText }} />
  }

  const getText = (key: string) => {
    const langKey = `${key}_${language}`
    return siteSettings[langKey] || siteSettings[`${key}_ar`] || ""
  }

  const getHeroImages = (): string[] => {
    try {
      const imagesJson = getText("hero_images")
      if (!imagesJson) return []
      const images = JSON.parse(imagesJson)
      return Array.isArray(images) ? images : []
    } catch {
      // Fallback to single image if parsing fails
      const singleImage = getText("hero_image_url")
      return singleImage ? [singleImage] : []
    }
  }

  const getHeroSlideshowDuration = (): number => {
    const duration = getText("hero_slideshow_duration")
    return duration ? Number.parseFloat(duration) : 5
  }

  const getHeroAnimationType = (): string => {
    return getText("hero_animation_type") || "scale-in"
  }

  // Helper functions to get carousel settings
  const getCarouselItemsPerView = (): number => {
    const value = getText("carousel_items_per_view")
    return value ? Number.parseInt(value) : 3
  }

  const getCarouselScrollDuration = (): number => {
    const value = getText("carousel_scroll_duration")
    return value ? Number.parseInt(value) : 3
  }

  const getCarouselDirection = (): "left" | "right" => {
    const value = getText("carousel_direction")
    return value === "left" ? "left" : "right"
  }

  const getCarouselAutoScroll = (): boolean => {
    const value = getText("carousel_auto_scroll")
    return value !== "false"
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
                  {renderFormattedText(
                    getText("hero_title") ||
                      (language === "ar" ? "ابتسامة الورود ابتسامتك بتعود" : "Rose Smile - Your Smile Returns"),
                  )}
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed"
                  variants={fadeInUp}
                >
                  {renderFormattedText(
                    getText("hero_description") ||
                      (language === "ar"
                        ? "نقدم أفضل الخدمات الطبية بأحدث التقنيات في مكة المكرمة"
                        : "We provide the best medical services with the latest technologies in Makkah"),
                  )}
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                  variants={fadeInUp}
                >
                  <Button size="lg" asChild>
                    <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                      {language === "ar" ? "احجز موعد" : "Book Appointment"}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/services">
                      {language === "ar" ? "تصفح خدماتنا" : "Explore Our Services"}
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <motion.div
                className="relative w-full aspect-square max-w-sm sm:max-w-md mx-auto lg:max-w-full order-1 lg:order-2"
                variants={scaleIn}
              >
                <HeroSlideshow
                  images={getHeroImages()}
                  duration={getHeroSlideshowDuration()}
                  animationType={getHeroAnimationType()}
                />
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
                  title: getText("feature_1_title") || (language === "ar" ? "أطباء متخصصون" : "Specialized Doctors"),
                  description:
                    getText("feature_1_description") ||
                    (language === "ar"
                      ? "فريق طبي متميز من أفضل الأطباء والاستشاريين في مختلف التخصصات"
                      : "Distinguished medical team of the best doctors and consultants in various specialties"),
                  gradient: "from-primary/5 to-secondary/5",
                },
                {
                  title: getText("feature_2_title") || (language === "ar" ? "أحدث التقنيات" : "Latest Technologies"),
                  description:
                    getText("feature_2_description") ||
                    (language === "ar"
                      ? "نستخدم أحدث الأجهزة والتقنيات الطبية لضمان أفضل النتائج"
                      : "We use the latest medical devices and technologies to ensure the best results"),
                  gradient: "from-secondary/5 to-primary/5",
                },
                {
                  title: getText("feature_3_title") || (language === "ar" ? "رعاية شاملة" : "Comprehensive Care"),
                  description:
                    getText("feature_3_description") ||
                    (language === "ar"
                      ? "نقدم رعاية طبية شاملة ومتابعة مستمرة لضمان راحتك وصحتك"
                      : "We provide comprehensive medical care and continuous follow-up to ensure your comfort and health"),
                  gradient: "from-primary/5 to-secondary/5",
                },
              ].map((feature, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className={`border-none shadow-none bg-gradient-to-br ${feature.gradient} h-full`}>
                    <CardContent className="pt-6 space-y-4">
                      <h3 className="text-xl font-semibold text-[#E91E63]">
                        {renderFormattedText(feature.title.replace(/^\d+[\s.:-]*/, ""))}
                      </h3>
                      <p className="text-[#2196F3] leading-relaxed">{renderFormattedText(feature.description)}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold">
                {renderFormattedText(
                  getText("services_title") || (language === "ar" ? "خدماتنا الطبية" : "Our Medical Services"),
                )}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {renderFormattedText(
                  getText("services_description") ||
                    (language === "ar"
                      ? "نقدم مجموعة شاملة من الخدمات الطبية المتخصصة"
                      : "We provide a comprehensive range of specialized medical services"),
                )}
              </p>
            </motion.div>

            <AutoScrollCarousel
              itemsPerView={getCarouselItemsPerView()}
              scrollDuration={getCarouselScrollDuration()}
              direction={getCarouselDirection()}
              autoScroll={getCarouselAutoScroll()}
            >
              {services?.map((service) => (
                <motion.div
                  key={service.id}
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
                              alt={language === "ar" ? service.title_ar : service.title_en || service.title_ar}
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
                      <h3 className="text-xl font-semibold">
                        {language === "ar" ? service.title_ar : service.title_en || service.title_ar}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {language === "ar" ? service.description_ar : service.description_en || service.description_ar}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                          <Link href={`/services/${service.id}`}>{language === "ar" ? "التفاصيل" : "Details"}</Link>
                        </Button>
                        <Button size="sm" asChild className="flex-1">
                          <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                            {language === "ar" ? "حجز موعد" : "Book Appointment"}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AutoScrollCarousel>

            <motion.div
              className="text-center mt-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Button variant="outline" size="lg" asChild>
                <Link href="/services">
                  {language === "ar" ? "عرض جميع الخدمات" : "View All Services"}
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
                  {renderFormattedText(
                    getText("doctors_title") || (language === "ar" ? "أطباؤنا المتميزون" : "Our Distinguished Doctors"),
                  )}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {renderFormattedText(
                    getText("doctors_description") ||
                      (language === "ar"
                        ? "فريق طبي متخصص بخبرات عالمية"
                        : "A team of specialized doctors with international experience"),
                  )}
                </p>
              </motion.div>

              <AutoScrollCarousel
                itemsPerView={getCarouselItemsPerView()}
                scrollDuration={getCarouselScrollDuration()}
                direction={getCarouselDirection()}
                autoScroll={getCarouselAutoScroll()}
              >
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
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
                          <h3 className="text-xl font-semibold">
                            {language === "ar" ? doctor.name_ar : doctor.name_en || doctor.name_ar}
                          </h3>
                          <p className="text-primary font-medium">
                            {language === "ar" ? doctor.specialty_ar : doctor.specialty_en || doctor.specialty_ar}
                          </p>
                        </div>
                        {doctor.bio_ar && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {language === "ar" ? doctor.bio_ar : doctor.bio_en || doctor.bio_ar}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                            <Link href={`/doctors/${doctor.id}`}>{language === "ar" ? "التفاصيل" : "Details"}</Link>
                          </Button>
                          <Button size="sm" asChild className="flex-1">
                            <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                              {language === "ar" ? "حجز موعد" : "Book Appointment"}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AutoScrollCarousel>

              <motion.div
                className="text-center mt-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Button variant="outline" size="lg" asChild>
                  <Link href="/doctors">
                    {language === "ar" ? "تعرف على جميع الأطباء" : "Meet All Our Doctors"}
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
                <h2 className="text-3xl md:text-4xl font-bold">
                  {language === "ar" ? "عروضنا الحصرية" : "Exclusive Offers"}
                </h2>
                <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                  {language === "ar" ? "استفد من عروضنا الخاصة المحدودة" : "Enjoy our limited exclusive offers"}
                </p>
              </motion.div>

              <div className="max-w-6xl mx-auto">
                <AutoScrollCarousel
                  itemsPerView={getCarouselItemsPerView()}
                  scrollDuration={getCarouselScrollDuration()}
                  direction={getCarouselDirection()}
                  autoScroll={getCarouselAutoScroll()}
                >
                  {offers.map((offer) => (
                    <motion.div
                      key={offer.id}
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
                                  alt={language === "ar" ? offer.title_ar : offer.title_en || offer.title_ar}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </Link>
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold">
                              {language === "ar" ? offer.title_ar : offer.title_en || offer.title_ar}
                            </h3>
                            {offer.discount_percentage && (
                              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                                {language === "ar"
                                  ? `خصم ${offer.discount_percentage}%`
                                  : `Discount ${offer.discount_percentage}%`}
                              </div>
                            )}
                          </div>
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {language === "ar" ? offer.description_ar : offer.description_en || offer.description_ar}
                          </p>
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
                              {language === "ar" ? "احجز الآن" : "Book Now"}
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AutoScrollCarousel>
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
                    {language === "ar" ? "عرض جميع العروض" : "View All Offers"}
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
                  {renderFormattedText(
                    getText("articles_title") || (language === "ar" ? "مقالاتنا الطبية" : "Our Medical Articles"),
                  )}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {renderFormattedText(
                    getText("articles_description") ||
                      (language === "ar"
                        ? "اقرأ أحدث المقالات والنصائح الطبية"
                        : "Read the latest medical articles and tips"),
                  )}
                </p>
              </motion.div>

              <AutoScrollCarousel
                itemsPerView={getCarouselItemsPerView()}
                scrollDuration={getCarouselScrollDuration()}
                direction={getCarouselDirection()}
                autoScroll={getCarouselAutoScroll()}
              >
                {articles.map((article) => (
                  <motion.div
                    key={article.id}
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
                                alt={language === "ar" ? article.title_ar : article.title_en || article.title_ar}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </Link>
                        <h3 className="text-xl font-semibold line-clamp-2">
                          {language === "ar" ? article.title_ar : article.title_en || article.title_ar}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">
                          {language === "ar"
                            ? article.content_ar?.substring(0, 150)
                            : article.content_en?.substring(0, 150) || article.content_ar?.substring(0, 150)}
                          ...
                        </p>
                        <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                          <Link href={`/articles/${article.id}`}>
                            {language === "ar" ? "اقرأ المزيد" : "Read More"}
                            <ArrowLeft className="mr-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AutoScrollCarousel>

              <motion.div
                className="text-center mt-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Button variant="outline" size="lg" asChild>
                  <Link href="/articles">
                    {language === "ar" ? "عرض جميع المقالات" : "View All Articles"}
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
                {renderFormattedText(
                  getText("why_choose_us_title") ||
                    (language === "ar" ? "لماذا تختار عيادات ابتسامة الورود؟" : "Why Choose Rose Smile Clinics?"),
                )}
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
                language === "ar" ? "فريق طبي متخصص ومؤهل" : "Specialized and Qualified Medical Team",
                language === "ar" ? "أحدث التقنيات والأجهزة الطبية" : "Latest Medical Technologies and Devices",
                language === "ar" ? "بيئة نظيفة ومعقمة" : "Clean and Modern Environment",
                language === "ar" ? "أسعار تنافسية وعروض مميزة" : "Competitive Prices and Special Offers",
                language === "ar" ? "مواعيد مرنة تناسب الجميع" : "Flexible Appointments for Everyone",
                language === "ar" ? "خدمة عملاء متميزة" : "Distinguished Customer Service",
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
                {renderFormattedText(
                  getText("cta_title") ||
                    (language === "ar"
                      ? "هل أنت مستعد لبدء رحلتك نحو صحة أفضل؟"
                      : "Are You Ready to Start Your Journey Towards Better Health?"),
                )}
              </motion.h2>
              <motion.p className="text-lg text-muted-foreground text-balance" variants={fadeInUp}>
                {renderFormattedText(
                  getText("cta_description") ||
                    (language === "ar"
                      ? "احجز موعدك الآن واحصل على استشارة طبية مجانية"
                      : "Book Your Appointment Now and Get a Free Medical Consultation"),
                )}
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={fadeInUp}>
                <Button size="lg" asChild>
                  <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                    {language === "ar" ? "احجز موعد" : "Book Appointment"}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="tel:+966123456789">
                    <Phone className="ml-2 h-5 w-5" />
                    {language === "ar" ? "اتصل بنا الآن" : "Contact Us Now"}
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
