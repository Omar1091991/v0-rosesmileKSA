"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, AlertCircle, ExternalLink } from "lucide-react"

export default function DatabaseInitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Database className="w-10 h-10 text-pink-600" />
            <h1 className="text-4xl font-bold text-gray-900">تهيئة قاعدة البيانات</h1>
          </div>
          <p className="text-gray-600">معلومات مهمة حول قاعدة بيانات Railway PostgreSQL</p>
        </div>

        {/* Important Notice */}
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong className="block mb-2">⚠️ ملاحظة مهمة جداً:</strong>
            <p className="mb-2">
              بيئة v0 لا تدعم الاتصال المباشر بقاعدة بيانات Railway PostgreSQL لأنها تتطلب WebSocket وهو غير متاح في
              المتصفح.
            </p>
            <p className="font-semibold">حالياً، الموقع يعمل ببيانات تجريبية للمعاينة فقط.</p>
          </AlertDescription>
        </Alert>

        {/* Current Status */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Database className="w-5 h-5" />
              الوضع الحالي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-blue-800">
            <div className="flex items-start gap-2">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold">البيانات التجريبية نشطة</p>
                <p className="text-sm">الموقع يعرض بيانات تجريبية تشمل خدمات، أطباء، أقسام، عروض، ومقالات</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl">ℹ️</span>
              <div>
                <p className="font-semibold">للحصول على قاعدة بيانات حقيقية</p>
                <p className="text-sm">يجب نشر الموقع على Vercel حيث ستعمل Railway PostgreSQL بشكل كامل</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tables Info */}
        <Card>
          <CardHeader>
            <CardTitle>الجداول المتاحة في البيانات التجريبية</CardTitle>
            <CardDescription>هذه الجداول متوفرة حالياً ببيانات تجريبية</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-600">✓</span>
                <span>services - الخدمات (3 خدمات)</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-600">✓</span>
                <span>doctors - الأطباء (2 طبيب)</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-600">✓</span>
                <span>departments - الأقسام (2 قسم)</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-600">✓</span>
                <span>offers - العروض (1 عرض)</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-600">✓</span>
                <span>articles - المقالات (1 مقال)</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-600">✓</span>
                <span>gallery - المعرض (1 صورة)</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-600">✓</span>
                <span>site_settings - الإعدادات</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-600">✓</span>
                <span>bookings - الحجوزات</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Deployment Instructions */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">خطوات النشر على Vercel</CardTitle>
            <CardDescription className="text-green-700">
              لاستخدام Railway PostgreSQL الحقيقية، اتبع هذه الخطوات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-green-800">
            <div className="flex gap-2">
              <span className="font-bold text-green-600">1.</span>
              <p>اضغط على زر "Publish" في أعلى الصفحة لنشر الموقع على Vercel</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-green-600">2.</span>
              <p>تأكد من أن متغيرات البيئة الخاصة بـ Railway موجودة في إعدادات Vercel</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-green-600">3.</span>
              <p>
                قم بتشغيل سكريبت SQL من ملف <code className="bg-white px-1 rounded">railway_complete_setup.sql</code> في
                لوحة تحكم Railway
              </p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-green-600">4.</span>
              <p>بعد النشر، ستعمل قاعدة البيانات الحقيقية تلقائياً</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => (window.location.href = "/")} className="flex-1" size="lg">
            العودة للصفحة الرئيسية
          </Button>
          <Button onClick={() => (window.location.href = "/dashboard")} variant="outline" className="flex-1" size="lg">
            عرض لوحة التحكم
          </Button>
          <Button
            onClick={() => window.open("https://vercel.com/docs/storage/vercel-postgres", "_blank")}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <ExternalLink className="ml-2 h-4 w-4" />
            دليل Vercel
          </Button>
        </div>
      </div>
    </div>
  )
}
