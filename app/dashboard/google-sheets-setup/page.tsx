"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Copy, ExternalLink } from "lucide-react"

export default function GoogleSheetsSetupPage() {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/diagnose-sheets")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        message: "فشل الاتصال بالخادم",
        error: error instanceof Error ? error.message : "خطأ غير معروف",
      })
    } finally {
      setTesting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const serviceAccountEmail = "v0-rosesmile2@v0-rosesmile2.iam.gserviceaccount.com"
  const sheetId = "1aULNHz7f3WC33mWYWMCzt8BL2Mc0O3NR00tpFRaIFBU"
  const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDrgbTWhJKzX9sj
xvzamgSfG/NVIoBQkbkelP6f16DxiKcGd7kXfX5pFcyH2C+TyxRnlH7vrqt8U+Xn
gq+mkuwQ1AYiARqakAsvlu/PHcR/JA+CySpzC0RsOB93Zfczt1NjZD1hGnd/frAQ
vN8MSAjNfKoa04rq3SmAblo/scr4ten7qwF4T/9yrmIx5/BoyoFO2Vs1CzmXD1H/
/6OHNA+uekZmoqAx0dYvMV5s6XvK2rLeObHuD1RySjo59Mqja5AMGpNWPWvph+Ej
0lGwVhjvwLwx4Qy+wSwxi8m4fVFaER0Y2TexDcLg1J/jsrPmICNx32HouAgTmjsF
Qb3+5oFZAgMBAAECggEABXOKKREGiEpmuyxG/BRmmPw/pK/YwoStAU03m6GVIyIj
o52v1iBchbgwdNCHQWeJAGDKk2e6pnUWtEYtJLDv7+/IeI8H+53r9F0NDgFFZCAE
j+VyKxmOquadq9jbYQIUVw+h8BZ5v6TCFJEapKEiOwdwtJBC/e7CoCttwV2vMhSQ
h5y/k2kAQ3Vxnj9AF0wc2UPWfbAvj7L/Qy9UMpJTHC0D8qJqukR/hI5l2JCW/5Ol
daenPzpqYK+uuxhAEmnq7UmZCXszQ3bWE4yMf4xSb2yIepWuVZfrwLPXrmbW9YyV
F9yWfVJIvDmdzwyXYRhKBZ23vVrs2Fp4b1n9U0ESpQKBgQD9Eaxfan9ETOxNm8ui
Wi0johL9ZSpBQuu7IGgxZCOBEqZxIY9uyYeWsAecRzv1I+SIxf/rrdV7byKxzMka
gdFAKmhSQXbNiA9jl26s9yqcBneT4FPxNvktV1BRJESjnGs9SocrWWSFd7sk2Hrp
optbP+3Ay26l0CoMnsSEWobcPwKBgQDuO/ZVE0lx/9Z8l1Bkk+VmN7ZgQSrXnBpQ
eOOofhqROWwyey758MYmV9uOrvhbl38ElJQTDdNPzEyWo65xv7omKiwKOQSYMYcU
r+QOrz5kJbSAY2mDmvnjaLqlmFozKOJZO+VPsM0syWYW3DyclZbRqUwFgsOyX+eG
sFTyjjMcZwKBgQCqGAPkif8KWC2HqEyBTd0DEz9yQ1nYTXOF7a06bVUTvwZSCb2P
ODNDDAPBfXuGM966M2Lk9I0Fjtgh60PL5i9P0nEVwFxqnqXBSZog9WwVPJ+IrAGf
olRurj4Um6zqzwqhQoOBlm7i6mvFwx8yA5IqDdjueY1gM37fxqLNVs9IHwKBgQCL
o535s/pi1cDU+qRmr8HQrms59Di2dIuAC7v1cSUFZpEi7c1VN2oN44WQFsMAfMY4
2xYILRxlM6zYx0xi5CyqXiG+RDmLM8yntYmJifKaJPeuIZchSt+aCjMNCUYlops6
Dr+UfF9nFw297I2igpQKhJ9Iw6MNlOVSr1y7Z9pRlQKBgHEf+jrdGQvm7BwEmrwy
GAV4Ne6hrVX9DzzkX9VDH5AuhkRmI0rcs1VDfeT05T/sTfDvDaQJS59EUiC5B4f2
vcV6CRqnntsLtfoKL3J+8Kik+Azh9IOjQDPKK33rpYkjNr99xiUevy3zMy9o6N4s
TPehuVjQfxC9HOTF5LYOeHJz
-----END PRIVATE KEY-----`

  return (
    <div className="container mx-auto p-6 max-w-4xl" dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">إعداد Google Sheets</h1>
        <p className="text-muted-foreground">قم بإعداد الربط مع Google Sheets لإرسال الحجوزات تلقائياً</p>
      </div>

      {/* Test Connection Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>اختبار الاتصال</CardTitle>
          <CardDescription>تحقق من أن جميع الإعدادات صحيحة والاتصال يعمل</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleTest} disabled={testing} className="w-full">
            {testing ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الاختبار...
              </>
            ) : (
              "اختبار الاتصال"
            )}
          </Button>

          {testResult && (
            <Alert className={`mt-4 ${testResult.success ? "border-green-500" : "border-red-500"}`}>
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    <p className="font-semibold mb-2">{testResult.message}</p>
                    {testResult.diagnostics && (
                      <div className="text-sm space-y-1 mt-2">
                        <p>✓ Sheet ID: {testResult.diagnostics.hasSheetId ? "موجود" : "غير موجود"}</p>
                        <p>✓ Service Email: {testResult.diagnostics.hasServiceEmail ? "موجود" : "غير موجود"}</p>
                        <p>✓ Private Key: {testResult.diagnostics.hasPrivateKey ? "موجود" : "غير موجود"}</p>
                        {testResult.diagnostics.privateKeyLength && (
                          <p className="text-xs text-muted-foreground">
                            طول المفتاح: {testResult.diagnostics.privateKeyLength} حرف
                          </p>
                        )}
                      </div>
                    )}
                    {testResult.error && (
                      <div className="mt-3">
                        <p className="text-sm text-red-600 font-mono bg-red-50 p-2 rounded">{testResult.error}</p>
                        {testResult.error.includes("invalid_grant") && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                            <p className="font-semibold text-yellow-800 mb-2">⚠️ حساب الخدمة غير موجود</p>
                            <p className="text-yellow-700 mb-2">
                              الخطأ "invalid_grant" يعني أن حساب الخدمة (Service Account) غير موجود في Google Cloud أو
                              تم حذفه.
                            </p>
                            <p className="font-semibold text-yellow-800 mb-1">الحل:</p>
                            <ol className="list-decimal list-inside space-y-1 text-yellow-700 mr-2">
                              <li>
                                اذهب إلى{" "}
                                <a
                                  href="https://console.cloud.google.com/iam-admin/serviceaccounts"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline font-semibold"
                                >
                                  Google Cloud Console - Service Accounts
                                </a>
                              </li>
                              <li>أنشئ Service Account جديد</li>
                              <li>أنشئ مفتاح JSON جديد</li>
                              <li>حدّث المتغيرات البيئية في Vercel بالقيم الجديدة</li>
                              <li>أعد نشر المشروع</li>
                            </ol>
                          </div>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Environment Variables Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>المتغيرات البيئية المطلوبة</CardTitle>
          <CardDescription>أضف هذه المتغيرات في إعدادات Vercel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GOOGLE_SHEET_ID */}
          <div className="space-y-2">
            <Label>GOOGLE_SHEET_ID</Label>
            <div className="flex gap-2">
              <Input value={sheetId} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(sheetId)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* GOOGLE_SERVICE_ACCOUNT_EMAIL */}
          <div className="space-y-2">
            <Label>GOOGLE_SERVICE_ACCOUNT_EMAIL</Label>
            <div className="flex gap-2">
              <Input value={serviceAccountEmail} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(serviceAccountEmail)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* GOOGLE_PRIVATE_KEY */}
          <div className="space-y-2">
            <Label>GOOGLE_PRIVATE_KEY</Label>
            <div className="flex gap-2">
              <textarea
                value={privateKey}
                readOnly
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(privateKey)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">انسخ المفتاح كما هو بالضبط (مع الأسطر الجديدة)</p>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>خطوات الإعداد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <p className="font-semibold text-blue-800 mb-2">📝 ملاحظة مهمة</p>
              <p className="text-sm text-blue-700">
                إذا كان حساب الخدمة (Service Account) غير موجود أو حصلت على خطأ "invalid_grant"، يجب عليك إنشاء Service
                Account جديد أولاً من{" "}
                <a
                  href="https://console.cloud.google.com/iam-admin/serviceaccounts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  Google Cloud Console
                </a>
                .
              </p>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">شارك Google Sheet مع Service Account</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  افتح Google Sheet وشاركه مع البريد الإلكتروني التالي بصلاحية "محرر":
                </p>
                <code className="text-xs bg-muted p-2 rounded block break-all">{serviceAccountEmail}</code>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 p-0 h-auto"
                  onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`, "_blank")}
                >
                  <ExternalLink className="ml-1 h-3 w-3" />
                  فتح Google Sheet
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">أضف المتغيرات البيئية في Vercel</h3>
                <p className="text-sm text-muted-foreground">
                  اذهب إلى إعدادات المشروع في Vercel → Environment Variables وأضف المتغيرات الثلاثة أعلاه
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">أعد نشر المشروع</h3>
                <p className="text-sm text-muted-foreground">
                  بعد إضافة المتغيرات، أعد نشر المشروع من Vercel لتطبيق التغييرات
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">اختبر الاتصال</h3>
                <p className="text-sm text-muted-foreground">
                  استخدم زر "اختبار الاتصال" أعلاه للتحقق من أن كل شيء يعمل بشكل صحيح
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
