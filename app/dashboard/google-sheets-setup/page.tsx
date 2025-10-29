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

  const serviceAccountEmail = "v0-rosesmile-vercel@v0-rosesmile-vercel.iam.gserviceaccount.com"
  const sheetId = "1aULNHz7f3WC33mWYWMCzt8BL2Mc0O3NR00tpFRaIFBU"
  const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvzwRUgI1+meh1
VdEz6JrFe/DhADWmW6JmQKy42pcMXPE16g0/1T46vrKp6g3+BZg2062ZAInCIJ9h
KN25nxZsiAAO5T1E1qswoStTfdm2xFxNReozdZZdBwLvdFnz7h0DfD8g4FRwt4aw
bdd/b59zJCavh3iu38WwekpsPmYjeiqD41SkBmMG/w/5TWYpEDrBb0czuusjFyIF
GrS/HmLLaeaD9LmMQMoLU/+M5crbDBOn8feV7W2aFRlKVIc7h+EHGYTkVZitWUK2
SfRCu5M7ECtwY7xbWKVLxLcj+GI1Jtceq7mzsAg8GePwov+A9+Cy7aB2qxbbm/6d
/6Yuffl1AgMBAAECggEABOuoHR5Y93diym/rskZ7GHZi1EVPexe6+J4sR2M00Y+D
X8UseEIlYvsF4JwQprCs5THw/KSHdoO3uj4s0H5rn/+BculHGPdiJLMKFaTi1Er0
I2SGzMhofDOPSTjqMJnUPY37bVXh/yKf1i3I14P+BDi5jXWe8tQIAiu2DAgGD02W
5Wv3sJxltjZzaLujeLbSFBaM3wFx2VpkL7CVknvwHemdaV8bzKdDlMpiJthrBU+X
90si8XeoKFxkHT1qd3vLCMRO7m8OHOP4TBgUOkRYKWRAVsmu1hIBim+2dhEb72+8
B1veMPm/oW771Ehp4M3cIFc3/TGFQX/6otahQbBmYQKBgQDUk5QlC/bpgu9urec0
bTuLdMV4Mpjoiz5Wt35TtJPrCCzjxxacsBF015TI1Is9QjC8BHCWTPl2/9UpFSH/
zZ9/tfUfxZm/CWJEzvBfP9iW327q9zOa9X9ol6qL57z4NBeRXDX6HIG5KrXvK9me
BKVOkqPxGdSnp6YIJgii6fdv4QKBgQDTuLYH6UapwXKZxGWSlB5D6mzku+774yT1
BbJBJAKny17hUD9DGYP7axcLSHJMUVkNnUfGmIbf4raA64lzPbiTe5emOp01cq+u
lgjnECKsSJdYZ1IHH70Hd4ejZeIFeZYrH889DEAxhjEVE3fi5ztyhWzqGPjYOVYR
/RvzI1tMFQKBgQCGv9HtterbVMN/rj7cDc3r9aZjLfedmP54K7KpTtNg7fq+nGnq
AvXd0fYfZBOrTjTkShAwRjTwSPWPKDU4GNjdNLNgY3q1DTa8lUzro+YgpRuDWBXf
SXVtEI7sRoaT8zlpTEFu/PkCLl/Lb0lwEFPVPcEsSQpzCCOIEMvysUrHIQKBgHJ2
Tvsx88D8058sHZnEOCSRjXOP4uEM6UMKZFdxR3o9qbr4LmtxVPhM6jVwYlK+O/3v
RQmqFmjd4bsLG9FQ0gPx8oes8qcdrLsfZAq/n28zA5eIrEEruH9b8Nm20B4ToMsJ
tHmVsPLVUJ3LW6oxRuNgHQTmoUoMnWq2QzEMsWQNAoGAIyjGEVguE+2QWOy9b7Sv
63A4npwOluZ1+9DWr6ecKMlnDeCjL2abczGkWyC49pGp0zZVQd/CY9te7pLHz2NF
JSGcR4H6y4y3RiwWGB1zRvnWfPp/O9OTau9zLVdL776DkIWwNIQ3szrA4RbxW90P
JmrPms64gLMlsO/pAPeDrwI=
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
                        {/* </CHANGE> */}
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
          {/* </CHANGE> */}

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
