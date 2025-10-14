"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<string[]>([])

  const setupDatabase = async () => {
    setStatus("loading")
    setMessage("جاري إنشاء الجداول المطلوبة...")
    setDetails([])

    try {
      const supabase = createClient()

      setDetails((prev) => [...prev, "إنشاء جدول booking_forms..."])
      const { error: error1 } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS booking_forms (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name_ar TEXT NOT NULL,
            name_en TEXT NOT NULL,
            description_ar TEXT,
            description_en TEXT,
            image_url TEXT,
            google_sheet_id TEXT,
            is_main BOOLEAN DEFAULT false,
            is_active BOOLEAN DEFAULT true,
            order_index INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          ALTER TABLE booking_forms DISABLE ROW LEVEL SECURITY;
        `,
      })

      if (error1) throw error1
      setDetails((prev) => [...prev, "✓ تم إنشاء جدول booking_forms"])

      setDetails((prev) => [...prev, "إنشاء جدول booking_form_services..."])
      const { error: error2 } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS booking_form_services (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            booking_form_id UUID REFERENCES booking_forms(id) ON DELETE CASCADE,
            service_id UUID REFERENCES services(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(booking_form_id, service_id)
          );
          ALTER TABLE booking_form_services DISABLE ROW LEVEL SECURITY;
        `,
      })

      if (error2) throw error2
      setDetails((prev) => [...prev, "✓ تم إنشاء جدول booking_form_services"])

      setDetails((prev) => [...prev, "إنشاء جدول doctor_cases..."])
      const { error: error3 } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS doctor_cases (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL,
            title_ar TEXT,
            title_en TEXT,
            description_ar TEXT,
            description_en TEXT,
            order_index INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          ALTER TABLE doctor_cases DISABLE ROW LEVEL SECURITY;
        `,
      })

      if (error3) throw error3
      setDetails((prev) => [...prev, "✓ تم إنشاء جدول doctor_cases"])

      setDetails((prev) => [...prev, "إنشاء نموذج الحجز الرئيسي..."])
      const { data: mainForm, error: error4 } = await supabase
        .from("booking_forms")
        .insert({
          name_ar: "نموذج الحجز الرئيسي",
          name_en: "Main Booking Form",
          description_ar: "نموذج الحجز الرئيسي للموقع",
          description_en: "Main booking form for the website",
          is_main: true,
          is_active: true,
        })
        .select()
        .single()

      if (error4) throw error4
      setDetails((prev) => [...prev, "✓ تم إنشاء نموذج الحجز الرئيسي"])

      if (mainForm) {
        setDetails((prev) => [...prev, "ربط الخدمات بنموذج الحجز..."])
        const { data: services } = await supabase.from("services").select("id")

        if (services && services.length > 0) {
          const formServices = services.map((service) => ({
            booking_form_id: mainForm.id,
            service_id: service.id,
          }))

          const { error: error5 } = await supabase.from("booking_form_services").insert(formServices)

          if (error5) throw error5
          setDetails((prev) => [...prev, `✓ تم ربط ${services.length} خدمة بنموذج الحجز`])
        }
      }

      setStatus("success")
      setMessage("تم إنشاء جميع الجداول بنجاح! يمكنك الآن استخدام جميع ميزات الموقع.")
    } catch (error: any) {
      console.error("[v0] Setup error:", error)
      setStatus("error")
      setMessage(`حدث خطأ: ${error.message}`)
      setDetails((prev) => [...prev, `❌ ${error.message}`])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تهيئة قاعدة البيانات</h1>
            <p className="text-gray-600">إنشاء الجداول المطلوبة لتشغيل جميع ميزات الموقع</p>
          </div>

          {status === "idle" && (
            <div className="text-center">
              <p className="text-gray-700 mb-6">سيتم إنشاء الجداول التالية:</p>
              <ul className="text-right mb-8 space-y-2">
                <li className="flex items-center justify-end gap-2">
                  <span>جدول نماذج الحجز</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </li>
                <li className="flex items-center justify-end gap-2">
                  <span>جدول ربط النماذج بالخدمات</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </li>
                <li className="flex items-center justify-end gap-2">
                  <span>جدول حالات الأطباء</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </li>
              </ul>
              <Button onClick={setupDatabase} size="lg" className="w-full">
                بدء التهيئة
              </Button>
            </div>
          )}

          {status === "loading" && (
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">{message}</p>
              <div className="text-right space-y-2">
                {details.map((detail, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-4">{message}</p>
              <div className="text-right space-y-2 mb-6">
                {details.map((detail, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
              <Button onClick={() => (window.location.href = "/dashboard")} size="lg" className="w-full">
                الانتقال إلى لوحة التحكم
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-4">{message}</p>
              <div className="text-right space-y-2 mb-6">
                {details.map((detail, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-right">
                <p className="text-sm text-gray-700 mb-2">يمكنك تشغيل الأوامر التالية يدوياً في Supabase SQL Editor:</p>
                <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-left" dir="ltr">
                  {`-- إنشاء جدول نماذج الحجز
CREATE TABLE IF NOT EXISTS booking_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  google_sheet_id TEXT,
  is_main BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE booking_forms DISABLE ROW LEVEL SECURITY;

-- إنشاء جدول ربط النماذج بالخدمات
CREATE TABLE IF NOT EXISTS booking_form_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_form_id UUID REFERENCES booking_forms(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_form_id, service_id)
);
ALTER TABLE booking_form_services DISABLE ROW LEVEL SECURITY;

-- إنشاء جدول حالات الأطباء
CREATE TABLE IF NOT EXISTS doctor_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title_ar TEXT,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE doctor_cases DISABLE ROW LEVEL SECURITY;`}
                </pre>
              </div>
              <Button onClick={setupDatabase} size="lg" variant="outline" className="w-full bg-transparent">
                إعادة المحاولة
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
