"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GoogleAuthPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const router = useRouter()

  const handleReauth = () => {
    setLoading(true)
    // توجيه المستخدم إلى صفحة OAuth
    window.location.href = "/api/google-auth"
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
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            إعادة المصادقة مع جوجل
          </CardTitle>
          <CardDescription>إعادة إعداد الاتصال مع خدمات جوجل</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <strong className="block mb-2">تحذير مهم</strong>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>هذا الإجراء سيتطلب في تحديث الاتصال مع خدمات جوجل الحالي</li>
                <li>قد تحتاج إلى منح صلاحيات الوصول مرة أخرى</li>
                <li>يرجى عدم تكرار هذا الإجراء إلا عند الضرورة القصوى</li>
                <li>تأكد من وجود نسخة احتياطية من البيانات المهمة</li>
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
              {loading ? "جاري الاختبار..." : "اختبار الاتصال الحالي"}
            </Button>

            <Button onClick={handleReauth} disabled={loading} className="w-full">
              <ExternalLink className="ml-2 h-4 w-4" />
              {loading ? "جاري إعادة المصادقة..." : "إعادة المصادقة مع جوجل"}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>ملاحظة:</strong> بعد النقر على الزر أعلاه، سيتم فتح صفحة مصادقة جوجل في نافذة جديدة.
            </p>
            <p>اتبع التعليمات لإكمال عملية المصادقة.</p>
            <p className="text-xs">
              البريد الإلكتروني المستخدم: <strong>omar1091991@gmail.com</strong>
            </p>
          </div>

          <Button variant="ghost" onClick={() => router.back()} className="w-full">
            العودة إلى الصفحة السابقة
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
