"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Database, Loader2 } from "lucide-react"
import { useState } from "react"

export default function RailwayInitPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"init" | "password" | "done">("init")

  const initializeDatabase = async () => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      setStep("init")
      const response = await fetch("/api/railway/init", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "فشل في إنشاء قاعدة البيانات")
      }

      setStep("password")
      const passwordResponse = await fetch("/api/railway/add-password", {
        method: "POST",
      })

      const passwordData = await passwordResponse.json()

      if (!passwordResponse.ok) {
        throw new Error(passwordData.error || "فشل في إضافة عمود كلمة المرور")
      }

      setStep("done")
      setSuccess(true)
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <Database className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h1 className="text-2xl font-bold mb-2">تهيئة قاعدة بيانات Railway</h1>
        <p className="text-gray-600 mb-6">اضغط على الزر أدناه لإنشاء جميع الجداول المطلوبة في قاعدة بيانات Railway</p>

        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            {step === "init" && <p>جاري إنشاء الجداول...</p>}
            {step === "password" && <p>جاري إضافة عمود كلمة المرور...</p>}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <span>تم إنشاء قاعدة البيانات بنجاح! جاري التحويل...</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-semibold mb-1">خطأ:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Button onClick={initializeDatabase} disabled={loading || success} className="w-full" size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري الإنشاء...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              تم بنجاح
            </>
          ) : (
            "إنشاء قاعدة البيانات"
          )}
        </Button>

        <div className="mt-6 text-sm text-gray-500">
          <p>سيتم إنشاء 12 جدول:</p>
          <ul className="mt-2 space-y-1 text-right">
            <li>• profiles (المستخدمين)</li>
            <li>• services (الخدمات)</li>
            <li>• doctors (الأطباء)</li>
            <li>• doctor_cases (حالات الأطباء)</li>
            <li>• departments (الأقسام)</li>
            <li>• offers (العروض)</li>
            <li>• articles (المقالات)</li>
            <li>• gallery (معرض الصور)</li>
            <li>• booking_forms (نماذج الحجز)</li>
            <li>• booking_form_services (ربط النماذج بالخدمات)</li>
            <li>• bookings (الحجوزات)</li>
            <li>• site_settings (إعدادات الموقع)</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
