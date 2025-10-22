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
import { AnimatedBackground } from "@/components/animated-background"
import { SocialMediaLinks } from "@/components/social-media-links"
import { useRouter } from "next/navigation" // Import useRouter

export default function HomePage() {
  const [services, setServices] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({})
  const [mainBookingFormId, setMainBookingFormId] = useState<string>("")
  const language = useLanguage()
  const router = useRouter() // Initialize useRouter

  const servicesScrollRef = useRef<HTMLDivElement>(null)
  const doctorsScrollRef = useRef<HTMLDivElement>(null)
  const offersScrollRef = useRef<HTMLDivElement>(null)
  const articlesScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, doctorsRes, offersRes, articlesRes, settingsRes, formsRes] = await Promise.all([
          fetch("/api/services", { next: { revalidate: 60 } }),
          fetch("/api/doctors", { next: { revalidate: 60 } }),
          fetch("/api/offers", { next: { revalidate: 60 } }),
          fetch("/api/articles", { next: { revalidate: 60 } }),
          fetch("/api/site-settings", { next: { revalidate: 60 } }),
          fetch("/api/booking-forms", { next: { revalidate: 60 } }),
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
          // إذا كان الـ key يحتوي بالفعل على _ar أو _en، استخدمه كما هو
          if (setting.key.endsWith("_ar") || setting.key.endsWith("_en")) {
            settingsMap[setting.key] = setting.value_ar || ""
          } else {
            // إذا لم يكن يحتوي على اللاحقة، أضفها
            settingsMap[setting.key + "_ar"] = setting.value_ar || ""
            settingsMap[setting.key + "_en"] = setting.value_en || setting.value_ar || ""
          }
        })
        setSiteSettings(settingsMap)

        console.log("[v0] Settings loaded:", Object.keys(settingsMap).length, "keys")
        console.log("[v0] Hero title:", settingsMap["hero_title_ar"])
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
    // السماح فقط بالوسوم الآمنة: strong, em, b, i, s, del
    const sanitizedText = text.replace(/<(?!\/?(?:strong|em|b|i|s|del)\b)[^>]*>/gi, "")
    return <span dangerouslySetInnerHTML={{ __html: sanitizedText }} style={{ whiteSpace: "pre-wrap" }} />
  }

  const getText = (key: string) => {
    const langKey = `${key}_${language}`
    const value = siteSettings[langKey] || siteSettings[`${key}_ar`] || ""
    return value
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

  // Helper functions to get carousel settings for each section
  const getServicesCarouselSettings = () => ({
    itemsPerView: Number.parseInt(getText("services_carousel_items_per_view") || "3"),
    scrollDuration: Number.parseInt(getText("services_carousel_scroll_duration") || "3"),
    direction: (getText("services_carousel_direction") || "left") as "left" | "right",
    autoScroll: getText("services_carousel_auto_scroll") !== "false",
  })

  const getDoctorsCarouselSettings = () => ({
    itemsPerView: Number.parseInt(getText("doctors_carousel_items_per_view") || "3"),
    scrollDuration: Number.parseInt(getText("doctors_carousel_scroll_duration") || "3"),
    direction: (getText("doctors_carousel_direction") || "left") as "left" | "right",
    autoScroll: getText("doctors_carousel_auto_scroll") !== "false",
  })

  const getArticlesCarouselSettings = () => ({
    itemsPerView: Number.parseInt(getText("articles_carousel_items_per_view") || "3"),
    scrollDuration: Number.parseInt(getText("articles_carousel_scroll_duration") || "3"),
    direction: (getText("articles_carousel_direction") || "left") as "left" | "right",
    autoScroll: getText("articles_carousel_auto_scroll") !== "false",
  })

  const getOffersCarouselSettings = () => ({
    itemsPerView: Number.parseInt(getText("offers_carousel_items_per_view") || "3"),
    scrollDuration: Number.parseInt(getText("offers_carousel_scroll_duration") || "3"),
    direction: (getText("offers_carousel_direction") || "left") as "left" | "right",
    autoScroll: getText("offers_carousel_auto_scroll") !== "false",
  })

  return (
    <div className="flex min-h-screen flex-col">
      <AnimatedBackground />

      <SiteHeader user={user} />

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section
          className="relative bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden"
          style={{
            backgroundColor: getText("hero_background_color") || undefined,
            backgroundImage: getText("hero_background_color")
              ? "none"
              : "linear-gradient(to bottom right, hsl(var(--secondary) / 0.1), hsl(var(--background)), hsl(var(--primary) / 0.05))",
          }}
        >
          <div className="container px-2 sm:px-4 md:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-right order-2 lg:order-1 px-2 sm:px-0">
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-balance leading-tight"
                  variants={fadeInUp}
                >
                  {renderFormattedText(
                    getText("hero_title") ||
                      (language === "ar" ? "ابتسامة الورود ابتسامتك بتعود" : "Rose Smile - Your Smile Returns"),
                  )}
                </motion.h1>
                <motion.p
                  className="text-base sm:text-lg md:text-xl text-muted-foreground text-balance leading-relaxed"
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
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4"
                  variants={fadeInUp}
                >
                  <Button size="lg" className="w-full sm:w-auto" asChild>
                    <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                      {language === "ar" ? "احجز موعد" : "Book Appointment"}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent" asChild>
                    <Link href="/services">
                      {language === "ar" ? "تصفح خدماتنا" : "Explore Our Services"}
                      <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <motion.div
                className="relative w-full aspect-square max-w-full sm:max-w-md md:max-w-lg mx-auto lg:max-w-full order-1 lg:order-2"
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
        <section
          className="py-12 sm:py-16 md:py-20 lg:py-24"
          style={{
            backgroundColor: getText("features_background_color") || undefined,
          }}
        >
          <div className="container px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
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
                    <CardContent className="pt-6 space-y-3 sm:space-y-4">
                      <h3
                        className="text-lg sm:text-xl font-semibold"
                        style={{ color: getText("features_title_color") || undefined }}
                      >
                        {renderFormattedText(feature.title.replace(/^\d+[\s.:-]*/, ""))}
                      </h3>
                      <p
                        className="text-sm sm:text-base leading-relaxed"
                        style={{ color: getText("features_text_color") || undefined }}
                      >
                        {renderFormattedText(feature.description)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section
          className="py-12 sm:py-16 md:py-20 lg:py-24"
          style={{
            backgroundColor: getText("services_background_color") || undefined,
            backgroundImage: getText("services_background_color")
              ? "none"
              : "linear-gradient(to bottom right, hsl(var(--secondary) / 0.1), hsl(var(--primary) / 0.05))",
          }}
        >
          <div className="container px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Link href="/services" className="inline-block hover:opacity-80 transition-opacity">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold cursor-pointer"
                  style={{ color: getText("services_title_color") || undefined }}
                >
                  {renderFormattedText(
                    getText("services_title") || (language === "ar" ? "خدماتنا الطبية" : "Our Medical Services"),
                  )}
                </h2>
              </Link>
              <p
                className="text-base sm:text-lg max-w-2xl mx-auto px-4"
                style={{ color: getText("services_text_color") || undefined }}
              >
                {renderFormattedText(
                  getText("services_description") ||
                    (language === "ar"
                      ? "نقدم مجموعة شاملة من الخدمات الطبية المتخصصة"
                      : "We provide a comprehensive range of specialized medical services"),
                )}
              </p>
            </motion.div>

            <div className="relative">
              {/* زر التمرير لليسار */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                onClick={() => scroll(servicesScrollRef, "left")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              {/* زر التمرير لليمين */}
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                onClick={() => scroll(servicesScrollRef, "right")}
              >
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>

              <div ref={servicesScrollRef} className="overflow-x-auto pb-4 scroll-smooth">
                <AutoScrollCarousel
                  itemsPerView={getServicesCarouselSettings().itemsPerView}
                  scrollDuration={getServicesCarouselSettings().scrollDuration}
                  direction={getServicesCarouselSettings().direction}
                  autoScroll={getServicesCarouselSettings().autoScroll}
                >
                  {services?.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <Card
                        className="hover:shadow-lg transition-all hover:scale-105 h-full flex flex-col cursor-pointer"
                        onClick={() => (window.location.href = `/services/${service.id}`)}
                      >
                        <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 flex flex-col flex-1 p-4 sm:p-6">
                          {service.image_url ? (
                            <div className="w-full aspect-square relative rounded-lg overflow-hidden">
                              <Image
                                src={service.image_url || "/placeholder.svg"}
                                alt={language === "ar" ? service.title_ar : service.title_en || service.title_ar}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-muted flex items-center justify-center text-4xl sm:text-6xl">
                              {service.icon || "🏥"}
                            </div>
                          )}
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-center line-clamp-2">
                            {language === "ar" ? service.title_ar : service.title_en || service.title_ar}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed line-clamp-2 text-center text-xs sm:text-sm flex-1">
                            {renderFormattedText(
                              language === "ar"
                                ? service.description_ar
                                : service.description_en || service.description_ar,
                            )}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent text-xs sm:text-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = `/services/${service.id}`
                              }}
                            >
                              {language === "ar" ? "التفاصيل" : "Details"}
                            </Button>
                            <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                className="w-full text-xs sm:text-sm relative overflow-hidden group"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  window.location.href = mainBookingFormId
                                    ? `/booking/${mainBookingFormId}`
                                    : "/booking"
                                }}
                              >
                                <motion.span
                                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                                  animate={{
                                    x: ["-100%", "100%"],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                  }}
                                />
                                <span className="relative z-10">
                                  {language === "ar" ? "احجز موعد" : "Book Appointment"}
                                </span>
                              </Button>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AutoScrollCarousel>
              </div>
            </div>

            <motion.div
              className="text-center mt-8 sm:mt-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent" asChild>
                <Link href="/services">
                  {language === "ar" ? "عرض جميع الخدمات" : "View All Services"}
                  <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Doctors Section */}
        {doctors && doctors.length > 0 && (
          <section
            className="py-12 sm:py-16 md:py-20 lg:py-24"
            style={{
              backgroundColor: getText("doctors_background_color") || undefined,
            }}
          >
            <div className="container px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Link href="/doctors" className="inline-block hover:opacity-80 transition-opacity">
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-bold cursor-pointer"
                    style={{ color: getText("doctors_title_color") || undefined }}
                  >
                    {renderFormattedText(
                      getText("doctors_title") ||
                        (language === "ar" ? "أطباؤنا المتميزون" : "Our Distinguished Doctors"),
                    )}
                  </h2>
                </Link>
                <p
                  className="text-base sm:text-lg max-w-2xl mx-auto px-4"
                  style={{ color: getText("doctors_text_color") || undefined }}
                >
                  {renderFormattedText(
                    getText("doctors_description") ||
                      (language === "ar"
                        ? "فريق طبي متخصص بخبرات عالمية"
                        : "A team of specialized doctors with international experience"),
                  )}
                </p>
              </motion.div>

              <AutoScrollCarousel
                itemsPerView={getDoctorsCarouselSettings().itemsPerView}
                scrollDuration={getDoctorsCarouselSettings().scrollDuration}
                direction={getDoctorsCarouselSettings().direction}
                autoScroll={getDoctorsCarouselSettings().autoScroll}
              >
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      className="text-center h-full hover:shadow-lg transition-all hover:scale-105 flex flex-col cursor-pointer"
                      onClick={() => {
                        router.push(`/doctors/${doctor.id}`)
                      }}
                    >
                      <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 flex flex-col flex-1 p-4 sm:p-6">
                        <div className="w-full aspect-square relative bg-muted flex items-center justify-center text-4xl sm:text-6xl overflow-hidden rounded-lg mx-auto max-w-xs">
                          {doctor.image_url ? (
                            <Image
                              src={doctor.image_url || "/placeholder.svg"}
                              alt={doctor.name_ar}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            "👨‍⚕️"
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold line-clamp-2">
                            {language === "ar" ? doctor.name_ar : doctor.name_en || doctor.name_ar}
                          </h3>
                          <p className="text-primary font-medium mt-2 text-sm sm:text-base line-clamp-2">
                            {language === "ar" ? doctor.specialty_ar : doctor.specialty_en || doctor.specialty_ar}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent text-xs sm:text-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/doctors/${doctor.id}`)
                            }}
                          >
                            {language === "ar" ? "التفاصيل" : "Details"}
                          </Button>
                          <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              className="w-full text-xs sm:text-sm relative overflow-hidden group"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.location.href = mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"
                              }}
                            >
                              <motion.span
                                className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                                animate={{
                                  x: ["-100%", "100%"],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                              />
                              <span className="relative z-10">
                                {language === "ar" ? "احجز موعد" : "Book Appointment"}
                              </span>
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AutoScrollCarousel>

              <motion.div
                className="text-center mt-8 sm:mt-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent" asChild>
                  <Link href="/doctors">
                    {language === "ar" ? "تعرف على جميع الأطباء" : "Meet All Our Doctors"}
                    <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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
                className="max-w-6xl mx-auto"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {offers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-background text-foreground h-full flex flex-col">
                      <CardContent className="pt-6 space-y-4 flex flex-col flex-1">
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
                <Link href="/articles" className="inline-block hover:opacity-80 transition-opacity">
                  <h2 className="text-3xl md:text-4xl font-bold cursor-pointer">
                    {renderFormattedText(
                      getText("articles_title") || (language === "ar" ? "مقالاتنا الطبية" : "Our Medical Articles"),
                    )}
                  </h2>
                </Link>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  {renderFormattedText(
                    getText("articles_description") ||
                      (language === "ar"
                        ? "اقرأ أحدث المقالات والنصائح الطبية"
                        : "Read the latest medical articles and tips"),
                  )}
                </p>
              </motion.div>

              <AutoScrollCarousel
                itemsPerView={getArticlesCarouselSettings().itemsPerView}
                scrollDuration={getArticlesCarouselSettings().scrollDuration}
                direction={getArticlesCarouselSettings().direction}
                autoScroll={getArticlesCarouselSettings().autoScroll}
              >
                {articles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      className="hover:shadow-lg transition-all hover:scale-105 h-full flex flex-col cursor-pointer"
                      onClick={() => (window.location.href = `/articles/${article.id}`)}
                    >
                      <CardContent className="pt-6 space-y-4 flex flex-col flex-1">
                        {article.image_url && (
                          <div className="w-full aspect-video relative rounded-lg overflow-hidden">
                            <Image
                              src={article.image_url || "/placeholder.svg"}
                              alt={language === "ar" ? article.title_ar : article.title_en || article.title_ar}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h3 className="text-xl font-semibold line-clamp-2">
                          {language === "ar" ? article.title_ar : article.title_en || article.title_ar}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm">
                          {renderFormattedText(
                            (language === "ar"
                              ? article.content_ar?.substring(0, 120)
                              : article.content_en?.substring(0, 120) || article.content_ar?.substring(0, 120)) + "...",
                          )}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = `/articles/${article.id}`
                          }}
                        >
                          {language === "ar" ? "اقرأ المزيد" : "Read More"}
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

        {/* Social Media Section - Above Why Choose Us */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center space-y-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {language === "ar" ? "تابعنا على وسائل التواصل الاجتماعي" : "Follow Us on Social Media"}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === "ar"
                  ? "ابقَ على اطلاع بآخر الأخبار والعروض والنصائح الطبية"
                  : "Stay updated with the latest news, offers, and medical tips"}
              </p>
              <div className="flex justify-center">
                <SocialMediaLinks />
              </div>
            </motion.div>
          </div>
        </section>

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

        {/* Location & Map Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
          <div className="container px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-5xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Title */}
              <motion.div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12" variants={fadeInUp}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {language === "ar" ? "موقعنا" : "Our Location"}
                </h2>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-semibold text-primary">
                    {language === "ar" ? "ابتسامة الورود لطب الأسنان" : "Rose Smile Dental Clinic"}
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {language === "ar"
                      ? "مكة المكرمة - حي العوالي - شارع ابراهيم الجفالي - أعلى صيدلية الدواء"
                      : "Makkah - Al-Awali District - Ibrahim Al-Jafali Street - Above Al-Dawa Pharmacy"}
                  </p>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div className="space-y-6" variants={fadeInUp}>
                <Card className="overflow-hidden border-2">
                  <CardContent className="p-0">
                    <div className="w-full aspect-video sm:aspect-[16/10] md:aspect-video relative">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.366826996365!2d39.88774458506184!3d21.356004385822036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c205a75fa29ceb%3A0x34e397f5afaaf369!2z2YXYrNmF2Lkg2KfYqNiq2LPYp9mF2Kkg2KfZhNmI2LHZiNivINmE2LfYqCDYp9mE2KPYs9mG2KfZhg!5e1!3m2!1sar!2seg!4v1760828095198!5m2!1sar!2seg"
                        width="100%"
                        height="100%"
                        style={{ border: 0, position: "absolute", top: 0, left: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={language === "ar" ? "موقع العيادة" : "Clinic Location"}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Get Directions Button */}
                <div className="text-center">
                  <Button size="lg" className="w-full sm:w-auto" asChild>
                    <a
                      href="https://maps.app.goo.gl/A1bn39TLNMNoCCJ8A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-map-pin"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {language === "ar" ? "اضغط للحصول على الاتجاهات" : "Click to Get Directions"}
                    </a>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5"
          style={{
            backgroundColor: getText("cta_background_color") || undefined,
            backgroundImage: getText("cta_background_color")
              ? "none"
              : "linear-gradient(to bottom right, hsl(var(--primary) / 0.05), hsl(var(--secondary) / 0.1), hsl(var(--primary) / 0.05))",
          }}
        >
          <div className="container">
            <motion.div
              className="max-w-3xl mx-auto text-center space-y-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-balance"
                variants={fadeInUp}
                style={{ color: getText("cta_title_color") || undefined }}
              >
                {renderFormattedText(
                  getText("cta_title") ||
                    (language === "ar"
                      ? "هل أنت مستعد لبدء رحلتك نحو صحة أفضل؟"
                      : "Are You Ready to Start Your Journey Towards Better Health?"),
                )}
              </motion.h2>
              <motion.p
                className="text-lg text-balance"
                variants={fadeInUp}
                style={{ color: getText("cta_text_color") || undefined }}
              >
                {renderFormattedText(
                  getText("cta_description") ||
                    (language === "ar"
                      ? "احجز موعدك الآن واحصل على استشارة طبية مجانية"
                      : "Book Your Appointment Now and Get a Free Medical Consultation"),
                )}
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={fadeInUp}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="relative overflow-hidden group" asChild>
                    <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                      <span className="relative z-10">{language === "ar" ? "احجز موعد" : "Book Appointment"}</span>
                    </Link>
                  </Button>
                </motion.div>
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
