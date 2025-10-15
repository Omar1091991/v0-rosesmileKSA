import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

async function getArticle(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/articles?id=${id}`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.article
  } catch (error) {
    console.error("Error fetching article:", error)
    return null
  }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/articles">
            <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
            العودة للمقالات
          </Link>
        </Button>

        <Card>
          {article.image_url && (
            <div className="relative h-96 w-full overflow-hidden rounded-t-lg">
              <img
                src={article.image_url || "/placeholder.svg"}
                alt={article.title_ar}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <h1 className="mb-4 text-4xl font-bold">{article.title_ar}</h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{article.author_ar}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(article.created_at).toLocaleDateString("ar-SA")}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap text-lg leading-relaxed">{article.content_ar}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link href="/#booking">احجز موعدك الآن</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
