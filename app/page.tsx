"use client"

import type React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useLanguage } from "@/components/language-switcher"
import { HeroSlideshow } from "@/components/hero-slideshow"
import { AnimatedBackground } from "@/components/animated-background"
import { SocialMediaLinks } from "@/components/social-media-links"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [services, setServices] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({})
  const [mainBookingFormId, setMainBookingFormId] = useState<string>("")
  const language = useLanguage()
  const router = useRouter()

  const servicesScrollRef = useRef<HTMLDivElement>(null)
  const doctorsScrollRef = useRef<HTMLDivElement>(null)
  const offersScrollRef = useRef<HTMLDivElement>(null)
  const articlesScrollRef = useRef<HTMLDivElement>(null)

  const [isServicesAutoScrollPaused, setIsServicesAutoScrollPaused] = useState(false)
  const [isDoctorsAutoScrollPaused, setIsDoctorsAutoScrollPaused] = useState(false)
  const [isOffersAutoScrollPaused, setIsOffersAutoScrollPaused] = useState(false) // Added state for offers
  const [isArticlesAutoScrollPaused, setIsArticlesAutoScrollPaused] = useState(false)

  const [servicesScrollDirection, setServicesScrollDirection] = useState<"forward" | "backward">("forward")
  const [doctorsScrollDirection, setDoctorsScrollDirection] = useState<"forward" | "backward">("forward")
  const [offersScrollDirection, setOffersScrollDirection] = useState<"forward" | "backward">("forward") // Added state for offers
  const [articlesScrollDirection, setArticlesScrollDirection] = useState<"forward" | "backward">("forward")

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, doctorsRes, offersRes, articlesRes, settingsRes, formsRes] = await Promise.all([
          fetch("/api/services", { next: { revalidate: 300 } }),
          fetch("/api/doctors", { next: { revalidate: 300 } }),
          fetch("/api/offers", { next: { revalidate: 300 } }),
          fetch("/api/articles", { next: { revalidate: 300 } }),
          fetch("/api/site-settings", { next: { revalidate: 300 } }),
          fetch("/api/booking-forms", { next: { revalidate: 300 } }),
        ])

        const servicesData = await servicesRes.json()
        const doctorsData = await doctorsRes.json()
        const offersData = await offersRes.json()
        const articlesData = await articlesRes.json()
        const settingsData = await settingsRes.json()
        const formsData = await formsRes.json()

        const servicesArray = Array.isArray(servicesData) ? servicesData : servicesData.services || []
        setServices(servicesArray.filter((s: any) => s.is_active))
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

  useEffect(() => {
    if (!servicesScrollRef.current || services.length === 0 || isServicesAutoScrollPaused) return

    const interval = setInterval(() => {
      if (servicesScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = servicesScrollRef.current
        const isRTL = document.dir === "rtl" || document.documentElement.dir === "rtl"

        if (servicesScrollDirection === "forward") {
          // Check if reached the end (most negative value in RTL, or rightmost in LTR)
          if (Math.abs(scrollLeft) + clientWidth >= scrollWidth - 10) {
            setServicesScrollDirection("backward")
            servicesScrollRef.current.scrollBy({ left: isRTL ? 350 : -350, behavior: "smooth" })
          } else {
            // Scroll forward (more negative in RTL, positive in LTR)
            servicesScrollRef.current.scrollBy({ left: isRTL ? -350 : 350, behavior: "smooth" })
          }
        } else {
          // Scrolling backward - check if at the beginning
          if (Math.abs(scrollLeft) <= 10) {
            setServicesScrollDirection("forward")
            servicesScrollRef.current.scrollBy({ left: isRTL ? -350 : 350, behavior: "smooth" })
          } else {
            // Scroll backward (less negative in RTL, negative in LTR)
            servicesScrollRef.current.scrollBy({ left: isRTL ? 350 : -350, behavior: "smooth" })
          }
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [services, isServicesAutoScrollPaused, servicesScrollDirection])

  useEffect(() => {
    if (!doctorsScrollRef.current || doctors.length === 0 || isDoctorsAutoScrollPaused) return

    const interval = setInterval(() => {
      if (doctorsScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = doctorsScrollRef.current
        const isRTL = document.dir === "rtl" || document.documentElement.dir === "rtl"

        if (doctorsScrollDirection === "forward") {
          if (Math.abs(scrollLeft) + clientWidth >= scrollWidth - 10) {
            setDoctorsScrollDirection("backward")
            doctorsScrollRef.current.scrollBy({ left: isRTL ? 350 : -350, behavior: "smooth" })
          } else {
            doctorsScrollRef.current.scrollBy({ left: isRTL ? -350 : 350, behavior: "smooth" })
          }
        } else {
          // Scrolling backward - check if at the beginning
          if (Math.abs(scrollLeft) <= 10) {
            setDoctorsScrollDirection("forward")
            doctorsScrollRef.current.scrollBy({ left: isRTL ? -350 : 350, behavior: "smooth" })
          } else {
            doctorsScrollRef.current.scrollBy({ left: isRTL ? 350 : -350, behavior: "smooth" })
          }
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [doctors, isDoctorsAutoScrollPaused, doctorsScrollDirection])

  useEffect(() => {
    if (!offersScrollRef.current || offers.length === 0 || isOffersAutoScrollPaused) return

    const interval = setInterval(() => {
      if (offersScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = offersScrollRef.current
        const isRTL = document.dir === "rtl" || document.documentElement.dir === "rtl"

        if (offersScrollDirection === "forward") {
          if (Math.abs(scrollLeft) + clientWidth >= scrollWidth - 10) {
            setOffersScrollDirection("backward")
            offersScrollRef.current.scrollBy({ left: isRTL ? 350 : -350, behavior: "smooth" })
          } else {
            offersScrollRef.current.scrollBy({ left: isRTL ? -350 : 350, behavior: "smooth" })
          }
        } else {
          // Scrolling backward - check if at the beginning
          if (Math.abs(scrollLeft) <= 10) {
            setOffersScrollDirection("forward")
            offersScrollRef.current.scrollBy({ left: isRTL ? -350 : 350, behavior: "smooth" })
          } else {
            offersScrollRef.current.scrollBy({ left: isRTL ? 350 : -350, behavior: "smooth" })
          }
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [offers, isOffersAutoScrollPaused, offersScrollDirection])

  useEffect(() => {
    if (!articlesScrollRef.current || articles.length === 0 || isArticlesAutoScrollPaused) return

    const interval = setInterval(() => {
      if (articlesScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = articlesScrollRef.current
        const isRTL = document.dir === "rtl" || document.documentElement.dir === "rtl"

        if (articlesScrollDirection === "forward") {
          if (Math.abs(scrollLeft) + clientWidth >= scrollWidth - 10) {
            setArticlesScrollDirection("backward")
            articlesScrollRef.current.scrollBy({ left: isRTL ? 350 : -350, behavior: "smooth" })
          } else {
            articlesScrollRef.current.scrollBy({ left: isRTL ? -350 : 350, behavior: "smooth" })
          }
        } else {
          // Scrolling backward - check if at the beginning
          if (Math.abs(scrollLeft) <= 10) {
            setArticlesScrollDirection("forward")
            articlesScrollRef.current.scrollBy({ left: isRTL ? -350 : 350, behavior: "smooth" })
          } else {
            articlesScrollRef.current.scrollBy({ left: isRTL ? 350 : -350, behavior: "smooth" })
          }
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [articles, isArticlesAutoScrollPaused, articlesScrollDirection])

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 400
      ref.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleUserScroll = (setPausedState: React.Dispatch<React.SetStateAction<boolean>>) => {
    setPausedState(true)
    // Resume auto-scroll after 5 seconds of no interaction
    setTimeout(() => setPausedState(false), 5000)
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

  const getColor = (key: string, fallback?: string) => {
    const color = getText(key)
    return color || fallback || undefined
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

  const filteredOffers = offers // Assuming offers is already filtered by is_active

  return (
    <div className="flex min-h-screen flex-col">
      <AnimatedBackground />

      <SiteHeader user={user} />

      <main className="flex-1 relative z-10">
        {/* CHANGE: Removed temporary migration banner - migration completed successfully */}

        {/* Hero Section */}
        <section
          className="relative bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden"
          style={{
            backgroundColor: getColor("hero_background_color"),
            backgroundImage: getText("hero_background_color")
              ? "none"
              : "linear-gradient(to bottom right, hsl(var(--secondary) / 0.1), hsl(var(--background)), hsl(var(--primary) / 0.05))",
          }}
        >
          <div className="container px-2 sm:px-4 md:px-6 lg:px-8">
            {/* CHANGE: Removed dashboard button from hero section */}
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-right order-2 lg:order-1 px-2 sm:px-0">
                  <motion.h1
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-balance leading-tight"
                    variants={fadeInUp}
                    style={{ color: getColor("hero_title_color", "#1f2937") }}
                  >
                    {renderFormattedText(
                      getText("hero_title") ||
                        (language === "ar" ? "ابتسامة الورود ابتسامتك بتعود" : "Rose Smile - Your Smile Returns"),
                    )}
                  </motion.h1>
                  <motion.p
                    className="text-base sm:text-lg md:text-xl text-balance leading-relaxed"
                    variants={fadeInUp}
                    style={{ color: getColor("hero_description_color", "#4b5563") }}
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
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                      asChild
                      style={{
                        backgroundColor: getColor("primary_button_bg_color") || undefined,
                        color: getColor("primary_button_text_color") || undefined,
                      }}
                    >
                      <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                        {language === "ar" ? "احجز موعد" : "Book Appointment"}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto bg-transparent"
                      asChild
                      style={{
                        backgroundColor: getColor("secondary_button_bg_color") || undefined,
                        color: getColor("secondary_button_text_color") || undefined,
                        borderColor: getColor("secondary_button_border_color") || undefined,
                      }}
                    >
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
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="py-12 sm:py-16 md:py-20 lg:py-24"
          style={{
            backgroundColor: getColor("features_background_color", "#f9fafb"),
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
                    <CardContent className="pt-6 space-y-3 sm:space-4">
                      <h3
                        className="text-lg sm:text-xl font-semibold"
                        style={{ color: getColor("features_title_color", "#1f2937") }}
                      >
                        {renderFormattedText(feature.title.replace(/^\d+[\s.:-]*/, ""))}
                      </h3>
                      <p
                        className="text-sm sm:text-base leading-relaxed"
                        style={{ color: getColor("features_text_color", "#4b5563") }}
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
            backgroundColor: getColor("services_background_color"),
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
                  style={{ color: getColor("services_title_color", "#1f2937") }}
                >
                  {renderFormattedText(
                    getText("services_title") || (language === "ar" ? "خدماتنا الطبية" : "Our Medical Services"),
                  )}
                </h2>
              </Link>
              <p
                className="text-base sm:text-lg max-w-2xl mx-auto px-4"
                style={{ color: getColor("services_text_color", "#4b5563") }}
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
                onClick={() => {
                  scroll(servicesScrollRef, "left")
                  handleUserScroll(setIsServicesAutoScrollPaused)
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              {/* زر التمرير لليمين */}
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                onClick={() => {
                  scroll(servicesScrollRef, "right")
                  handleUserScroll(setIsServicesAutoScrollPaused)
                }}
              >
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>

              <div
                ref={servicesScrollRef}
                className="overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
                onMouseEnter={() => setIsServicesAutoScrollPaused(true)}
                onMouseLeave={() => setIsServicesAutoScrollPaused(false)}
                onTouchStart={() => handleUserScroll(setIsServicesAutoScrollPaused)}
                onWheel={() => handleUserScroll(setIsServicesAutoScrollPaused)}
              >
                <div className="flex gap-6" style={{ width: "max-content" }}>
                  {services?.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="w-[300px] sm:w-[350px]"
                    >
                      <Card
                        className="hover:shadow-lg transition-all hover:scale-105 h-full flex flex-col cursor-pointer"
                        onClick={() => {
                          window.location.href = `/services/${service.id}`
                        }}
                      >
                        <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-4 flex flex-col flex-1 p-4 sm:p-6">
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
                            <button
                              className="flex-1 py-2 px-4 text-xs sm:text-sm rounded-md transition-colors border"
                              style={{
                                backgroundColor: getColor("card_details_button_bg_color", "#f3f4f6"),
                                color: getColor("card_details_button_text_color", "#1f2937"),
                                borderColor: getColor("card_details_button_text_color", "#1f2937"),
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = getColor(
                                  "card_details_button_hover_bg_color",
                                  "#e5e7eb",
                                )
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = getColor(
                                  "card_details_button_bg_color",
                                  "#f3f4f6",
                                )
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = `/services/${service.id}`
                              }}
                            >
                              {language === "ar" ? "التفاصيل" : "Details"}
                            </button>
                            <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <button
                                className="w-full py-2 px-4 text-xs sm:text-sm rounded-md transition-colors relative overflow-hidden group"
                                style={{
                                  backgroundColor: getColor("card_book_button_bg_color", "#ec4899"),
                                  color: getColor("card_book_button_text_color", "#ffffff"),
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = getColor(
                                    "card_book_button_hover_bg_color",
                                    "#db2777",
                                  )
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = getColor(
                                    "card_book_button_bg_color",
                                    "#ec4899",
                                  )
                                }}
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
                              </button>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              className="text-center mt-8 sm:mt-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent"
                asChild
                style={{
                  backgroundColor: getColor("view_all_button_bg_color") || undefined,
                  color: getColor("view_all_button_text_color") || undefined,
                  borderColor: getColor("view_all_button_border_color") || undefined,
                }}
              >
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
              backgroundColor: getColor("doctors_background_color"),
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
                    style={{ color: getColor("doctors_title_color", "#1f2937") }}
                  >
                    {renderFormattedText(
                      getText("doctors_title") ||
                        (language === "ar" ? "أطباؤنا المتميزون" : "Our Distinguished Doctors"),
                    )}
                  </h2>
                </Link>
                <p
                  className="text-base sm:text-lg max-w-2xl mx-auto px-4"
                  style={{ color: getColor("doctors_text_color", "#4b5563") }}
                >
                  {renderFormattedText(
                    getText("doctors_description") ||
                      (language === "ar"
                        ? "فريق طبي متخصص بخبرات عالمية"
                        : "A team of specialized doctors with international experience"),
                  )}
                </p>
              </motion.div>

              {/* CHANGE: Changed doctors layout to show 2 cards vertically with horizontal scroll */}
              <div className="relative">
                {/* زر التمرير لليسار */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                  onClick={() => {
                    scroll(doctorsScrollRef, "left")
                    handleUserScroll(setIsDoctorsAutoScrollPaused)
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                {/* زر التمرير لليمين */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                  onClick={() => {
                    scroll(doctorsScrollRef, "right")
                    handleUserScroll(setIsDoctorsAutoScrollPaused)
                  }}
                >
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </Button>

                <div
                  ref={doctorsScrollRef}
                  className="overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
                  onMouseEnter={() => setIsDoctorsAutoScrollPaused(true)}
                  onMouseLeave={() => setIsDoctorsAutoScrollPaused(false)}
                  onTouchStart={() => handleUserScroll(setIsDoctorsAutoScrollPaused)}
                  onWheel={() => handleUserScroll(setIsDoctorsAutoScrollPaused)}
                >
                  <div className="flex gap-6" style={{ width: "max-content" }}>
                    {doctors.map((doctor) => (
                      <motion.div
                        key={doctor.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-[300px] sm:w-[350px]"
                      >
                        <Card
                          style={{
                            backgroundColor: getColor("card_background_color", "#ffffff"),
                            borderColor: getColor("card_border_color", "#e5e7eb"),
                          }}
                          className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col"
                          onClick={() => (window.location.href = `/doctors/${doctor.id}`)}
                        >
                          <CardContent className="p-0 flex flex-col h-full">
                            {/* Doctor Image */}
                            <div className="relative h-[320px] overflow-hidden">
                              <Image
                                src={doctor.image_url || "/placeholder.svg"}
                                alt={language === "ar" ? doctor.name_ar : doctor.name_en || doctor.name_ar}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>

                            {/* Doctor Info */}
                            <div className="p-6 flex flex-col flex-1">
                              <h3
                                className="text-xl font-bold mb-2 line-clamp-1"
                                style={{ color: getColor("card_title_color", "#1f2937") }}
                              >
                                {language === "ar" ? doctor.name_ar : doctor.name_en || doctor.name_ar}
                              </h3>
                              <p
                                className="text-sm mb-4 line-clamp-1"
                                style={{ color: getColor("card_text_color", "#6b7280") }}
                              >
                                {language === "ar" ? doctor.specialty_ar : doctor.specialty_en || doctor.specialty_ar}
                              </p>

                              {/* Bio excerpt */}
                              {doctor.bio_ar && (
                                <p
                                  className="text-sm mb-4 line-clamp-2 flex-1"
                                  style={{ color: getColor("card_text_color", "#6b7280") }}
                                >
                                  {language === "ar"
                                    ? doctor.bio_ar.replace(/<[^>]*>/g, "").substring(0, 80) + "..."
                                    : (doctor.bio_en || doctor.bio_ar).replace(/<[^>]*>/g, "").substring(0, 80) + "..."}
                                </p>
                              )}

                              {/* Action Buttons */}
                              <div className="flex gap-3 mt-auto pt-4">
                                <button
                                  className="flex-1 py-2 px-4 text-sm rounded-md transition-colors border"
                                  style={{
                                    backgroundColor: getColor("card_details_button_bg_color", "#f3f4f6"),
                                    color: getColor("card_details_button_text_color", "#1f2937"),
                                    borderColor: getColor("card_details_button_text_color", "#1f2937"),
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = getColor(
                                      "card_details_button_hover_bg_color",
                                      "#e5e7eb",
                                    )
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = getColor(
                                      "card_details_button_bg_color",
                                      "#f3f4f6",
                                    )
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.location.href = `/doctors/${doctor.id}`
                                  }}
                                >
                                  {language === "ar" ? "عرض التفاصيل" : "View Details"}
                                </button>
                                <button
                                  className="flex-1 py-2 px-4 text-sm rounded-md transition-colors"
                                  style={{
                                    backgroundColor: getColor("card_book_button_bg_color", "#ec4899"),
                                    color: getColor("card_book_button_text_color", "#ffffff"),
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = getColor(
                                      "card_book_button_hover_bg_color",
                                      "#db2777",
                                    )
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = getColor(
                                      "card_book_button_bg_color",
                                      "#ec4899",
                                    )
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.location.href = mainBookingFormId
                                      ? `/booking/${mainBookingFormId}`
                                      : "/booking"
                                  }}
                                >
                                  {language === "ar" ? "احجز الآن" : "Book Now"}
                                </button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                className="text-center mt-8 sm:mt-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <button
                  className="px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2 mx-auto"
                  style={{
                    backgroundColor: "#1a4f8b",
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#153d6f"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1a4f8b"
                  }}
                  onClick={() => (window.location.href = "/doctors")}
                >
                  {language === "ar" ? "تعرف على جميع الأطباء" : "Meet All Our Doctors"}
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Offers Section */}
        {filteredOffers && filteredOffers.length > 0 && (
          <section
            className="py-12 sm:py-16 md:py-20 lg:py-24"
            style={{
              backgroundColor: getColor("offers_background_color", "#f9fafb"),
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
                <Link href="/offers" className="inline-block hover:opacity-80 transition-opacity">
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-bold cursor-pointer"
                    style={{ color: getColor("offers_title_color", "#1f2937") }}
                  >
                    {renderFormattedText(
                      getText("offers_title") || (language === "ar" ? "عروضنا الخاصة" : "Our Special Offers"),
                    )}
                  </h2>
                </Link>
                <p
                  className="text-base sm:text-lg max-w-2xl mx-auto px-4"
                  style={{ color: getColor("offers_text_color", "#4b5563") }}
                >
                  {renderFormattedText(
                    getText("offers_description") ||
                      (language === "ar"
                        ? "استفد من عروضنا الطبية المميزة والمصممة خصيصاً لتلبية احتياجاتك"
                        : "Take advantage of our special medical offers designed specifically for your needs"),
                  )}
                </p>
              </motion.div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                  onClick={() => {
                    scroll(offersScrollRef, "left")
                    handleUserScroll(setIsOffersAutoScrollPaused)
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                  onClick={() => {
                    scroll(offersScrollRef, "right")
                    handleUserScroll(setIsOffersAutoScrollPaused)
                  }}
                >
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </Button>

                <div
                  ref={offersScrollRef}
                  className="overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
                  onMouseEnter={() => setIsOffersAutoScrollPaused(true)}
                  onMouseLeave={() => setIsOffersAutoScrollPaused(false)}
                  onTouchStart={() => handleUserScroll(setIsOffersAutoScrollPaused)}
                  onWheel={() => handleUserScroll(setIsOffersAutoScrollPaused)}
                >
                  <div className="flex gap-6" style={{ width: "max-content" }}>
                    {filteredOffers.map((offer) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-[300px] sm:w-[350px]"
                      >
                        <div
                          className="rounded-lg border hover:shadow-lg transition-all hover:scale-105 h-full flex flex-col cursor-pointer overflow-hidden"
                          style={{
                            backgroundColor: getColor("card_background_color", "#ffffff"),
                            borderColor: getColor("card_border_color", "#e5e7eb"),
                          }}
                          onClick={() => {
                            window.location.href = `/offers/${offer.id}`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = getColor("card_hover_border_color", "#ec4899")
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = getColor("card_border_color", "#e5e7eb")
                          }}
                        >
                          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex flex-col flex-1">
                            {offer.image_url && (
                              <div className="w-full aspect-video relative rounded-lg overflow-hidden">
                                <Image
                                  src={offer.image_url || "/placeholder.svg"}
                                  alt={language === "ar" ? offer.title_ar : offer.title_en || offer.title_ar}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <h3
                              className="text-base sm:text-lg md:text-xl font-semibold text-center line-clamp-2"
                              style={{ color: getColor("card_title_color", "#1f2937") }}
                            >
                              {language === "ar" ? offer.title_ar : offer.title_en || offer.title_ar}
                            </h3>
                            <p
                              className="text-center text-xs sm:text-sm line-clamp-2 flex-1"
                              style={{ color: getColor("card_text_color", "#4b5563") }}
                            >
                              {renderFormattedText(
                                language === "ar" ? offer.description_ar : offer.description_en || offer.description_ar,
                              )}
                            </p>
                            {offer.end_date && new Date(offer.end_date) >= new Date() && (
                              <p className="text-xs text-center text-muted-foreground">
                                {language === "ar" ? "ينتهي في" : "Ends on"}:{" "}
                                {new Date(offer.end_date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                              </p>
                            )}
                            <button
                              className="w-full py-2 px-4 text-xs sm:text-sm rounded-md transition-colors border"
                              style={{
                                backgroundColor: getColor("card_details_button_bg_color", "#f3f4f6"),
                                color: getColor("card_details_button_text_color", "#1f2937"),
                                borderColor: getColor("card_details_button_text_color", "#1f2937"),
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = getColor(
                                  "card_details_button_hover_bg_color",
                                  "#e5e7eb",
                                )
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = getColor(
                                  "card_details_button_bg_color",
                                  "#f3f4f6",
                                )
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = `/offers/${offer.id}`
                              }}
                            >
                              {language === "ar" ? "التفاصيل" : "Details"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                className="text-center mt-8 sm:mt-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent"
                  asChild
                  style={{
                    backgroundColor: getColor("view_all_button_bg_color") || undefined,
                    color: getColor("view_all_button_text_color") || undefined,
                    borderColor: getColor("view_all_button_border_color") || undefined,
                  }}
                >
                  <Link href="/offers">
                    {language === "ar" ? "عرض جميع العروض" : "View All Offers"}
                    <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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
                <Link href="/articles" className="inline-block hover:opacity-80 transition-opacity">
                  <h2
                    className="text-3xl md:text-4xl font-bold cursor-pointer"
                    style={{ color: getColor("articles_title_color", "#1f2937") }}
                  >
                    {renderFormattedText(
                      getText("articles_title") || (language === "ar" ? "مقالاتنا الطبية" : "Our Medical Articles"),
                    )}
                  </h2>
                </Link>
                <p
                  className="text-lg max-w-2xl mx-auto leading-relaxed"
                  style={{ color: getColor("articles_text_color", "#6b7280") }}
                >
                  {renderFormattedText(
                    getText("articles_description") ||
                      (language === "ar"
                        ? "اقرأ أحدث المقالات والنصائح الطبية"
                        : "Read the latest medical articles and tips"),
                  )}
                </p>
              </motion.div>

              {/* CHANGE: Changed articles layout to show 2 cards vertically with horizontal scroll */}
              <div className="relative">
                {/* زر التمرير لليسار */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                  onClick={() => {
                    scroll(articlesScrollRef, "left")
                    handleUserScroll(setIsArticlesAutoScrollPaused)
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                {/* زر التمرير لليمين */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                  onClick={() => {
                    scroll(articlesScrollRef, "right")
                    handleUserScroll(setIsArticlesAutoScrollPaused)
                  }}
                >
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </Button>

                <div
                  ref={articlesScrollRef}
                  className="overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
                  onMouseEnter={() => setIsArticlesAutoScrollPaused(true)}
                  onMouseLeave={() => setIsArticlesAutoScrollPaused(false)}
                  onTouchStart={() => handleUserScroll(setIsArticlesAutoScrollPaused)}
                  onWheel={() => handleUserScroll(setIsArticlesAutoScrollPaused)}
                >
                  <div className="flex gap-6" style={{ width: "max-content" }}>
                    {articles.map((article) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-[300px] sm:w-[350px]"
                      >
                        <Card
                          className="hover:shadow-lg transition-all hover:scale-105 h-full flex flex-col cursor-pointer"
                          onClick={() => {
                            window.location.href = `/articles/${article.id}`
                          }}
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
                                  : article.content_en?.substring(0, 120) || article.content_ar?.substring(0, 120)) +
                                  "...",
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
                  </div>
                </div>
              </div>

              <motion.div
                className="text-center mt-12"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  style={{ color: getColor("view_all_button_text_color", "#1f2937") }}
                >
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
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ color: getColor("social_media_section_title_color", "#1f2937") }}
              >
                {language === "ar" ? "تابعنا على وسائل التواصل الاجتماعي" : "Follow Us on Social Media"}
              </h2>
              <p
                className="text-base sm:text-lg max-w-2xl mx-auto"
                style={{ color: getColor("social_media_section_text_color", "#6b7280") }}
              >
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
        <section
          className="py-12 sm:py-16 md:py-20 lg:py-24"
          style={{
            backgroundColor: getColor("why_choose_us_background_color", "#ffffff"),
          }}
        >
          <div className="container">
            <motion.div
              className="text-center space-y-4 mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ color: getColor("why_choose_us_title_color", "#1f2937") }}
              >
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
                  <span className="text-lg" style={{ color: getColor("why_choose_us_item_color", "#1f2937") }}>
                    {item}
                  </span>
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
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold"
                  style={{ color: getColor("location_section_title_color", "#1f2937") }}
                >
                  {language === "ar" ? "موقعنا" : "Our Location"}
                </h2>
                <div className="space-y-2">
                  <h3
                    className="text-xl sm:text-2xl font-semibold"
                    style={{ color: getColor("location_section_subtitle_color", "#ec4899") }}
                  >
                    {language === "ar" ? "ابتسامة الورود لطب الأسنان" : "Rose Smile Dental Clinic"}
                  </h3>
                  <p
                    className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
                    style={{ color: getColor("location_section_text_color", "#6b7280") }}
                  >
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
                  {/* CHANGE: Changed doctors layout to show 2 cards vertically with horizontal scroll */}
                  <Button
                    size="lg"
                    className="gap-2"
                    style={{
                      backgroundColor: "#1a4f8b",
                      color: "#ffffff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#153d6f"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#1a4f8b"
                    }}
                  >
                    <MapPin className="h-5 w-5" />
                    {language === "ar" ? "اضغط للحصول على الاتجاهات" : "Get Directions"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-12 sm:py-16 md:py-20 lg:py-24"
          style={{
            backgroundColor: getColor("cta_background_color", "#ec4899"),
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
                style={{ color: getColor("cta_title_color", "#ffffff") }}
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
                style={{ color: getColor("cta_text_color", "#ffffff") }}
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
                  <Button
                    size="lg"
                    className="relative overflow-hidden group"
                    asChild
                    style={{
                      backgroundColor: getColor("cta_primary_button_bg_color") || undefined,
                      color: getColor("cta_primary_button_text_color") || undefined,
                    }}
                  >
                    <Link href={mainBookingFormId ? `/booking/${mainBookingFormId}` : "/booking"}>
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r
from-white/20 to-transparent"
                        style={{
                          background: `linear-gradient(to right, ${getColor(
                            "cta_primary_button_hover_bg_color",
                            "#e5e7eb",
                          )} 0%, rgba(255,255,255,0) 50%, ${getColor(
                            "cta_primary_button_hover_bg_color",
                            "#e5e7eb",
                          )} 100%)`,
                        }}
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                      <span className="relative z-10">
                        {language === "ar" ? "احجز موعدك الآن" : "Book Your Appointment Now"}
                      </span>
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    style={{
                      color: getColor("cta_secondary_button_text_color", "#ffffff"),
                      borderColor: getColor("cta_secondary_button_border_color", "#ffffff"),
                      backgroundColor: getColor("cta_secondary_button_bg_color", "transparent"),
                    }}
                  >
                    <Link href="/contact">
                      {language === "ar" ? "اتصل بنا" : "Contact Us"}
                      <Phone className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
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
