import type { Metadata } from "next"
import OffersClientPage from "./offers-client-page"

export const metadata: Metadata = {
  title: "عروضنا الخاصة - خصومات على خدمات طب الأسنان في مكة",
  description:
    "احصل على أفضل العروض والخصومات على خدمات طب الأسنان في عيادات ابتسامة الورود بمكة المكرمة - عروض حصرية على تقويم، زراعة، تجميل وتبييض الأسنان",
  keywords: [
    "عروض أسنان مكة",
    "خصومات طب الأسنان مكة",
    "عروض تقويم أسنان",
    "عروض تبييض أسنان",
    "عروض زراعة أسنان مكة",
    "خصم عيادة أسنان مكة",
  ],
  openGraph: {
    title: "عروضنا الخاصة - عيادات ابتسامة الورود مكة",
    description: "عروض وخصومات مميزة على جميع خدمات طب الأسنان في مكة المكرمة",
    url: "https://rosesmileksa.com/offers",
    type: "website",
  },
  alternates: {
    canonical: "https://rosesmileksa.com/offers",
  },
}

export default function OffersPage() {
  return <OffersClientPage />
}
