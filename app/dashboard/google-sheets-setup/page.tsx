"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Copy, ExternalLink, RotateCcw, Database, FileText, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function GoogleSheetsSetupPage() {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [resetting, setResetting] = useState(false)
  const [showSqlScript, setShowSqlScript] = useState(false)
  const { toast } = useToast()

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/diagnose-sheets")
      const data = await response.json()

      if (!data.success) {
        console.log("[v0] فشل التشخيص:", data)
      }

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

  const handleResetCredentials = async () => {
    if (
      !confirm(
        "هل أنت متأكد من رغبتك في إعادة تعيين بيانات اعتماد Google؟\nسيتعين عليك تحديث المتغيرات البيئية يدويًا في Vercel.",
      )
    ) {
      return
    }

    setResetting(true)
    try {
      const response = await fetch("/api/google-sheets/reset-credentials", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        alert(
          `✅ إعادة التعيين مكتملة!\n\nخطوات المتابعة:\n${Object.entries(data.instructions)
            .map(([, v]: any) => `• ${v}`)
            .join("\n")}`,
        )
      } else {
        alert("❌ فشل: " + data.message)
      }
    } catch (error) {
      alert("❌ خطأ: " + (error instanceof Error ? error.message : "خطأ غير معروف"))
    } finally {
      setResetting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleCopySqlScript = () => {
    const sqlScript = `-- سكريبت إعداد سريع لـ Google Sheets
-- ═══════════════════════════════════════════════════════════
-- الخيار 1: عرض جميع نماذج الحجز مع معلوماتها
-- ═══════════════════════════════════════════════════════════
SELECT 
  id,
  name_ar AS "اسم النموذج",
  name_en AS "Form Name",
  is_active AS "نشط؟",
  is_main AS "رئيسي؟",
  google_sheet_id AS "معرف Google Sheet",
  CASE 
    WHEN google_sheet_id IS NULL THEN 'لا يوجد'
    ELSE 'موجود'
  END AS "حالة الربط",
  (SELECT COUNT(*) FROM bookings WHERE booking_form_id = booking_forms.id) AS "عدد الحجوزات",
  created_at AS "تاريخ الإنشاء"
FROM booking_forms
ORDER BY id DESC;

-- ═══════════════════════════════════════════════════════════
-- الخيار 2: إزالة روابط Google Sheets من جميع النماذج
-- ═══════════════════════════════════════════════════════════
-- UPDATE booking_forms SET google_sheet_id = NULL, updated_at = NOW();

-- ═══════════════════════════════════════════════════════════
-- الخيار 3: ربط نموذج محدد بـ Google Sheet جديد
-- ═══════════════════════════════════════════════════════════
-- UPDATE booking_forms 
-- SET google_sheet_id = 'YOUR_SHEET_ID', updated_at = NOW()
-- WHERE id = YOUR_FORM_ID;`
    
    navigator.clipboard.writeText(sqlScript)
    toast({
      title: "تم النسخ",
      description: "تم نسخ السكريبت إلى الحافظة",
    })
  }

  const serviceAccountEmail = "rosesmile-svc@rosesmile-booking.iam.gserviceaccount.com"
  const sheetId = "1aULNHz7f3WC33mWYWMCzt8BL2Mc0O3NR00tpFRaIFBU"
  const folderId = "1CB4LrRziHAjoHFj6b_sEaj2HtWXcBZyN"
  const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCjQWjDQs1LNPwd
TwHlirG2WRzY20fcMeQdREYAJYIbFRnPnrVUkJEj8qHrvh/idYJs3pMNxaaLPxL1
0I0ePk0F44D9E4SetL0LXdHdOpcD5sZcBZmcYz0qkWxu2k1TM07ve5ZavZUQ+HBV
fyaf182HU9JVKqw/C9yiCydu8rn1tWO3MvEqIsy36vVtf+cUy1ZEejM/WJ5qDM0e
Psk/nCHQ9STMQGxoicwEBLJ7rGAF7Z/xhvRYuqBBSWI4KkB+78RqwzGa0gBrvmjP
qze3/uEcDdCSI9Et6jgltzRyk3GzU8/7ToYZQrJ3VtVqBYZ6lwfas9Kt4n0VaBJh
Mm+aljHrAgMBAAECggEATzdndsv84r/gj/Ys5O1yQxmlikKI8XtSBbOBxgNtSOfp
wNlxgomtq8RJtqLoRNIhSeOMdpPQNuQRtq6OMz0m0bMtfV/Rq9LmolPRiCgsbAu4
d6GOApkS7otnErkh6TvN0x3kfL5eTUBH/ex3WPt1svNE7eeJcgQ2+HgyF7925Zbq
ysKVj28YW0LV3i9xKOclKkFL7PTFBWpXUM9W6uS6+D/N2xflHtb7LNuuTWdwD0uH
zg+emQi50cWLZZj6uEItS9wtF/XZClyCbGBC5hoIjFrKoK1VbxA7j78tXmDy0fOd
PEFZEzz7/Ryy7x47t1tG+THDO4Yl6ArYBud2g2bm8QKBgQDROLXB9JukvqWWl3iS
ay58QrhdvHHckMdX2feElJYmfdiY1c8E4Ty/bJwEvf6FKfjzTHCXMa67eMN7Ud4u
/l3VExEQjNsLVbE7YNZVVzH67Zr+izUCPXYIKHlgZqe90ZTMWgITmgNKiMuT4+jQ
s/04lQqhx9V/dQTvxYcfuCGbsQKBgQDHwbmkjGmRwiRJg9RnBroNl+CbwuMBilH5
aMnsy1sSxV+pCWg+34jD7oZxZWMCMtc403ooIPQx8smihzitS6xQoPgGdrO+CIK6
YW0xDsgWhALf6O4barkJIpm7eyCilCiyDv5sE4syWVccSQF/a5HAtqzzdyDPk/GU
JFRKSWn6WwKBgB56X2foxT+jkiW03RifSn9JjOgCyqdx48g1dWw35QOoc4QYKXcx
hJLyNGwwbUJi0eRHb2NnFmgy+G8fhvlbjrm6dFLv4fztt8rJmY+HCz3dnSWVi9xO
rcIUe1ICwk7RmBaIyiKm3fHeqaFaoxC8F5hFhe35WW2e02BGax/AyAyRAoGBAKoW
ZzcYJA/rajB6otHy5VsLtkGKqPY3y+L9eeo5oVuTWge5rdzTQ0XqBOnrNWm61o1Z
bItcu/EH1O6iCv1sENY6qdX/Hr8xyfZfXLVH69FYKIZ1dME9lz6TCqmbhsdINnqe
z75AyeZeMhEwjKjtdBbOtOc9yV9Wjn3gjTEP38A/AoGBAKMribERjf134k6JZkHr
Eh7XK4z8Jb5hzMiADJOtgSYR6+/ed29D9uVaJMHeV7vzhdmK0bUik8T+qN+MxnSJ
DK1XzFQW/RLlSjqQu6cJnUAF/a9QF2XUaiekTZiPBW3PSPQPvhMvoI8eLqxnl532
4vZD2u7y0D1WbvfekEyooR0t
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
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button onClick={handleTest} disabled={testing} className="flex-1">
              {testing ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                "اختبار الاتصال"
              )}
            </Button>
            <Button
              onClick={handleResetCredentials}
              disabled={resetting}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              {resetting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  إعادة مصادقة
                </>
              )}
            </Button>
          </div>

          {testResult && (
            <Alert className={`${testResult.success ? "border-green-500" : "border-red-500"}`}>
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    <p className="font-semibold mb-2">{testResult.message}</p>

                    {!testResult.success && testResult.details && (
                      <div className="mt-3 space-y-3">
                        {testResult.details.errorCode && (
                          <div className="text-sm">
                            <span className="font-semibold">رمز الخطأ:</span>{" "}
                            <code className="bg-red-100 px-2 py-1 rounded">{testResult.details.errorCode}</code>
                          </div>
                        )}

                        {testResult.details.error && (
                          <div className="text-sm bg-red-50 p-3 rounded border border-red-200">
                            <p className="font-semibold text-red-800 mb-1">تفاصيل الخطأ:</p>
                            <p className="text-red-700 font-mono text-xs">{testResult.details.error}</p>
                          </div>
                        )}

                        {testResult.details.solution && (
                          <div className="text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
                            <p className="font-semibold text-yellow-800 mb-2">الحل المقترح:</p>
                            <div className="text-yellow-700 whitespace-pre-line">{testResult.details.solution}</div>
                          </div>
                        )}

                        {(testResult.details.errorCode === 403 || testResult.message.includes("صلاحيات")) && (
                          <div className="text-sm bg-blue-50 p-3 rounded border border-blue-200">
                            <p className="font-semibold text-blue-800 mb-2">خطوات إضافية:</p>
                            <ol className="list-decimal list-inside space-y-1 text-blue-700 mr-2">
                              <li>تأكد من تفعيل Google Sheets API و Google Drive API في مشروع rosesmile-booking</li>
                              <li>تحقق من أن المتغيرات البيئية تم إضافتها بشكل صحيح في Vercel</li>
                              <li>أعد نشر المشروع في Vercel بعد إضافة المتغيرات</li>
                              <li>انتظر 2-3 دقائق حتى تصبح التغييرات نافذة</li>
                            </ol>
                            <div className="mt-3 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    "https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=rosesmile-booking",
                                    "_blank",
                                  )
                                }
                              >
                                <ExternalLink className="ml-1 h-3 w-3" />
                                تفعيل Sheets API
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    "https://console.cloud.google.com/apis/library/drive.googleapis.com?project=rosesmile-booking",
                                    "_blank",
                                  )
                                }
                              >
                                <ExternalLink className="ml-1 h-3 w-3" />
                                تفعيل Drive API
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

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
                                اضغط على زر <strong>"إعادة مصادقة"</strong> أعلاه للحصول على التعليمات
                              </li>
                              <li>
                                أو اذهب إلى{" "}
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

          {/* GOOGLE_FOLDER_ID */}
          <div className="space-y-2">
            <Label>GOOGLE_FOLDER_ID</Label>
            <div className="flex gap-2">
              <Input value={folderId} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(folderId)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              معرف المجلد لحفظ جميع جداول الحجوزات فيه. تأكد من مشاركة المجلد مع Service Account كمحرر.
            </p>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs"
              onClick={() => window.open(`https://drive.google.com/drive/folders/${folderId}`, "_blank")}
            >
              <ExternalLink className="ml-1 h-3 w-3" />
              فتح المجلد في Google Drive
            </Button>
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

            {/* Share Folder with Service Account */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">شارك المجلد مع Service Account</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  افتح المجلد في Google Drive وشاركه مع البريد الإلكتروني التالي بصلاحية "محرر":
                </p>
                <code className="text-xs bg-muted p-2 rounded block break-all">{serviceAccountEmail}</code>
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ مهم: يجب مشاركة المجلد مع Service Account حتى يتمكن النظام من حفظ الجداول الجديدة فيه تلقائياً
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 p-0 h-auto"
                  onClick={() => window.open(`https://drive.google.com/drive/folders/${folderId}`, "_blank")}
                >
                  <ExternalLink className="ml-1 h-3 w-3" />
                  فتح المجلد في Google Drive
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">أضف المتغيرات البيئية في Vercel</h3>
                <p className="text-sm text-muted-foreground">
                  اذهب إلى إعدادات المشروع في Vercel → Environment Variables وأضف المتغيرات الأربعة أعلاه (بما في ذلك GOOGLE_FOLDER_ID)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">أعد نشر المشروع</h3>
                <p className="text-sm text-muted-foreground">
                  بعد إضافة المتغيرات، تأكد من تفعيل Google Sheets API و Google Drive API في مشروع rosesmile-booking، ثم أعد نشر المشروع من Vercel
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold mb-1">اختبر الاتصال</h3>
                <p className="text-sm text-muted-foreground">
                  استخدم زر "اختبار الاتصال" أعلاه للتحقق من أن كل شيء يعمل بشكل صحيح
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                <Database className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">سكريبت SQL للإعداد السريع</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  إذا كنت تواجه مشاكل في الربط، يمكنك استخدام هذا السكريبت لإدارة النماذج مباشرة من قاعدة البيانات
                </p>
                <Button
                  onClick={() => setShowSqlScript(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  عرض سكريبت SQL
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSqlScript} onOpenChange={setShowSqlScript}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              سكريبت إعداد Google Sheets السريع
            </DialogTitle>
            <DialogDescription>
              انسخ هذا السكريبت وشغّله في Supabase SQL Editor
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-slate-50 font-mono whitespace-pre text-right" dir="rtl">
{`-- سكريبت إعداد سريع لـ Google Sheets

-- ═══════════════════════════════════════════════════════════
-- الخيار 1: عرض جميع نماذج الحجز مع معلوماتها
-- ═══════════════════════════════════════════════════════════
SELECT 
  id,
  name_ar AS "اسم النموذج",
  name_en AS "Form Name",
  is_active AS "نشط؟",
  is_main AS "رئيسي؟",
  google_sheet_id AS "معرف Google Sheet",
  CASE 
    WHEN google_sheet_id IS NULL THEN 'لا يوجد'
    ELSE 'موجود'
  END AS "حالة الربط",
  (SELECT COUNT(*) FROM bookings WHERE booking_form_id = booking_forms.id) AS "عدد الحجوزات",
  created_at AS "تاريخ الإنشاء"
FROM booking_forms
ORDER BY id DESC;

-- ═══════════════════════════════════════════════════════════
-- الخيار 2: إزالة روابط Google Sheets من جميع النماذج
-- ═══════════════════════════════════════════════════════════
-- أزل التعليق (--) من السطر التالي لتنفيذه:
-- UPDATE booking_forms SET google_sheet_id = NULL, updated_at = NOW();

-- ═══════════════════════════════════════════════════════════
-- الخيار 3: ربط نموذج محدد بـ Google Sheet جديد  
-- ═══════════════════════════════════════════════════════════
-- استبدل YOUR_FORM_ID بمعرف النموذج و YOUR_SHEET_ID بمعرف الجدول:
-- UPDATE booking_forms 
-- SET google_sheet_id = 'YOUR_SHEET_ID', updated_at = NOW()
-- WHERE id = YOUR_FORM_ID;

-- ═══════════════════════════════════════════════════════════
-- الخيار 4: عرض آخر 20 حجز مع معلومات النموذج
-- ═══════════════════════════════════════════════════════════
SELECT 
  b.id AS "رقم الحجز",
  b.patient_name AS "اسم المريض",
  b.phone AS "الهاتف",
  b.service_name AS "الخدمة",
  b.preferred_date AS "التاريخ",
  b.status AS "الحالة",
  bf.name_ar AS "نموذج الحجز",
  b.created_at AS "تاريخ الإنشاء"
FROM bookings b
LEFT JOIN booking_forms bf ON b.booking_form_id = bf.id
ORDER BY b.created_at DESC
LIMIT 20;`}
              </pre>
            </div>
          </div>

          <div className="flex gap-3 justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button
                onClick={handleCopySqlScript}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 ml-2" />
                نسخ السكريبت
              </Button>
              <Button
                onClick={() => window.open('https://supabase.com/dashboard/project/ynspnyjdpjjdeqggmac/sql', '_blank')}
                variant="outline"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 ml-2" />
                فتح Supabase SQL Editor
              </Button>
            </div>
            <Button
              onClick={() => setShowSqlScript(false)}
              variant="secondary"
              size="sm"
            >
              إغلاق
            </Button>
          </div>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>كيفية الاستخدام</AlertTitle>
            <AlertDescription className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1">
                <li>انسخ السكريبت باستخدام زر "نسخ السكريبت"</li>
                <li>افتح Supabase SQL Editor من الرابط أعلاه</li>
                <li>الصق السكريبت في المحرر</li>
                <li>اختر الخيار المناسب من السكريبت (الخيار 1 لعرض النماذج)</li>
                <li>شغّل السكريبت بالضغط على زر "Run"</li>
              </ol>
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    </div>
  )
}
