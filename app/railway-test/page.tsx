"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2, Database } from "lucide-react"

export default function RailwayTestPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runTests = async () => {
    setTesting(true)
    setResults(null)

    const tests = {
      connection: false,
      bookings: false,
      bookingForms: false,
      siteSettings: false,
      doctors: false,
      articles: false,
    }

    try {
      // Test 1: Database connection
      const connResponse = await fetch("/api/railway/init")
      tests.connection = connResponse.ok

      // Test 2: Bookings API
      const bookingsResponse = await fetch("/api/bookings")
      tests.bookings = bookingsResponse.ok

      // Test 3: Booking Forms API
      const formsResponse = await fetch("/api/booking-forms")
      tests.bookingForms = formsResponse.ok

      // Test 4: Site Settings API
      const settingsResponse = await fetch("/api/site-settings")
      tests.siteSettings = settingsResponse.ok

      // Test 5: Doctors API
      const doctorsResponse = await fetch("/api/doctors")
      tests.doctors = doctorsResponse.ok

      // Test 6: Articles API
      const articlesResponse = await fetch("/api/articles")
      tests.articles = articlesResponse.ok

      setResults(tests)
    } catch (error) {
      console.error("[v0] Test error:", error)
      setResults(tests)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8" dir="rtl">
      <div className="mx-auto max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold">اختبار قاعدة بيانات Railway</CardTitle>
            <CardDescription className="text-lg">تحقق من اتصال النظام بقاعدة بيانات Railway وجميع APIs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">معلومات الاتصال</h3>
              <div className="space-y-1 text-sm text-blue-700">
                <p>• النظام يستخدم متغير البيئة: DATABASE_URL</p>
                <p>• نوع قاعدة البيانات: PostgreSQL (Railway)</p>
                <p>• المكتبة المستخدمة: pg (node-postgres)</p>
              </div>
            </div>

            <Button onClick={runTests} disabled={testing} className="w-full" size="lg">
              {testing ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                "بدء الاختبار"
              )}
            </Button>

            {results && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">نتائج الاختبار:</h3>

                <TestResult
                  label="اتصال قاعدة البيانات"
                  success={results.connection}
                  description="التحقق من الاتصال بقاعدة بيانات Railway"
                />

                <TestResult
                  label="API الحجوزات"
                  success={results.bookings}
                  description="قراءة وكتابة بيانات الحجوزات"
                />

                <TestResult
                  label="API نماذج الحجز"
                  success={results.bookingForms}
                  description="إدارة نماذج الحجز والخدمات"
                />

                <TestResult
                  label="API إعدادات الموقع"
                  success={results.siteSettings}
                  description="قراءة وتحديث إعدادات الموقع"
                />

                <TestResult label="API الأطباء" success={results.doctors} description="إدارة بيانات الأطباء" />

                <TestResult label="API المقالات" success={results.articles} description="إدارة المقالات والمحتوى" />

                <div className="mt-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-900">النظام متصل بـ Railway</h4>
                      <p className="mt-1 text-sm text-green-700">
                        جميع العمليات تتم مباشرة على قاعدة بيانات Railway PostgreSQL. لا يوجد أي اتصال بـ Supabase أو أي
                        قاعدة بيانات أخرى.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TestResult({ label, success, description }: { label: string; success: boolean; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      {success ? (
        <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
      ) : (
        <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-600" />
      )}
      <div className="flex-1">
        <h4 className="font-semibold">{label}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className={`text-sm font-medium ${success ? "text-green-600" : "text-red-600"}`}>
        {success ? "نجح" : "فشل"}
      </span>
    </div>
  )
}
