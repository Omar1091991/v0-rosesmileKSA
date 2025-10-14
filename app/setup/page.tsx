"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink } from "lucide-react"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [showSQL, setShowSQL] = useState(false)

  const sqlCommands = `-- إنشاء جدول نماذج الحجز
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
ALTER TABLE doctor_cases DISABLE ROW LEVEL SECURITY;`

  const copySQL = () => {
    navigator.clipboard.writeText(sqlCommands)
    alert("تم نسخ الأوامر SQL!")
  }

  const openSupabase = () => {
    window.open("https://supabase.com/dashboard/project/_/sql", "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">تهيئة قاعدة البيانات</h1>
            <p className="text-gray-600">إنشاء الجداول المطلوبة لتشغيل جميع ميزات الموقع</p>
          </div>

          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription className="text-right">
              <p className="font-semibold mb-2">الجداول المطلوبة:</p>
              <ul className="space-y-1 text-sm">
                <li>• booking_forms - جدول نماذج الحجز</li>
                <li>• booking_form_services - جدول ربط النماذج بالخدمات</li>
                <li>• doctor_cases - جدول حالات الأطباء</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-right">خطوات التهيئة:</h3>
            <ol className="space-y-3 text-right text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                <span>انسخ أوامر SQL أدناه</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                <span>افتح Supabase SQL Editor</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                <span>الصق الأوامر واضغط "Run"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                  4
                </span>
                <span>ارجع إلى لوحة التحكم وابدأ باستخدام الموقع</span>
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={copySQL} className="flex-1 bg-transparent" variant="outline">
                <Copy className="w-4 h-4 ml-2" />
                نسخ أوامر SQL
              </Button>
              <Button onClick={openSupabase} className="flex-1">
                <ExternalLink className="w-4 h-4 ml-2" />
                فتح Supabase SQL Editor
              </Button>
            </div>

            <div className="relative">
              <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto max-h-96" dir="ltr">
                {sqlCommands}
              </pre>
            </div>

            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-right text-sm">
                <p className="font-semibold mb-1">ملاحظة مهمة:</p>
                <p>بعد تشغيل هذه الأوامر مرة واحدة، سيعمل الموقع بشكل كامل ولن تحتاج لتكرار هذه الخطوات مرة أخرى.</p>
              </AlertDescription>
            </Alert>

            <Button onClick={() => (window.location.href = "/dashboard")} className="w-full" size="lg">
              الانتقال إلى لوحة التحكم
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
