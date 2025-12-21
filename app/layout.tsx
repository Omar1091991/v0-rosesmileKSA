import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import "./globals.css"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { DynamicColors } from "@/components/dynamic-colors"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "عيادات ابتسامة الورود - عيادة أسنان في مكة المكرمة | تقويم وزراعة وتجميل الأسنان",
    template: "%s | عيادات ابتسامة الورود - مكة المكرمة",
  },
  description:
    "عيادة أسنان متخصصة في مكة المكرمة تقدم جميع خدمات طب الأسنان: تقويم الأسنان، زراعة الأسنان، تجميل الأسنان، تبييض الأسنان، علاج اللثة، وجراحة الفم. أفضل أطباء أسنان في مكة بأحدث التقنيات وأسعار مناسبة.",
  keywords: [
    "عيادة أسنان مكة",
    "طبيب أسنان مكة المكرمة",
    "تقويم أسنان مكة",
    "زراعة أسنان مكة",
    "تجميل أسنان مكة",
    "تبييض أسنان مكة",
    "ابتسامة هوليود مكة",
    "عيادة ابتسامة الورود",
    "افضل عيادة اسنان في مكة",
    "طوارئ اسنان مكة",
    "علاج جذور مكة",
    "تركيبات اسنان مكة",
  ],
  authors: [{ name: "عيادات ابتسامة الورود" }],
  creator: "عيادات ابتسامة الورود",
  publisher: "عيادات ابتسامة الورود",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "عيادات ابتسامة الورود - أفضل عيادة أسنان في مكة المكرمة",
    description:
      "عيادة أسنان متخصصة في مكة المكرمة - تقويم، زراعة، تجميل الأسنان وجميع خدمات طب الأسنان بأحدث التقنيات",
    url: "https://rosesmileksa.com",
    siteName: "عيادات ابتسامة الورود",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/images/logo.jpeg",
        width: 512,
        height: 512,
        alt: "شعار عيادات ابتسامة الورود",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عيادات ابتسامة الورود - عيادة أسنان في مكة المكرمة",
    description: "تقويم، زراعة، تجميل الأسنان وجميع خدمات طب الأسنان في مكة",
    images: ["/images/logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://rosesmileksa.com",
  },
  category: "healthcare",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/images/logo.jpeg", type: "image/jpeg", sizes: "192x192" },
    ],
    apple: [{ url: "/images/logo.jpeg", sizes: "180x180", type: "image/jpeg" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "عيادات ابتسامة الورود",
    image: "https://rosesmileksa.com/images/logo.jpeg",
    description: "عيادة أسنان متخصصة في مكة المكرمة تقدم جميع خدمات طب الأسنان",
    address: {
      "@type": "PostalAddress",
      addressLocality: "مكة المكرمة",
      addressRegion: "مكة المكرمة",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 21.3891,
      longitude: 39.8579,
    },
    url: "https://rosesmileksa.com",
    telephone: "+966-XX-XXX-XXXX",
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    medicalSpecialty: ["Dentistry", "Orthodontics", "Dental Implants", "Cosmetic Dentistry"],
    availableService: [
      {
        "@type": "MedicalProcedure",
        name: "تقويم الأسنان",
      },
      {
        "@type": "MedicalProcedure",
        name: "زراعة الأسنان",
      },
      {
        "@type": "MedicalProcedure",
        name: "تجميل الأسنان",
      },
      {
        "@type": "MedicalProcedure",
        name: "تبييض الأسنان",
      },
    ],
  }

  return (
    <html lang="ar" dir="rtl">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MW4RJRTF');
          `}
        </Script>
      </head>
      <body className={`font-sans ${cairo.variable}`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MW4RJRTF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <DynamicColors />
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster />
          <WhatsAppButton />
        </Suspense>
      </body>
    </html>
  )
}
