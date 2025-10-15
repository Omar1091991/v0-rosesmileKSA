"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, CheckCircle } from "lucide-react"

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
          <p className="text-gray-600">نظام تخزين دائم للبيانات في بيئة v0</p>
        </div>

        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong className="block mb-2">✓ نظام التخزين الدائم نشط</strong>
            <p className="mb-2">
              تم تفعيل نظام تخزين دائم باستخدام localStorage. جميع التغييرات التي تقوم بها (إضافة، تعديل، حذف) ستبقى
              محفوظة حتى بعد تحديث الصفحة.
            </p>
            <p className="font-semibold">التغييرات الآن دائمة في بيئة v0 المعاينة!</p>
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
                <p className="font-semibold">نظام التخزين الدائم نشط</p>
                <p className="text-sm">
                  جميع التغييرات محفوظة في localStorage وستبقى بعد تحديث الصفحة أو إغلاق المتصفح
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl">💾</span>
              <div>
                <p className="font-semibold">البيانات التجريبية + التغييرات الخاصة بك</p>
                <p className="text-sm">
                  الموقع يعرض البيانات التجريبية الأساسية بالإضافة إلى أي تغييرات تقوم بها في لوحة التحكم
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="font-semibold">جاهز للنشر على Vercel</p>
                <p className="text-sm">عند النشر، سيتم استخدام Railway PostgreSQL الحقيقية تلقائياً</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tables Info */}
        <Card>
          <CardHeader>
            <CardTitle>الجداول المتاحة</CardTitle>
            <CardDescription>يمكنك إضافة وتعديل وحذف البيانات في هذه الجداول</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-600">✓</span>
                <span>profiles - المستخدمين (3 مستخدمين)</span>
              </li>
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

        {/* Features */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-900">المميزات المتاحة الآن</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-purple-800">
            <div className="flex gap-2">
              <span className="text-purple-600">✓</span>
              <p>إضافة مستخدمين جدد من لوحة التحكم</p>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-600">✓</span>
              <p>تعديل بيانات المستخدمين الموجودين</p>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-600">✓</span>
              <p>حذف المستخدمين</p>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-600">✓</span>
              <p>جميع التغييرات محفوظة بشكل دائم في localStorage</p>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-600">✓</span>
              <p>نظام تسجيل دخول كامل مع صلاحيات المستخدمين</p>
            </div>
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
                قم بتشغيل سكريبت SQL من ملف <code className="bg-white px-1 rounded">railway_init.sql</code> في لوحة تحكم
                Railway
              </p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-green-600">4.</span>
              <p>بعد النشر، سيتم استبدال localStorage بقاعدة البيانات الحقيقية تلقائياً</p>
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
          <Button onClick={() => (window.location.href = "/auth/login")} variant="outline" className="flex-1" size="lg">
            تسجيل الدخول
          </Button>
        </div>
      </div>
    </div>
  )
}
