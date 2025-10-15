"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, ExternalLink, Key, Shield, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GoogleSetupPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">دليل إعداد Google Sheets API</h1>
        <p className="text-muted-foreground">كل ما تحتاج معرفته لإنشاء وربط Google Sheets بالموقع بنجاح</p>
      </div>

      {/* Current Setup Status */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            الإعداد الحالي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">مكتبة googleapis مثبتة</p>
              <p className="text-sm text-muted-foreground">النظام يستخدم مكتبة googleapis الرسمية من Google</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Service Account موجود</p>
              <p className="text-sm text-muted-foreground">
                البريد: rosesmile-sheets-connectorv0@medical-rose-smile.iam.gserviceaccount.com
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">المشروع: medical-rose-smile</p>
              <p className="text-sm text-muted-foreground">مشروع Google Cloud موجود ومُعرّف</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What is Required */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            المتطلبات الأساسية لنجاح إنشاء Google Sheets
          </CardTitle>
          <CardDescription>يجب توفر هذه المتطلبات لكي يعمل النظام بشكل صحيح</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">1. تفعيل Google APIs المطلوبة</h3>
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">يجب تفعيل API التاليين في مشروع Google Cloud:</p>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li>
                      <strong>Google Sheets API</strong> - لإنشاء وتعديل جداول البيانات
                    </li>
                    <li>
                      <strong>Google Drive API</strong> - لمنح الصلاحيات ومشاركة الملفات
                    </li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link
                  href="https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=medical-rose-smile"
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  تفعيل Sheets API
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link
                  href="https://console.cloud.google.com/apis/library/drive.googleapis.com?project=medical-rose-smile"
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  تفعيل Drive API
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">2. Service Account Credentials</h3>
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p>النظام يستخدم Service Account للمصادقة مع Google APIs. الملف الحالي يحتوي على:</p>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li>Private Key (المفتاح الخاص)</li>
                    <li>Client Email (بريد Service Account)</li>
                    <li>Project ID (معرف المشروع)</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">3. الصلاحيات المطلوبة (Scopes)</h3>
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p>النظام يطلب الصلاحيات التالية:</p>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    <div>https://www.googleapis.com/auth/spreadsheets</div>
                    <div>https://www.googleapis.com/auth/drive</div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            كيف يعمل النظام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold">عند إنشاء نموذج حجز جديد:</h3>
            <ol className="list-decimal list-inside space-y-2 mr-4">
              <li>النظام يستخدم googleapis library للاتصال بـ Google</li>
              <li>يتم المصادقة باستخدام Service Account credentials</li>
              <li>يتم إنشاء Google Sheet جديد باسم النموذج</li>
              <li>يتم إضافة صف رأس (Header) بالعربية مع تنسيق ملون</li>
              <li>يتم منح صلاحيات الكتابة للجميع (anyone can write)</li>
              <li>يتم حفظ معرف الـ Sheet في قاعدة البيانات</li>
              <li>عند إرسال حجز، يتم إضافة البيانات تلقائياً إلى الـ Sheet</li>
            </ol>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-semibold mb-2">مثال على الكود المستخدم:</h4>
            <pre className="text-xs overflow-x-auto">
              {`const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
  ]
})

const sheets = google.sheets({ version: 'v4', auth })
const drive = google.drive({ version: 'v3', auth })

// Create spreadsheet
const response = await sheets.spreadsheets.create({
  requestBody: {
    properties: { title: sheetName }
  }
})`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-6 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            حل المشاكل الشائعة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">خطأ: "The caller does not have permission"</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>السبب:</strong> Google Sheets API أو Drive API غير مفعّل
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>الحل:</strong> اذهب إلى الروابط أعلاه وفعّل الـ APIs المطلوبة
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">خطأ: "API has not been used in project"</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>السبب:</strong> الـ API غير مفعّل في المشروع
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>الحل:</strong> انقر على "Enable" في صفحة الـ API في Google Cloud Console
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">خطأ: "Invalid credentials"</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>السبب:</strong> ملف credentials غير صحيح أو منتهي الصلاحية
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>الحل:</strong> قم بإنشاء Service Account جديد وتحديث الملف
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button asChild size="lg">
          <Link href="/dashboard/booking-forms">الذهاب إلى نماذج الحجز</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard/google-auth">اختبار الاتصال</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link
            href="https://console.cloud.google.com/apis/dashboard?project=medical-rose-smile"
            target="_blank"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Google Cloud Console
          </Link>
        </Button>
      </div>
    </div>
  )
}
