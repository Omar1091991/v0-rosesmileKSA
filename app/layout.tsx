import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
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
  title: "عيادات ابتسامة الورود - مكة المكرمة",
  description: "عيادات طبية متخصصة في مكة المكرمة - نقدم أفضل الخدمات الطبية بأحدث التقنيات",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`font-sans ${cairo.variable} ${GeistMono.variable}`}>
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
