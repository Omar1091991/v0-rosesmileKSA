"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Database,
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  Key,
  Wrench,
  ImageIcon,
  Star,
  FileText,
  Phone,
  Users,
  MessageSquare,
} from "lucide-react"

export default function DatabaseSetupPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationOutput, setMigrationOutput] = useState<string[]>([])
  const [migrationStatus, setMigrationStatus] = useState<"idle" | "success" | "error">("idle")

  const [isPhoneMigrating, setIsPhoneMigrating] = useState(false)
  const [phoneMigrationOutput, setPhoneMigrationOutput] = useState<string[]>([])
  const [phoneMigrationStatus, setPhoneMigrationStatus] = useState<"idle" | "success" | "error">("idle")

  const [isImageMigrating, setIsImageMigrating] = useState(false)
  const [imageMigrationOutput, setImageMigrationOutput] = useState<string[]>([])
  const [imageMigrationStatus, setImageMigrationStatus] = useState<"idle" | "success" | "error">("idle")

  const [isMainMigrating, setIsMainMigrating] = useState(false)
  const [isMainMigrationOutput, setIsMainMigrationOutput] = useState<string[]>([])
  const [isMainMigrationStatus, setIsMainMigrationStatus] = useState<"idle" | "success" | "error">("idle")

  const [isSubtitleMigrating, setIsSubtitleMigrating] = useState(false)
  const [subtitleMigrationOutput, setSubtitleMigrationOutput] = useState<string[]>([])
  const [subtitleMigrationStatus, setSubtitleMigrationStatus] = useState<"idle" | "success" | "error">("idle")

  const [isDoctorCasesMigrating, setIsDoctorCasesMigrating] = useState(false)
  const [doctorCasesMigrationOutput, setDoctorCasesMigrationOutput] = useState<string[]>([])
  const [doctorCasesMigrationStatus, setDoctorCasesMigrationStatus] = useState<"idle" | "success" | "error">("idle")

  const [isContactedMigrating, setIsContactedMigrating] = useState(false)
  const [contactedMigrationOutput, setContactedMigrationOutput] = useState<string[]>([])
  const [contactedMigrationStatus, setContactedMigrationStatus] = useState<"idle" | "success" | "error">("idle")

  const [isTrackingMigrating, setIsTrackingMigrating] = useState(false)
  const [trackingMigrationOutput, setTrackingMigrationOutput] = useState<string[]>([])
  const [trackingMigrationStatus, setTrackingMigrationStatus] = useState<"idle" | "success" | "error">("idle")

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

  const runIsMainMigration = async () => {
    setIsMainMigrating(true)
    setIsMainMigrationOutput([])
    setIsMainMigrationStatus("idle")

    try {
      const response = await fetch("/api/migrations/add-is-main-column", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsMainMigrationOutput([data.message, data.mainFormId ? `النموذج الرئيسي: ${data.mainFormId}` : ""])
        setIsMainMigrationStatus("success")
      } else {
        setIsMainMigrationOutput([data.error || "حدث خطأ غير معروف"])
        setIsMainMigrationStatus("error")
      }
    } catch (error) {
      setIsMainMigrationOutput([`خطأ في الاتصال: ${error}`])
      setIsMainMigrationStatus("error")
    } finally {
      setIsMainMigrating(false)
    }
  }

  const runSubtitleMigration = async () => {
    setIsSubtitleMigrating(true)
    setSubtitleMigrationOutput([])
    setSubtitleMigrationStatus("idle")

    try {
      const response = await fetch("/api/migrations/add-service-subtitle", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubtitleMigrationOutput([data.message])
        setSubtitleMigrationStatus("success")
      } else {
        setSubtitleMigrationOutput([data.error || "حدث خطأ غير معروف"])
        setSubtitleMigrationStatus("error")
      }
    } catch (error) {
      setSubtitleMigrationOutput([`خطأ في الاتصال: ${error}`])
      setSubtitleMigrationStatus("error")
    } finally {
      setIsSubtitleMigrating(false)
    }
  }

  const runPhoneMigration = async () => {
    setIsPhoneMigrating(true)
    setPhoneMigrationOutput([])
    setPhoneMigrationStatus("idle")

    try {
      const response = await fetch("/api/database-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add_phone_column",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setPhoneMigrationOutput([data.message])
        setPhoneMigrationStatus("success")
      } else {
        setPhoneMigrationOutput([data.error || "حدث خطأ غير معروف"])
        setPhoneMigrationStatus("error")
      }
    } catch (error) {
      setPhoneMigrationOutput([`خطأ في الاتصال: ${error}`])
      setPhoneMigrationStatus("error")
    } finally {
      setIsPhoneMigrating(false)
    }
  }

  const runDoctorCasesMigration = async () => {
    setIsDoctorCasesMigrating(true)
    setDoctorCasesMigrationOutput([])
    setDoctorCasesMigrationStatus("idle")

    try {
      const response = await fetch("/api/database-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "fix_doctor_cases",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setDoctorCasesMigrationOutput([data.message])
        setDoctorCasesMigrationStatus("success")
      } else {
        setDoctorCasesMigrationOutput([data.error || "حدث خطأ غير معروف"])
        setDoctorCasesMigrationStatus("error")
      }
    } catch (error) {
      setDoctorCasesMigrationOutput([`خطأ في الاتصال: ${error}`])
      setDoctorCasesMigrationStatus("error")
    } finally {
      setIsDoctorCasesMigrating(false)
    }
  }

  const runContactedMigration = async () => {
    setIsContactedMigrating(true)
    setContactedMigrationOutput([])
    setContactedMigrationStatus("idle")

    try {
      const response = await fetch("/api/database-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add_contacted_column",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setContactedMigrationOutput([data.message])
        setContactedMigrationStatus("success")
      } else {
        setContactedMigrationOutput([data.error || "حدث خطأ غير معروف"])
        setContactedMigrationStatus("error")
      }
    } catch (error) {
      setContactedMigrationOutput([`خطأ في الاتصال: ${error}`])
      setContactedMigrationStatus("error")
    } finally {
      setIsContactedMigrating(false)
    }
  }

  const runTrackingMigration = async () => {
    setIsTrackingMigrating(true)
    setTrackingMigrationOutput([])
    setTrackingMigrationStatus("idle")

    try {
      const response = await fetch("/api/database-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add_booking_tracking_columns",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setTrackingMigrationOutput([data.message])
        setTrackingMigrationStatus("success")
      } else {
        setTrackingMigrationOutput([data.error || "حدث خطأ غير معروف"])
        setTrackingMigrationStatus("error")
      }
    } catch (error) {
      setTrackingMigrationOutput([`خطأ في الاتصال: ${error}`])
      setTrackingMigrationStatus("error")
    } finally {
      setIsTrackingMigrating(false)
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
            <Phone className="h-5 w-5" />
            إصلاح: إضافة عمود الهاتف للمستخدمين
          </CardTitle>
          <CardDescription>
            إذا كنت تواجه خطأ "column phone does not exist"، استخدم هذا الزر لإضافة عمود phone إلى جدول المستخدمين
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runPhoneMigration} disabled={isPhoneMigrating} variant="secondary" className="gap-2">
              {isPhoneMigrating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التنفيذ...
                </>
              ) : (
                <>
                  <Phone className="h-5 w-5" />
                  إضافة عمود الهاتف
                </>
              )}
            </Button>

            {phoneMigrationStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">تم بنجاح</span>
              </div>
            )}

            {phoneMigrationStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">فشل</span>
              </div>
            )}
          </div>

          {phoneMigrationOutput.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
              {phoneMigrationOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            إصلاح: إضافة العنوان الفرعي للخدمات
          </CardTitle>
          <CardDescription>
            إذا كنت تواجه خطأ "column subtitle_ar does not exist"، استخدم هذا الزر لإضافة أعمدة العنوان الفرعي إلى جدول
            الخدمات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runSubtitleMigration} disabled={isSubtitleMigrating} variant="secondary" className="gap-2">
              {isSubtitleMigrating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التنفيذ...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  إضافة العنوان الفرعي
                </>
              )}
            </Button>

            {subtitleMigrationStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">تم بنجاح</span>
              </div>
            )}

            {subtitleMigrationStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">فشل</span>
              </div>
            )}
          </div>

          {subtitleMigrationOutput.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
              {subtitleMigrationOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            إصلاح: إضافة عمود النموذج الرئيسي
          </CardTitle>
          <CardDescription>
            إذا كان زر "احجز موعد" لا يعمل، استخدم هذا الزر لإضافة عمود is_main إلى جدول booking_forms وتعيين نموذج
            رئيسي
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runIsMainMigration} disabled={isMainMigrating} variant="secondary" className="gap-2">
              {isMainMigrating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التنفيذ...
                </>
              ) : (
                <>
                  <Star className="h-5 w-5" />
                  إضافة عمود النموذج الرئيسي
                </>
              )}
            </Button>

            {isMainMigrationStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">تم بنجاح</span>
              </div>
            )}

            {isMainMigrationStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">فشل</span>
              </div>
            )}
          </div>

          {isMainMigrationOutput.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
              {isMainMigrationOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            إصلاح: جدول حالات الأطباء
          </CardTitle>
          <CardDescription>
            إذا كنت تواجه خطأ "null value in column title_ar violates not-null constraint"، استخدم هذا الزر لإصلاح جدول
            حالات الأطباء
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={runDoctorCasesMigration}
              disabled={isDoctorCasesMigrating}
              variant="secondary"
              className="gap-2"
            >
              {isDoctorCasesMigrating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التنفيذ...
                </>
              ) : (
                <>
                  <Users className="h-5 w-5" />
                  إصلاح جدول حالات الأطباء
                </>
              )}
            </Button>

            {doctorCasesMigrationStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">تم بنجاح</span>
              </div>
            )}

            {doctorCasesMigrationStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">فشل</span>
              </div>
            )}
          </div>

          {doctorCasesMigrationOutput.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
              {doctorCasesMigrationOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            إصلاح: إضافة عمود التواصل للحجوزات
          </CardTitle>
          <CardDescription>
            إذا كنت تواجه خطأ "column contacted does not exist"، استخدم هذا الزر لإضافة عمود contacted إلى جدول الحجوزات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={runContactedMigration}
              disabled={isContactedMigrating}
              variant="secondary"
              className="gap-2"
            >
              {isContactedMigrating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التنفيذ...
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5" />
                  إضافة عمود التواصل
                </>
              )}
            </Button>

            {contactedMigrationStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">تم بنجاح</span>
              </div>
            )}

            {contactedMigrationStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">فشل</span>
              </div>
            )}
          </div>

          {contactedMigrationOutput.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
              {contactedMigrationOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            إصلاح: إضافة أعمدة التتبع للحجوزات
          </CardTitle>
          <CardDescription>
            إذا كنت تواجه خطأ "column contacted/contact_attempts/admin_notes does not exist"، استخدم هذا الزر لإضافة
            جميع أعمدة التتبع إلى جدول الحجوزات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runTrackingMigration} disabled={isTrackingMigrating} variant="secondary" className="gap-2">
              {isTrackingMigrating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التنفيذ...
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5" />
                  إضافة أعمدة التتبع
                </>
              )}
            </Button>

            {trackingMigrationStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">تم بنجاح</span>
              </div>
            )}

            {trackingMigrationStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">فشل</span>
              </div>
            )}
          </div>

          {trackingMigrationOutput.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
              {trackingMigrationOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}

          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
            <p className="font-semibold mb-2">سيتم إضافة الأعمدة التالية:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>contacted - لتتبع حالة التواصل مع العميل</li>
              <li>contact_attempts - لتتبع عدد محاولات التواصل</li>
              <li>admin_notes - لإضافة ملاحظات إدارية</li>
            </ul>
          </div>
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
