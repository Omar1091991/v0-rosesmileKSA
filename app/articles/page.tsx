import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { query } from "@/lib/db"

async function getArticles() {
  try {
    const result = await query("SELECT * FROM articles WHERE is_published = true ORDER BY created_at DESC")
    return result.rows || []
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

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

async function ArticlesList() {
  const articles = await getArticles()

  if (articles.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold">لا توجد مقالات حالياً</h2>
        <p className="mt-2 text-muted-foreground">تحقق مرة أخرى قريباً للحصول على محتوى جديد</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {articles.map((article: any) => (
        <Card key={article.id} className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
          {article.image_url && (
            <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden">
              <img
                src={article.image_url || "/placeholder.svg"}
                alt={article.title_ar}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <CardHeader className="p-3 sm:p-4 flex-1">
            <CardTitle className="line-clamp-2 text-sm sm:text-base md:text-lg">{article.title_ar}</CardTitle>
            <CardDescription
              className="line-clamp-2 text-xs sm:text-sm whitespace-pre-line hidden sm:block"
              dangerouslySetInnerHTML={{
                __html: article.excerpt_ar || article.content_ar?.substring(0, 100) + "...",
              }}
            />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{article.author_ar}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs">{new Date(article.created_at).toLocaleDateString("ar-SA")}</span>
              </div>
            </div>
            <Button asChild className="w-full h-8 sm:h-9 text-xs sm:text-sm">
              <Link href={`/articles/${article.id}`}>
                قراءة المزيد
                <ArrowRight className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ArticlesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">المقالات الطبية</h1>
            <p className="text-lg text-muted-foreground">اكتشف أحدث المقالات والنصائح الطبية من خبرائنا</p>
          </div>

          <Suspense fallback={<ArticlesSkeleton />}>
            <ArticlesList />
          </Suspense>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <ArrowRight className="ml-2 h-5 w-5 rotate-180" />
                العودة للرئيسية
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
