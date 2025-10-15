"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Database, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export default function DatabaseFixPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  async function handleFix() {
    setLoading(true)
    try {
      const response = await fetch("/api/database/fix", {
        method: "POST",
      })

      if (response.ok) {
        setSuccess(true)
        toast({
          title: "نجح",
          description: "تم إصلاح قاعدة البيانات بنجاح",
        })
      } else {
        const error = await response.json()
        toast({
          title: "خطأ",
          description: error.error || "فشل في إصلاح قاعدة البيانات",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إصلاح قاعدة البيانات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            إصلاح قاعدة البيانات
          </CardTitle>
          <CardDescription>إصلاح جميع مشاكل قاعدة البيانات وإضافة الأعمدة المفقودة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-semibold">المشاكل التي سيتم إصلاحها:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>إضافة عمود booking_form_id إلى جدول الحجوزات</li>
                  <li>إضافة أعمدة value_ar, value_en, type إلى جدول الإعدادات</li>
                  <li>إضافة عمود is_active إلى جدول الأطباء</li>
                  <li>إنشاء جدول نماذج الحجز إذا لم يكن موجوداً</li>
                  <li>إضافة نموذج حجز رئيسي افتراضي</li>
                </ul>
              </div>
            </div>
          </div>

          {success ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">تم الإصلاح بنجاح!</p>
                <p className="text-sm text-green-700">يمكنك الآن استخدام جميع ميزات الموقع</p>
              </div>
            </div>
          ) : (
            <Button onClick={handleFix} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري الإصلاح...
                </>
              ) : (
                <>
                  <Database className="ml-2 h-5 w-5" />
                  إصلاح قاعدة البيانات الآن
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
