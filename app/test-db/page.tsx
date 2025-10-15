"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Database, AlertTriangle } from "lucide-react"

export default function TestDatabasePage() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testConnection = async () => {
    setTesting(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">اختبار اتصال قاعدة البيانات</h1>
          <p className="text-gray-600">تحقق من اتصال Railway Database</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              اختبار الاتصال
            </CardTitle>
            <CardDescription>انقر على الزر أدناه لاختبار الاتصال بقاعدة بيانات Railway</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} disabled={testing} className="w-full" size="lg">
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 ml-2" />
                  اختبار الاتصال
                </>
              )}
            </Button>

            {result && (
              <div className="space-y-4 mt-6">
                {result.success ? (
                  <>
                    <Alert className="border-green-500 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">نجح الاتصال!</AlertTitle>
                      <AlertDescription className="text-green-700">تم الاتصال بقاعدة البيانات بنجاح</AlertDescription>
                    </Alert>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">معلومات الاتصال</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="font-semibold">رابط الاتصال:</div>
                          <div className="font-mono text-xs break-all">{result.connectionString}</div>

                          <div className="font-semibold">وقت الخادم:</div>
                          <div>{new Date(result.serverTime).toLocaleString("ar-SA")}</div>

                          <div className="font-semibold">إصدار PostgreSQL:</div>
                          <div className="text-xs">{result.postgresVersion}</div>

                          <div className="font-semibold">عدد الجداول:</div>
                          <div>{result.tableCount}</div>
                        </div>

                        {result.tables && result.tables.length > 0 && (
                          <div className="mt-4">
                            <div className="font-semibold mb-2">الجداول الموجودة:</div>
                            <div className="flex flex-wrap gap-2">
                              {result.tables.map((table: string) => (
                                <span key={table} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  {table}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>فشل الاتصال</AlertTitle>
                      <AlertDescription>{result.error}</AlertDescription>
                    </Alert>

                    {result.hint && (
                      <Alert className="border-yellow-500 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-yellow-800">نصيحة</AlertTitle>
                        <AlertDescription className="text-yellow-700">{result.hint}</AlertDescription>
                      </Alert>
                    )}

                    {result.code === "ENOTFOUND" && (
                      <Card className="border-orange-300 bg-orange-50">
                        <CardHeader>
                          <CardTitle className="text-orange-800">كيفية الحصول على الرابط الصحيح</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-orange-900">
                          <p className="font-semibold">المشكلة: تستخدم الرابط الداخلي لـ Railway</p>
                          <div className="space-y-2">
                            <p className="font-semibold">الحل:</p>
                            <ol className="list-decimal list-inside space-y-2 mr-4">
                              <li>
                                اذهب إلى{" "}
                                <a
                                  href="https://railway.app"
                                  target="_blank"
                                  className="text-blue-600 underline"
                                  rel="noreferrer"
                                >
                                  railway.app
                                </a>
                              </li>
                              <li>افتح مشروعك واختر قاعدة البيانات Postgres</li>
                              <li>
                                انتقل إلى تبويب <strong>Variables</strong>
                              </li>
                              <li>
                                ابحث عن <code className="bg-orange-200 px-2 py-1 rounded">DATABASE_PUBLIC_URL</code> أو{" "}
                                <code className="bg-orange-200 px-2 py-1 rounded">DATABASE_URL</code>
                              </li>
                              <li>
                                انسخ الرابط الذي يحتوي على{" "}
                                <code className="bg-orange-200 px-2 py-1 rounded">containers-us-west</code> أو{" "}
                                <code className="bg-orange-200 px-2 py-1 rounded">railway.app</code>
                              </li>
                              <li>الصق الرابط في متغيرات البيئة في v0</li>
                            </ol>
                          </div>
                          <div className="mt-4 p-3 bg-white rounded border border-orange-300">
                            <p className="font-semibold mb-2">مثال على الرابط الصحيح:</p>
                            <code className="text-xs break-all">
                              postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
                            </code>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">ملاحظة مهمة</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2">
            <p>
              <strong>الرابط الداخلي</strong> (postgres.railway.internal) يعمل فقط داخل شبكة Railway
            </p>
            <p>
              <strong>الرابط العام</strong> (containers-us-west-xxx.railway.app) يعمل من أي مكان بما في ذلك Vercel و v0
            </p>
            <p className="mt-4 font-semibold">تأكد من استخدام الرابط العام في متغيرات البيئة!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
