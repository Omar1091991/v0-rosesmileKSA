import type { Metadata } from "next"
import ArticlesPageClient from "./page.client"

export const metadata: Metadata = {
  title: "مقالات طبية عن صحة الأسنان والفم - نصائح من خبراء",
  description:
    "اقرأ أحدث المقالات والنصائح الطبية حول صحة الفم والأسنان من خبراء عيادات ابتسامة الورود في مكة المكرمة - مقالات متخصصة في العناية بالأسنان والوقاية من أمراض الفم",
  keywords: [
    "مقالات طب الأسنان",
    "نصائح صحة الأسنان",
    "العناية بالفم",
    "صحة الأسنان مكة",
    "مقالات طبية أسنان",
    "نصائح طبيب أسنان",
  ],
  openGraph: {
    title: "مقالات طبية عن صحة الأسنان - عيادات ابتسامة الورود",
    description: "نصائح طبية ومقالات متخصصة في صحة الفم والأسنان من خبراء مكة",
    url: "https://rosesmileksa.com/articles",
    type: "website",
  },
  alternates: {
    canonical: "https://rosesmileksa.com/articles",
  },
}

export default function ArticlesPage() {
  return <ArticlesPageClient />
}
