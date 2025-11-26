import type { Metadata } from "next"
import DoctorsClientPage from "./doctors-client-page"

export const metadata: Metadata = {
  title: "أطباء الأسنان - أفضل دكاترة أسنان في مكة المكرمة",
  description:
    "تعرف على نخبة من أفضل أطباء الأسنان في مكة المكرمة - أطباء متخصصون في تقويم الأسنان، زراعة الأسنان، تجميل الأسنان وجميع تخصصات طب الأسنان بخبرات عالمية",
  keywords: [
    "أطباء أسنان مكة",
    "دكتور أسنان مكة المكرمة",
    "أخصائي تقويم أسنان مكة",
    "أخصائي زراعة أسنان مكة",
    "استشاري أسنان مكة",
    "افضل دكتور اسنان مكة",
  ],
  openGraph: {
    title: "أطباء الأسنان - عيادات ابتسامة الورود مكة",
    description: "نخبة من أفضل أطباء الأسنان المتخصصين في مكة المكرمة",
    url: "https://rosesmileksa.com/doctors",
    type: "website",
  },
  alternates: {
    canonical: "https://rosesmileksa.com/doctors",
  },
}

export default function DoctorsPage() {
  return <DoctorsClientPage />
}
