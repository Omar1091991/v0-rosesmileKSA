"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, FileSpreadsheet, Shield, Key, Database } from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

export default function GoogleSheetsGuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container max-w-5xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">دليل إعداد Google Sheets</h1>
              <p className="text-xl text-muted-foreground">
                تعرف على كيفية ربط نماذج الحجز بـ Google Sheets وتنسيق الجداول بشكل صحيح
              </p>
            </div>

            {/* Required Permissions */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle>الصلاحيات المطلوبة</CardTitle>
                </div>
                <CardDescription>تأكد من تفعيل هذه الخدمات في Google Cloud Console</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Google Sheets API</strong> - مطلوب لإنشاء وتعديل الجداول
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Google Drive API</strong> - مطلوب لإدارة الملفات والصلاحيات
                  </AlertDescription>
                </Alert>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-semibold">معلومات Service Account الحالي:</p>
                  <code className="text-sm block">
                    rosesmile-sheets-connectorv0@medical-rose-smile.iam.gserviceaccount.com
                  </code>
                  <p className="text-sm text-muted-foreground">Project ID: medical-rose-smile</p>
                </div>

                <div className="flex gap-2">
                  <Button asChild>
                    <a
                      href="https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=medical-rose-smile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      تفعيل Sheets API
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href="https://console.cloud.google.com/apis/library/drive.googleapis.com?project=medical-rose-smile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      تفعيل Drive API
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sheet Format */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                  <CardTitle>تنسيق Google Sheet المطلوب</CardTitle>
                </div>
                <CardDescription>يجب أن يحتوي الجدول على هذه الأعمدة بالترتيب</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>مهم:</strong> يجب إنشاء ورقة عمل باسم "الحجوزات" في Google Sheet
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">الأعمدة المطلوبة في ورقة "الحجوزات":</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-3 text-right">العمود</th>
                          <th className="border border-border p-3 text-right">الاسم بالعربية</th>
                          <th className="border border-border p-3 text-right">الاسم بالإنجليزية</th>
                          <th className="border border-border p-3 text-right">الوصف</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3 font-mono">A</td>
                          <td className="border border-border p-3">التاريخ والوقت</td>
                          <td className="border border-border p-3">Timestamp</td>
                          <td className="border border-border p-3">تاريخ ووقت الحجز</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-mono">B</td>
                          <td className="border border-border p-3">الاسم الكامل</td>
                          <td className="border border-border p-3">Full Name</td>
                          <td className="border border-border p-3">اسم المريض</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-mono">C</td>
                          <td className="border border-border p-3">رقم الجوال</td>
                          <td className="border border-border p-3">Phone</td>
                          <td className="border border-border p-3">رقم هاتف المريض</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-mono">D</td>
                          <td className="border border-border p-3">الخدمة المطلوبة</td>
                          <td className="border border-border p-3">Service</td>
                          <td className="border border-border p-3">نوع الخدمة المطلوبة</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-mono">E</td>
                          <td className="border border-border p-3">ملاحظات</td>
                          <td className="border border-border p-3">Notes</td>
                          <td className="border border-border p-3">ملاحظات إضافية</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    مثال على الصف الأول (الرؤوس):
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse border border-border">
                      <tr>
                        <td className="border border-border p-2 bg-background">التاريخ والوقت</td>
                        <td className="border border-border p-2 bg-background">الاسم الكامل</td>
                        <td className="border border-border p-2 bg-background">رقم الجوال</td>
                        <td className="border border-border p-2 bg-background">الخدمة المطلوبة</td>
                        <td className="border border-border p-2 bg-background">ملاحظات</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Setup Steps */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-6 w-6 text-primary" />
                  <CardTitle>خطوات الإعداد</CardTitle>
                </div>
                <CardDescription>اتبع هذه الخطوات لربط Google Sheet بنموذج الحجز</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="space-y-2">
                    <strong>إنشاء Google Sheet جديد</strong>
                    <p className="text-sm text-muted-foreground mr-6">
                      اذهب إلى لوحة التحكم → نماذج الحجز → اضغط على "إنشاء جديد تلقائياً" لإنشاء Sheet جديد تلقائياً
                    </p>
                  </li>
                  <li className="space-y-2">
                    <strong>إضافة الرؤوس</strong>
                    <p className="text-sm text-muted-foreground mr-6">
                      النظام سيضيف الرؤوس تلقائياً في الصف الأول من ورقة "الحجوزات"
                    </p>
                  </li>
                  <li className="space-y-2">
                    <strong>مشاركة الجدول مع Service Account</strong>
                    <p className="text-sm text-muted-foreground mr-6">
                      النظام سيمنح الصلاحيات تلقائياً للبريد الإلكتروني:
                      <code className="block mt-1 text-xs bg-muted p-2 rounded">
                        rosesmile-sheets-connectorv0@medical-rose-smile.iam.gserviceaccount.com
                      </code>
                    </p>
                  </li>
                  <li className="space-y-2">
                    <strong>ربط الجدول بنموذج الحجز</strong>
                    <p className="text-sm text-muted-foreground mr-6">
                      سيتم ربط الجدول تلقائياً بنموذج الحجز، وستظهر جميع الحجوزات الجديدة في الجدول
                    </p>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card>
              <CardHeader>
                <CardTitle>حل المشاكل الشائعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">خطأ: "The caller does not have permission"</h4>
                  <p className="text-sm text-muted-foreground">
                    تأكد من تفعيل Google Sheets API و Google Drive API في Google Cloud Console
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">خطأ: "Unable to parse range"</h4>
                  <p className="text-sm text-muted-foreground">تأكد من وجود ورقة عمل باسم "الحجوزات" في Google Sheet</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">البيانات لا تظهر في الجدول</h4>
                  <p className="text-sm text-muted-foreground">
                    تحقق من أن Service Account لديه صلاحيات "Editor" على الجدول
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard/booking-forms">إدارة نماذج الحجز</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/dashboard/google-auth">إعدادات Google</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
