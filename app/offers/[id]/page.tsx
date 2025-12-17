"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Calendar, Percent, Phone, Clock, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

interface Offer {
  id: number
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  original_price: number
  discounted_price: number
  price_before?: number
  price_after?: number
  discount_percentage: number
  valid_from: string | null
  valid_until: string | null
  image_url: string
  is_active: boolean
  created_at: string
}

export default function OfferDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState<"ar" | "en">("ar")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "ar" | "en" | null
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const isArabic = currentLanguage === "ar"

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`/api/offers/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError(isArabic ? "العرض غير موجود" : "Offer not found")
          } else {
            throw new Error("Failed to fetch offer")
          }
          return
        }
        const data = await response.json()
        setOffer(data)
      } catch (err) {
        setError(isArabic ? "حدث خطأ في تحميل العرض" : "Error loading offer")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOffer()
    }
  }, [id, isArabic])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (error || !offer) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {error || (isArabic ? "العرض غير موجود" : "Offer not found")}
              </h2>
              <p className="text-gray-600 mb-6">
                {isArabic ? "عذراً، لم نتمكن من العثور على هذا العرض" : "Sorry, we couldn't find this offer"}
              </p>
              <Link href="/offers">
                <Button className="bg-pink-500 hover:bg-pink-600">
                  {isArabic ? (
                    <>
                      <ArrowRight className="ml-2 h-4 w-4" />
                      العودة للعروض
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Offers
                    </>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const title = isArabic ? offer.title_ar : offer.title_en || offer.title_ar
  const description = isArabic ? offer.description_ar : offer.description_en || offer.description_ar
  const originalPrice = offer.original_price || offer.price_before
  const discountedPrice = offer.discounted_price || offer.price_after

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 bg-gradient-to-b from-pink-50 to-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-[#1a5a72] to-[#0d3d4d] text-white py-16">
          <div className="container mx-auto px-4">
            <Link
              href="/offers"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              {isArabic ? (
                <>
                  <ArrowRight className="ml-2 h-5 w-5" />
                  العودة للعروض
                </>
              ) : (
                <>
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Offers
                </>
              )}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            {offer.discount_percentage && (
              <Badge className="bg-pink-500 text-white text-lg px-4 py-2">
                <Percent className="w-5 h-5 ml-1" />
                {offer.discount_percentage}% {isArabic ? "خصم" : "OFF"}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative">
              {offer.image_url ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image src={offer.image_url || "/placeholder.svg"} alt={title} fill className="object-cover" />
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                  <Tag className="w-20 h-20 text-pink-400" />
                </div>
              )}

              {/* Discount Badge */}
              {offer.discount_percentage && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  {offer.discount_percentage}% {isArabic ? "خصم" : "OFF"}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Prices */}
              <Card className="border-2 border-pink-100">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    {isArabic ? "تفاصيل السعر" : "Price Details"}
                  </h3>
                  <div className="space-y-3">
                    {originalPrice && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{isArabic ? "السعر الأصلي:" : "Original Price:"}</span>
                        <span className="text-gray-400 line-through text-lg">
                          {originalPrice} {isArabic ? "ر.س" : "SAR"}
                        </span>
                      </div>
                    )}
                    {discountedPrice && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{isArabic ? "السعر بعد الخصم:" : "Discounted Price:"}</span>
                        <span className="text-pink-600 font-bold text-2xl">
                          {discountedPrice} {isArabic ? "ر.س" : "SAR"}
                        </span>
                      </div>
                    )}
                    {offer.discount_percentage && (
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-gray-600">{isArabic ? "نسبة التوفير:" : "You Save:"}</span>
                        <Badge className="bg-green-100 text-green-700 text-lg">{offer.discount_percentage}%</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Validity */}
              {(offer.valid_from || offer.valid_until) && (
                <Card className="border-2 border-blue-100">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 ml-2 text-blue-500" />
                      {isArabic ? "صلاحية العرض" : "Offer Validity"}
                    </h3>
                    <div className="space-y-2">
                      {offer.valid_from && (
                        <p className="text-gray-600">
                          <span className="font-medium">{isArabic ? "من:" : "From:"}</span>{" "}
                          {formatDate(offer.valid_from)}
                        </p>
                      )}
                      {offer.valid_until && (
                        <p className="text-gray-600">
                          <span className="font-medium">{isArabic ? "إلى:" : "Until:"}</span>{" "}
                          {formatDate(offer.valid_until)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    {isArabic ? "تفاصيل العرض" : "Offer Description"}
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
                </CardContent>
              </Card>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking" className="flex-1">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 text-lg">
                    <Clock className={`w-5 h-5 ${isArabic ? "ml-2" : "mr-2"}`} />
                    {isArabic ? "احجز موعدك الآن" : "Book Now"}
                  </Button>
                </Link>
                <Link href="tel:+966508533232" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-pink-500 text-pink-500 hover:bg-pink-50 py-6 text-lg bg-transparent"
                  >
                    <Phone className={`w-5 h-5 ${isArabic ? "ml-2" : "mr-2"}`} />
                    {isArabic ? "اتصل بنا" : "Call Us"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
