"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function FixPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const addPasswordColumn = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/railway/add-password", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
        // إعادة التوجيه بعد 2 ثانية
        setTimeout(() => {
          window.location.href = "/dashboard/users"
        }, 2000)
      } else {
        setResult({ success: false, message: data.error })
      }
    } catch (error: any) {
      setResult({ success: false, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">إصلاح جدول المستخدمين</CardTitle>
          <CardDescription>إضافة عمود كلمة المرور إلى جدول profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            <p className="font-semibold mb-2">المشكلة:</p>
            <p>عمود "password" مفقود من جدول profiles</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">الحل:</p>
            <p>سيتم إضافة عمود password إلى الجدول تلقائياً</p>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <Button onClick={addPasswordColumn} disabled={loading || result?.success} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الإصلاح...
              </>
            ) : result?.success ? (
              <>
                <CheckCircle2 className="ml-2 h-4 w-4" />
                تم الإصلاح بنجاح
              </>
            ) : (
              "إضافة عمود كلمة المرور"
            )}
          </Button>

          {result?.success && (
            <p className="text-sm text-center text-muted-foreground">سيتم تحويلك إلى صفحة المستخدمين...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
