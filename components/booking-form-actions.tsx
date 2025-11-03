"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link2, Sheet, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BookingFormActionsProps {
  formId: string
  googleSheetUrl?: string
  onEdit: () => void
  onDelete: () => void
  onSheetCreated?: () => void
}

export function BookingFormActions({
  formId,
  googleSheetUrl,
  onEdit,
  onDelete,
  onSheetCreated,
}: BookingFormActionsProps) {
  const [creatingSheet, setCreatingSheet] = useState(false)
  const [hasSheet, setHasSheet] = useState(!!googleSheetUrl)
  const [retryCount, setRetryCount] = useState(0)
  const [sheetError, setSheetError] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${label} إلى الحافظة`,
    })
  }

  const verifySheetCreation = async (maxRetries = 5) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(`/api/booking-forms/${formId}`)
        if (response.ok) {
          const form = await response.json()
          if (form.google_sheet_url) {
            console.log("[v0] ✅ تم التحقق من الجدول بنجاح")
            return true
          }
        }
        console.log(`[v0] الجدول ليس جاهز بعد، إعادة المحاولة... (${i + 1}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.warn("[v0] فشل فحص التحقق:", error)
      }
    }
    return false
  }

  const createNewSheet = async () => {
    setCreatingSheet(true)
    setRetryCount(0)
    setSheetError(null)
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[v0] إنشاء جدول Google Sheet (محاولة ${attempt}/${maxRetries})...`)

        const response = await fetch(`/api/booking-forms/${formId}/create-sheet`, {
          method: "POST",
        })

        const data = await response.json()

        if (response.ok) {
          console.log("[v0] تم الرد من الخادم بنجاح، جاري التحقق...")
          const verified = await verifySheetCreation()

          if (verified || data.googleSheetUrl) {
            setHasSheet(true)
            setRetryCount(0)
            setSheetError(null)
            toast({
              title: "✅ تم إنشاء الجدول بنجاح",
              description: "تم إنشاء جدول Google Sheet جديد وربطه بالنموذج",
            })
            onSheetCreated?.()
            setCreatingSheet(false)
            return
          } else {
            throw new Error("فشل التحقق من الجدول")
          }
        } else {
          const errorMessage = data.error || "خطأ غير معروف من الخادم"
          throw new Error(errorMessage)
        }
      } catch (error: any) {
        console.error(`[v0] فشلت المحاولة ${attempt}:`, error.message)
        setRetryCount(attempt)
        setSheetError(error.message)

        if (attempt < maxRetries) {
          console.log(`[v0] إعادة المحاولة بعد ثانيتين...`)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        } else {
          console.error("[v0] فشلت جميع محاولات إعادة المحاولة")
          toast({
            title: "❌ فشل في إنشاء الجدول",
            description: `${error.message}\n\nالرجاء التحقق من إعدادات Google Sheets في لوحة التحكم.`,
            variant: "destructive",
          })
        }
      }
    }

    setCreatingSheet(false)
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {sheetError && !creatingSheet && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 text-xs">{sheetError}</AlertDescription>
        </Alert>
      )}

      {/* الزر الأول: Google Sheet */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {hasSheet && googleSheetUrl ? (
              <Button
                onClick={() => copyToClipboard(googleSheetUrl, "رابط جدول Google Sheet")}
                className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Sheet className="h-4 w-4" />
                <span>نسخ الجدول</span>
              </Button>
            ) : (
              <Button
                onClick={createNewSheet}
                disabled={creatingSheet}
                className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {creatingSheet ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>جاري الإنشاء ({retryCount}/3)...</span>
                  </>
                ) : (
                  <>
                    <Sheet className="h-4 w-4" />
                    <span>إنشاء جدول جديد</span>
                  </>
                )}
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>{hasSheet ? "انسخ رابط جدول Google Sheet" : "لا يوجد جدول مرتبط حالياً"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* الزر الثاني: نسخ رابط النموذج */}
      <Button
        onClick={() => {
          const bookingUrl = `${window.location.origin}/booking/${formId}`
          copyToClipboard(bookingUrl, "رابط النموذج")
        }}
        className="w-full h-10 bg-slate-600 hover:bg-slate-700 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <Link2 className="h-4 w-4" />
        <span>نسخ الرابط</span>
      </Button>

      {/* الأزرار الثالثة والرابعة: التعديل والحذف */}
      <div className="flex gap-2">
        <Button
          onClick={onEdit}
          className="flex-1 h-10 bg-slate-700 hover:bg-slate-800 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">تعديل</span>
        </Button>
        <Button
          onClick={onDelete}
          className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium flex items-center justify-center gap-1 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">حذف</span>
        </Button>
      </div>
    </div>
  )
}
