"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Database, AlertCircle } from "lucide-react"

export default function DatabaseInitPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString("ar-SA")}] ${log}`])
  }

  const initializeDatabase = async () => {
    setStatus("loading")
    setMessage("")
    setLogs([])

    try {
      addLog("بدء تهيئة قاعدة البيانات...")

      const response = await fetch("/api/database/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        addLog("✓ تم إنشاء جميع الجداول بنجاح")
        addLog("✓ تم إدراج البيانات الافتراضية")
        addLog("✓ تم إنشاء الفهارس")
        setStatus("success")
        setMessage("تم تهيئة قاعدة البيانات بنجاح! يمكنك الآن استخدام الموقع.")
      } else {
        addLog("✗ فشل في تهيئة قاعدة البيانات")
        addLog(`الخطأ: ${data.error || "خطأ غير معروف"}`)
        setStatus("error")
        setMessage(data.error || "حدث خطأ أثناء تهيئة قاعدة البيانات")
      }
    } catch (error: any) {
      addLog("✗ فشل الاتصال بالخادم")
      addLog(`الخطأ: ${error.message}`)
      setStatus("error")
      setMessage("فشل الاتصال بالخادم. تأكد من اتصالك بالإنترنت.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Database className="w-10 h-10 text-pink-600" />
            <h1 className="text-4xl font-bold text-gray-900">تهيئة قاعدة البيانات</h1>
          </div>
          <p className="text-gray-600">قم بتهيئة قاعدة بيانات Railway PostgreSQL وإنشاء جميع الجداول المطلوبة</p>
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              إعداد قاعدة البيانات
            </CardTitle>
            <CardDescription>سيتم إنشاء جميع الجداول المطلوبة وإدراج البيانات الافتراضية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Alert */}
            {status === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert className="bg-red-50 border-red-200">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{message}</AlertDescription>
              </Alert>
            )}

            {/* Info Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>ملاحظة:</strong> هذه العملية ستقوم بإنشاء الجداول التالية:
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>profiles - جدول المستخدمين</li>
                  <li>departments - جدول الأقسام</li>
                  <li>services - جدول الخدمات</li>
                  <li>doctors - جدول الأطباء</li>
                  <li>doctor_cases - جدول حالات الأطباء</li>
                  <li>booking_forms - جدول نماذج الحجز</li>
                  <li>bookings - جدول الحجوزات</li>
                  <li>offers - جدول العروض</li>
                  <li>gallery - جدول معرض الصور</li>
                  <li>articles - جدول المقالات</li>
                  <li>site_settings - جدول إعدادات الموقع</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Initialize Button */}
            <Button onClick={initializeDatabase} disabled={status === "loading"} className="w-full" size="lg">
              {status === "loading" ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري التهيئة...
                </>
              ) : (
                <>
                  <Database className="ml-2 h-4 w-4" />
                  تهيئة قاعدة البيانات
                </>
              )}
            </Button>

            {/* Logs */}
            {logs.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">سجل العمليات:</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>التعليمات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex gap-2">
              <span className="font-bold text-pink-600">1.</span>
              <p>تأكد من أن متغيرات البيئة الخاصة بـ Railway PostgreSQL موجودة ومضبوطة بشكل صحيح</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-pink-600">2.</span>
              <p>اضغط على زر "تهيئة قاعدة البيانات" لبدء عملية الإنشاء</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-pink-600">3.</span>
              <p>انتظر حتى تكتمل العملية وتظهر رسالة النجاح</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-pink-600">4.</span>
              <p>بعد النجاح، يمكنك الانتقال إلى لوحة التحكم لإدارة المحتوى</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {status === "success" && (
          <div className="flex gap-4">
            <Button onClick={() => (window.location.href = "/dashboard")} className="flex-1" size="lg">
              الانتقال إلى لوحة التحكم
            </Button>
            <Button onClick={() => (window.location.href = "/")} variant="outline" className="flex-1" size="lg">
              العودة للصفحة الرئيسية
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
