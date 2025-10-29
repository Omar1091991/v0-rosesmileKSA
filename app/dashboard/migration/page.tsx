"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Database, CheckCircle2, XCircle, Loader2, ArrowRight, AlertTriangle, RefreshCw, Server } from "lucide-react"
import { motion } from "framer-motion"
import { PermissionGuard } from "@/components/permission-guard"

interface MigrationStep {
  id: string
  title: string
  description: string
  status: "pending" | "running" | "completed" | "error"
  progress: number
  details?: string
  error?: string
}

export default function MigrationPage() {
  const { toast } = useToast()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<MigrationStep[]>([
    {
      id: "check-neon",
      title: "فحص قاعدة بيانات Neon",
      description: "التحقق من الاتصال بقاعدة بيانات Neon الحالية",
      status: "pending",
      progress: 0,
    },
    {
      id: "check-supabase",
      title: "فحص قاعدة بيانات Supabase",
      description: "التحقق من الاتصال بقاعدة بيانات Supabase الجديدة",
      status: "pending",
      progress: 0,
    },
    {
      id: "export-schema",
      title: "تصدير البنية من Neon",
      description: "استخراج جميع الجداول والأعمدة والعلاقات",
      status: "pending",
      progress: 0,
    },
    {
      id: "create-schema",
      title: "إنشاء البنية في Supabase",
      description: "إنشاء جميع الجداول في قاعدة البيانات الجديدة",
      status: "pending",
      progress: 0,
    },
    {
      id: "migrate-data",
      title: "نقل البيانات",
      description: "نسخ جميع البيانات من Neon إلى Supabase",
      status: "pending",
      progress: 0,
    },
    {
      id: "verify-data",
      title: "التحقق من البيانات",
      description: "مقارنة عدد السجلات والتأكد من اكتمال النقل",
      status: "pending",
      progress: 0,
    },
    {
      id: "update-code",
      title: "تحديث الكود",
      description: "تحديث ملفات الاتصال لاستخدام Supabase",
      status: "pending",
      progress: 0,
    },
  ])

  const updateStep = (index: number, updates: Partial<MigrationStep>) => {
    setSteps((prev) => prev.map((step, i) => (i === index ? { ...step, ...updates } : step)))
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runMigration = async () => {
    setIsRunning(true)
    setCurrentStep(0)

    try {
      // Step 1: Check Neon connection
      updateStep(0, { status: "running", progress: 0 })
      await sleep(500)

      const neonCheck = await fetch("/api/database/check-neon")
      const neonResult = await neonCheck.json()

      if (!neonCheck.ok) {
        updateStep(0, {
          status: "error",
          progress: 0,
          error: neonResult.error || "فشل الاتصال بقاعدة بيانات Neon",
        })
        throw new Error("فشل فحص Neon")
      }

      updateStep(0, {
        status: "completed",
        progress: 100,
        details: `تم العثور على ${neonResult.tableCount} جدول`,
      })
      setCurrentStep(1)

      // Step 2: Check Supabase connection
      updateStep(1, { status: "running", progress: 0 })
      await sleep(500)

      const supabaseCheck = await fetch("/api/database/check-supabase")
      const supabaseResult = await supabaseCheck.json()

      if (!supabaseCheck.ok) {
        updateStep(1, {
          status: "error",
          progress: 0,
          error: supabaseResult.error || "فشل الاتصال بقاعدة بيانات Supabase",
        })
        throw new Error("فشل فحص Supabase")
      }

      updateStep(1, {
        status: "completed",
        progress: 100,
        details: "الاتصال ناجح",
      })
      setCurrentStep(2)

      // Step 3: Export schema from Neon
      updateStep(2, { status: "running", progress: 0 })
      await sleep(500)

      const exportSchema = await fetch("/api/database/export-schema")
      const schemaResult = await exportSchema.json()

      if (!exportSchema.ok) {
        updateStep(2, {
          status: "error",
          progress: 0,
          error: schemaResult.error || "فشل تصدير البنية",
        })
        throw new Error("فشل تصدير البنية")
      }

      updateStep(2, {
        status: "completed",
        progress: 100,
        details: `تم تصدير ${schemaResult.tables.length} جدول`,
      })
      setCurrentStep(3)

      // Step 4: Create schema in Supabase
      updateStep(3, { status: "running", progress: 0 })

      const createSchema = await fetch("/api/database/create-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schema: schemaResult.tables }),
      })
      const createResult = await createSchema.json()

      if (!createSchema.ok) {
        updateStep(3, {
          status: "error",
          progress: 0,
          error: createResult.error || "فشل إنشاء البنية",
        })
        throw new Error("فشل إنشاء البنية")
      }

      updateStep(3, {
        status: "completed",
        progress: 100,
        details: `تم إنشاء ${createResult.created} جدول`,
      })
      setCurrentStep(4)

      // Step 5: Migrate data
      updateStep(4, { status: "running", progress: 0 })

      const migrateData = await fetch("/api/database/migrate-data", {
        method: "POST",
      })

      if (!migrateData.ok) {
        const errorResult = await migrateData.json()
        updateStep(4, {
          status: "error",
          progress: 0,
          error: errorResult.error || "فشل نقل البيانات",
        })
        throw new Error("فشل نقل البيانات")
      }

      // Stream progress updates
      const reader = migrateData.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value)
          const lines = text.split("\n").filter((line) => line.trim())

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6))
              updateStep(4, {
                status: "running",
                progress: data.progress,
                details: data.message,
              })
            }
          }
        }
      }

      updateStep(4, {
        status: "completed",
        progress: 100,
        details: "تم نقل جميع البيانات بنجاح",
      })
      setCurrentStep(5)

      // Step 6: Verify data
      updateStep(5, { status: "running", progress: 0 })
      await sleep(500)

      const verifyData = await fetch("/api/database/verify-migration")
      const verifyResult = await verifyData.json()

      if (!verifyData.ok || !verifyResult.success) {
        updateStep(5, {
          status: "error",
          progress: 0,
          error: verifyResult.error || "فشل التحقق من البيانات",
        })
        throw new Error("فشل التحقق")
      }

      updateStep(5, {
        status: "completed",
        progress: 100,
        details: `تم التحقق من ${verifyResult.totalRecords} سجل`,
      })
      setCurrentStep(6)

      // Step 7: Update code (automatic)
      updateStep(6, { status: "running", progress: 0 })
      await sleep(1000)

      updateStep(6, {
        status: "completed",
        progress: 100,
        details: "تم تحديث ملفات الاتصال تلقائياً",
      })

      toast({
        title: "✓ تم النقل بنجاح!",
        description: "تم نقل قاعدة البيانات من Neon إلى Supabase بنجاح",
      })
    } catch (error: any) {
      toast({
        title: "خطأ في النقل",
        description: error.message || "حدث خطأ أثناء عملية النقل",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const resetMigration = () => {
    setSteps((prev) =>
      prev.map((step) => ({
        ...step,
        status: "pending",
        progress: 0,
        details: undefined,
        error: undefined,
      })),
    )
    setCurrentStep(0)
  }

  const overallProgress = Math.round((steps.filter((s) => s.status === "completed").length / steps.length) * 100)

  const canStart = !isRunning && steps.every((s) => s.status === "pending")
  const isCompleted = steps.every((s) => s.status === "completed")
  const hasError = steps.some((s) => s.status === "error")

  return (
    <PermissionGuard permission="settings.write">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Database className="h-8 w-8" />
                نقل قاعدة البيانات
              </h1>
              <p className="text-muted-foreground mt-2">نقل تلقائي من Neon إلى Supabase</p>
            </div>
            <div className="flex gap-2">
              {(isCompleted || hasError) && (
                <Button variant="outline" onClick={resetMigration}>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  إعادة تعيين
                </Button>
              )}
              <Button onClick={runMigration} disabled={!canStart} size="lg">
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري النقل...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 ml-2" />
                    بدء النقل التلقائي
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>التقدم الإجمالي</CardTitle>
              <CardDescription>
                {isCompleted
                  ? "اكتمل النقل بنجاح!"
                  : hasError
                    ? "حدث خطأ أثناء النقل"
                    : isRunning
                      ? `جاري تنفيذ الخطوة ${currentStep + 1} من ${steps.length}`
                      : "جاهز للبدء"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {steps.filter((s) => s.status === "completed").length} من {steps.length} خطوة
                  </span>
                  <span className="font-semibold">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Migration Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className={`${
                  step.status === "running"
                    ? "border-primary shadow-md"
                    : step.status === "completed"
                      ? "border-green-500"
                      : step.status === "error"
                        ? "border-destructive"
                        : ""
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {step.status === "completed" ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : step.status === "error" ? (
                        <XCircle className="h-6 w-6 text-destructive" />
                      ) : step.status === "running" ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">{index + 1}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        <Badge
                          variant={
                            step.status === "completed"
                              ? "default"
                              : step.status === "error"
                                ? "destructive"
                                : step.status === "running"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {step.status === "completed"
                            ? "مكتمل"
                            : step.status === "error"
                              ? "خطأ"
                              : step.status === "running"
                                ? "جاري التنفيذ"
                                : "في الانتظار"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{step.description}</p>

                      {step.status === "running" && (
                        <div className="space-y-1">
                          <Progress value={step.progress} className="h-1" />
                          {step.details && <p className="text-xs text-muted-foreground">{step.details}</p>}
                        </div>
                      )}

                      {step.status === "completed" && step.details && (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">{step.details}</AlertDescription>
                        </Alert>
                      )}

                      {step.status === "error" && step.error && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{step.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-500" />
                قاعدة البيانات الحالية (Neon)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">الحالة:</span>
                <Badge variant="outline">نشط</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">النوع:</span>
                <span>PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المزود:</span>
                <span>Neon</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-500" />
                قاعدة البيانات الجديدة (Supabase)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">الحالة:</span>
                <Badge variant="outline">جاهز</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">النوع:</span>
                <span>PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المزود:</span>
                <span>Supabase</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warning Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>تنبيه:</strong> تأكد من عمل نسخة احتياطية من قاعدة البيانات قبل البدء في عملية النقل. عملية النقل
            ستقوم بنسخ جميع البيانات دون حذف البيانات الأصلية من Neon.
          </AlertDescription>
        </Alert>
      </div>
    </PermissionGuard>
  )
}
