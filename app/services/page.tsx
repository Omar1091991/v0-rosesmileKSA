import { ServicesClient } from "./services-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "خدماتنا الطبية - جميع خدمات طب الأسنان في مكة المكرمة",
  description:
    "تعرف على جميع خدمات طب الأسنان في عيادات ابتسامة الورود بمكة: تقويم الأسنان، زراعة الأسنان، تجميل الأسنان، تبييض الأسنان، علاج جذور، تركيبات، وجراحة الفم والوجه والفكين",
  keywords: [
    "خدمات طب الأسنان مكة",
    "تقويم أسنان مكة",
    "زراعة أسنان مكة",
    "تجميل أسنان مكة",
    "تبييض أسنان مكة",
    "علاج جذور مكة",
    "تركيبات أسنان مكة",
  ],
  openGraph: {
    title: "خدماتنا الطبية - عيادات ابتسامة الورود مكة",
    description: "جميع خدمات طب الأسنان المتخصصة في مكة المكرمة بأحدث التقنيات",
    url: "https://rosesmileksa.com/services",
    type: "website",
  },
  alternates: {
    canonical: "https://rosesmileksa.com/services",
  },
}

export default function ServicesPage() {
  return <ServicesClient />
}
