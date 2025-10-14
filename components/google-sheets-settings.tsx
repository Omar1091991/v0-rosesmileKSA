"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export function GoogleSheetsSettings() {
  const [credentials, setCredentials] = useState("")
  const [spreadsheetId, setSpreadsheetId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleVerify = async () => {
    setIsLoading(true)
    setStatus(null)

    try {
      const response = await fetch("/api/google-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credentials,
          spreadsheetId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: "success",
          message: "تم التحقق من الاتصال بنجاح! يمكنك الآن حفظ الإعدادات في متغيرات البيئة.",
        })
      } else {
        setStatus({
          type: "error",
          message: data.error || "فشل التحقق من الاتصال",
        })
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "حدث خطأ أثناء التحقق من الاتصال",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات Google Sheets</CardTitle>
        <CardDescription>قم بإعداد تكامل Google Sheets لحفظ الحجوزات تلقائياً</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="credentials">بيانات الاعتماد (Service Account JSON)</Label>
          <Textarea
            id="credentials"
            placeholder='{"type":"service_account","project_id":"...","private_key":"..."}'
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            rows={8}
            className="font-mono text-sm"
            dir="ltr"
          />
          <p className="text-xs text-muted-foreground">الصق محتوى ملف JSON الخاص بـ Service Account هنا</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spreadsheetId">معرف Google Sheet</Label>
          <Input
            id="spreadsheetId"
            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            dir="ltr"
          />
          <p className="text-xs text-muted-foreground">المعرف من رابط Google Sheet (الجزء بين /d/ و /edit)</p>
        </div>

        {status && (
          <Alert variant={status.type === "success" ? "default" : "destructive"}>
            {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button onClick={handleVerify} disabled={isLoading || !credentials || !spreadsheetId} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              "اختبار الاتصال"
            )}
          </Button>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="text-sm font-semibold">ملاحظة مهمة:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>بعد التحقق من الاتصال، احفظ البيانات في متغيرات البيئة في Vercel</li>
              <li>المتغيرات المطلوبة: GOOGLE_SHEETS_CREDENTIALS و GOOGLE_SHEETS_SPREADSHEET_ID</li>
              <li>تأكد من مشاركة Google Sheet مع البريد الإلكتروني للـ Service Account</li>
              <li>يجب أن يكون اسم الورقة "الحجوزات" بالضبط</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
