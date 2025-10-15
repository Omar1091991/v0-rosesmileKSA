"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle2, Info, ExternalLink } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function GoogleAuthPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const success = searchParams.get("success")
    const error = searchParams.get("error")
    const info = searchParams.get("info")

    if (success) {
      setStatus({ success: true, message: "تم إعادة المصادقة بنجاح" })
    } else if (error) {
      setStatus({ success: false, message: "حدث خطأ أثناء إعادة المصادقة" })
    } else if (info === "service-account") {
      setStatus({
        success: true,
        message: "النظام يستخدم Service Account. لا حاجة لإعادة المصادقة اليدوية.",
      })
    }
  }, [searchParams])

  const handleReauth = () => {
    setStatus({
      success: true,
      message:
        "النظام يستخدم Google Service Account. الاتصال دائم ولا يحتاج إعادة مصادقة. تأكد من أن ملف credentials.json موجود وصحيح.",
    })
  }

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/google-sheets/test")
      const result = await response.json()
      setStatus(result)
    } catch (error) {
      setStatus({ success: false, message: "فشل في الاتصال بالخادم" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6 text-blue-500" />
            إعدادات Google Sheets
          </CardTitle>
          <CardDescription>التحقق من اتصال Google Sheets وتفعيل الخدمات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong className="block mb-2">⚠️ خطوات مهمة قبل الاستخدام</strong>
              <p className="text-sm mb-3">
                إذا ظهر خطأ "The caller does not have permission"، يجب تفعيل الخدمات التالية في Google Cloud Console:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  اذهب إلى{" "}
                  <a
                    href="https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=medical-rose-smile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Google Sheets API
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  اذهب إلى{" "}
                  <a
                    href="https://console.cloud.google.com/apis/library/drive.googleapis.com?project=medical-rose-smile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Google Drive API
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>انقر على "تفعيل" (Enable) لكل خدمة</li>
                <li>انتظر دقيقة واحدة حتى يتم تفعيل الخدمات</li>
                <li>ارجع هنا واختبر الاتصال</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong className="block mb-2">معلومات Service Account</strong>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>النظام يستخدم Google Service Account للاتصال بـ Google Sheets</li>
                <li>
                  Service Account Email:{" "}
                  <code className="text-xs bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">
                    rosesmile-sheets-connectorv0@medical-rose-smile.iam.gserviceaccount.com
                  </code>
                </li>
                <li>المشروع: medical-rose-smile</li>
                <li>الاتصال دائم ولا يحتاج إعادة مصادقة يدوية</li>
              </ul>
            </AlertDescription>
          </Alert>

          {status && (
            <Alert variant={status.success ? "default" : "destructive"}>
              {status.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertDescription>
                <strong>{status.success ? "✓ متصل" : "✗ غير متصل"}:</strong> {status.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button onClick={testConnection} disabled={loading} variant="outline" className="w-full bg-transparent">
              {loading ? "جاري الاختبار..." : "اختبار الاتصال"}
            </Button>

            <Button
              onClick={() =>
                window.open("https://console.cloud.google.com/apis/dashboard?project=medical-rose-smile", "_blank")
              }
              variant="secondary"
              className="w-full"
            >
              <ExternalLink className="ml-2 h-4 w-4" />
              فتح Google Cloud Console
            </Button>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>كيفية منح الصلاحيات:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>افتح Google Sheet المراد ربطه</li>
              <li>انقر على "مشاركة" في الزاوية العلوية</li>
              <li>
                أضف البريد:{" "}
                <code className="text-xs">rosesmile-sheets-connectorv0@medical-rose-smile.iam.gserviceaccount.com</code>
              </li>
              <li>اختر صلاحية "محرر" (Editor)</li>
              <li>انقر على "إرسال"</li>
            </ol>
          </div>

          <Button variant="ghost" onClick={() => router.push("/dashboard/booking-forms")} className="w-full">
            العودة إلى نماذج الحجز
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
