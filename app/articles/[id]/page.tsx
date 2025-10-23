"use client"

import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useLanguage } from "@/components/language-switcher"
import { useEffect, useState } from "react"

export default function ArticlePage({ params }: { params: { id: string } }) {
  const language = useLanguage()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/articles?id=${params.id}`)
        const data = await response.json()
        if (data.length > 0 && data[0].is_published) {
          setArticle(data[0])
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching article:", error)
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <LoadingSpinner />
        <SiteFooter />
      </div>
    )
  }
  // </CHANGE>

  if (!article) {
    return <div className="flex min-h-screen items-center justify-center">المقال غير موجود</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Button asChild variant="ghost" className="mb-6 sm:mb-8">
            <Link href="/articles">
              <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
              {language === "ar" ? "العودة للمقالات" : "Back to Articles"}
            </Link>
          </Button>

          <Card>
            {article.image_url && (
              <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-t-lg">
                <img
                  src={article.image_url || "/placeholder.svg"}
                  alt={language === "ar" ? article.title_ar : article.title_en || article.title_ar}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardHeader className="px-4 sm:px-6">
              <h1 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold">
                {language === "ar" ? article.title_ar : article.title_en || article.title_ar}
              </h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-muted-foreground text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{language === "ar" ? article.author_ar : article.author_en || article.author_ar}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{new Date(article.created_at).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div
                className="prose prose-base sm:prose-lg max-w-none dark:prose-invert whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: (language === "ar" ? article.content_ar : article.content_en || article.content_ar).replace(
                    /<(?!\/?(?:strong|em|s|b|i|del|span)\b)[^>]*>/gi,
                    "",
                  ),
                }}
              />
            </CardContent>
          </Card>

          <div className="mt-6 sm:mt-8 text-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/#booking">{language === "ar" ? "احجز موعدك الآن" : "Book Your Appointment Now"}</Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
