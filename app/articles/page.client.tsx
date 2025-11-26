"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"
import { useLanguage } from "@/components/language-switcher"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function ArticlesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

export default function ArticlesPageClient() {
  const { language } = useLanguage()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        const articlesData = Array.isArray(data) ? data : data.articles || []
        setArticles(articlesData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching articles:", error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">{language === "ar" ? "المقالات الطبية" : "Medical Articles"}</h1>
            <p className="text-lg text-muted-foreground">
              {language === "ar"
                ? "اكتشف أحدث المقالات والنصائح الطبية من خبرائنا"
                : "Discover the latest articles and medical advice from our experts"}
            </p>
          </div>

          {loading ? (
            <ArticlesSkeleton />
          ) : articles.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold">
                {language === "ar" ? "لا توجد مقالات حالياً" : "No articles available"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {language === "ar" ? "تحقق مرة أخرى قريباً للحصول على محتوى جديد" : "Check back soon for new content"}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {articles.map((article: any) => (
                <Card key={article.id} className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
                  {article.image_url && (
                    <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden">
                      <img
                        src={article.image_url || "/placeholder.svg"}
                        alt={language === "ar" ? article.title_ar : article.title_en}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="p-3 sm:p-4 flex-1">
                    <CardTitle className="line-clamp-2 text-sm sm:text-base md:text-lg">
                      {language === "ar" ? article.title_ar : article.title_en || article.title_ar}
                    </CardTitle>
                    <CardDescription
                      className="line-clamp-2 text-xs sm:text-sm whitespace-pre-line hidden sm:block"
                      dangerouslySetInnerHTML={{
                        __html:
                          (language === "ar"
                            ? article.excerpt_ar || article.content_ar?.substring(0, 100)
                            : article.excerpt_en || article.content_en?.substring(0, 100) || article.excerpt_ar) +
                          "...",
                      }}
                    />
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">
                          {language === "ar" ? article.author_ar : article.author_en || article.author_ar}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs">
                          {new Date(article.created_at).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                        </span>
                      </div>
                    </div>
                    <Button asChild className="w-full h-8 sm:h-9 text-xs sm:text-sm">
                      <Link href={`/articles/${article.id}`}>
                        {language === "ar" ? "قراءة المزيد" : "Read More"}
                        <ArrowRight className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <ArrowRight className="ml-2 h-5 w-5 rotate-180" />
                {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  )
}
