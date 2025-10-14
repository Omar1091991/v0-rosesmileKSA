"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Database } from "lucide-react"

export default function RailwaySetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const setupDatabase = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log("[v0] بدء إعداد قاعدة البيانات...")

      const response = await fetch("/api/railway/setup", {
        method: "POST",
      })

      const data = await response.json()
      console.log("[v0] النتيجة:", data)

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "فشل في إعداد قاعدة البيانات")
      }
    } catch (err: any) {
      console.error("[v0] خطأ:", err)
      setError(err.message || "حدث خطأ غير متوقع")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Database className="h-16 w-16 text-blue-600" />
            </div>
            <CardTitle className="text-3xl">إعداد قاعدة بيانات Railway</CardTitle>
            <CardDescription className="text-lg">إنشاء جميع الجداول والبيانات الافتراضية تلقائياً</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!result && !error && (
              <Alert>
                <AlertDescription className="text-right">
                  <strong>ملاحظة:</strong> تأكد من إضافة متغير البيئة{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">DATABASE_URL</code> في إعدادات المشروع
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-right">
                  <strong>خطأ:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-right">
                  <strong>نجح!</strong> {result.message}
                  <div className="mt-4">
                    <p className="font-semibold mb-2">الجداول المنشأة ({result.tables?.length || 0}):</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.tables?.map((table: string) => (
                        <li key={table}>{table}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={setupDatabase} disabled={loading} className="w-full h-12 text-lg" size="lg">
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري الإعداد...
                </>
              ) : (
                <>
                  <Database className="ml-2 h-5 w-5" />
                  إنشاء قاعدة البيانات الآن
                </>
              )}
            </Button>

            {result && (
              <div className="text-center">
                <Button onClick={() => (window.location.href = "/dashboard")} variant="outline" className="w-full">
                  الانتقال إلى لوحة التحكم
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
