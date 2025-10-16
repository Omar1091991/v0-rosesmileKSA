"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Play, CheckCircle, XCircle, Loader2, Key, Wrench, ImageIcon } from "lucide-react"

export default function DatabaseSetupPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationOutput, setMigrationOutput] = useState<string[]>([])
  const [migrationStatus, setMigrationStatus] = useState<"idle" | "success" | "error">("idle")

  const [isImageMigrating, setIsImageMigrating] = useState(false)
  const [imageMigrationOutput, setImageMigrationOutput] = useState<string[]>([])
  const [imageMigrationStatus, setImageMigrationStatus] = useState<"idle" | "success" | "error">("idle")

  const runScript = async () => {
    setIsRunning(true)
    setOutput([])
    setStatus("idle")

    try {
      const response = await fetch("/api/run-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: "init-database.mjs",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOutput(data.output || [])
        setStatus("success")
      } else {
        setOutput([data.error || "حدث خطأ غير معروف"])
        setStatus("error")
      }
    } catch (error) {
      setOutput([`خطأ في الاتصال: ${error}`])
      setStatus("error")
    } finally {
      setIsRunning(false)
    }
  }

  const runMigration = async () => {
    setIsMigrating(true)
    setMigrationOutput([])
    setMigrationStatus("idle")

    try {
      const response = await fetch("/api/migrations/add-phone", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMigrationOutput([data.message])
        setMigrationStatus("success")
      } else {
        setMigrationOutput([data.error || "حدث خطأ غير معروف"])
        setMigrationStatus("error")
      }
    } catch (error) {
      setMigrationOutput([`خطأ في الاتصال: ${error}`])
      setMigrationStatus("error")
    } finally {
      setIsMigrating(false)
    }
  }

  const runImageMigration = async () => {
    setIsImageMigrating(true)
    setImageMigrationOutput([])
    setImageMigrationStatus("idle")

    try {
      const response = await fetch("/api/migrations/add-image-url", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setImageMigrationOutput([data.message])
        setImageMigrationStatus("success")
      } else {
        setImageMigrationOutput([data.error || "حدث خطأ غير معروف"])
        setImageMigrationStatus("error")
      }
    } catch (error) {
      setImageMigrationOutput([`خطأ في الاتصال: ${error}`])
      setImageMigrationStatus("error")
    } finally {
      setIsImageMigrating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="h-8 w-8" />
          تهيئة قاعدة البيانات
        </h1>
        <p className="text-muted-foreground mt-2">قم بتشغيل سكريبت إنشاء جداول قاعدة البيانات والبيانات الافتراضية</p>
      </div>

      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">بيانات تسجيل الدخول بعد التهيئة:</p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">
              <p>البريد الإلكتروني: admin@rosesmile.com</p>
              <p>كلمة المرور: admin123</p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            إصلاح: إضافة عمود الصور لنماذج الحجز
          </CardTitle>
          <CardDescription>
            إذا كنت تواجه خطأ "column image_url does not exist"، استخدم هذا الزر لإضافة عمود image_url إلى جدول
            booking_forms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runImageMigration} disabled={isImageMigrating} variant="secondary" className="gap-2">
              {isImageMigrating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التنفيذ...
                </>
              ) : (
                <>
                  <ImageIcon className="h-5 w-5" />
                  إضافة عمود الصور
                </>
              )}
            </Button>

            {imageMigrationStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">تم بنجاح</span>
              </div>
            )}

            {imageMigrationStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">فشل</span>
              </div>
            )}
          </div>

          {imageMigrationOutput.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
              {imageMigrationOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            إصلاح سريع: إضافة عمود الهاتف
          </CardTitle>
          <CardDescription>
            إذا كانت قاعدة البيانات موجودة بالفعل، استخدم هذا الزر لإضافة عمود phone إلى جدول المستخدمين
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runMigration} disabled={isMigrating} variant="secondary" className="gap-2">
              {isMigrating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التنفيذ...
                </>
              ) : (
                <>
                  <Wrench className="h-5 w-5" />
                  تشغيل Migration
                </>
              )}
            </Button>

            {migrationStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">تم بنجاح</span>
              </div>
            )}

            {migrationStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">فشل</span>
              </div>
            )}
          </div>

          {migrationOutput.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
              {migrationOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>سكريبت التهيئة</CardTitle>
          <CardDescription>
            سيقوم هذا السكريبت بإنشاء جميع الجداول المطلوبة وإضافة البيانات الافتراضية بما في ذلك مستخدم المدير
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runScript} disabled={isRunning} size="lg" className="gap-2">
              {isRunning ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التشغيل...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  تشغيل السكريبت
                </>
              )}
            </Button>

            {status === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">تم التنفيذ بنجاح</span>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">فشل التنفيذ</span>
              </div>
            )}
          </div>

          {output.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">نتيجة التنفيذ:</h3>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {output.map((line, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">ماذا سيفعل السكريبت؟</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>حذف الجداول القديمة إذا كانت موجودة</li>
              <li>إنشاء جدول المستخدمين (users)</li>
              <li>إنشاء جدول إعدادات الموقع (site_settings)</li>
              <li>إنشاء جدول الأطباء (doctors)</li>
              <li>إنشاء جدول الخدمات (services)</li>
              <li>إنشاء جدول الأقسام (departments)</li>
              <li>إنشاء جدول العروض (offers)</li>
              <li>إنشاء جدول المقالات (articles)</li>
              <li>إنشاء جدول الحجوزات (bookings)</li>
              <li>إنشاء جدول نماذج الحجز (booking_forms)</li>
              <li>إنشاء جدول معرض الصور (gallery)</li>
              <li>إنشاء الفهارس (indexes) لتحسين الأداء</li>
              <li>إضافة مستخدم المدير الافتراضي</li>
              <li>إضافة الإعدادات الافتراضية للموقع</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
