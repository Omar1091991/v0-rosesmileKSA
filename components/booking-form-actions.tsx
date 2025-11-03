"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link2, Sheet, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
            console.log("[v0] ✅ Sheet verified successfully")
            return true
          }
        }
        console.log(`[v0] Sheet not ready yet, retrying... (${i + 1}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.warn("[v0] Verification check failed:", error)
      }
    }
    return false
  }

  const createNewSheet = async () => {
    setCreatingSheet(true)
    setRetryCount(0)
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[v0] Creating Google Sheet (Attempt ${attempt}/${maxRetries})...`)

        const response = await fetch(`/api/booking-forms/${formId}/create-sheet`, {
          method: "POST",
        })

        if (response.ok) {
          const data = await response.json()

          console.log("[v0] Sheet endpoint returned success, verifying...")
          const verified = await verifySheetCreation()

          if (verified || data.googleSheetUrl) {
            setHasSheet(true)
            setRetryCount(0)
            toast({
              title: "✅ تم إنشاء الجدول بنجاح",
              description: "تم إنشاء جدول Google Sheet جديد وربطه بالنموذج",
            })
            onSheetCreated?.()
            setCreatingSheet(false)
            return
          } else {
            throw new Error("Sheet verification failed")
          }
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Unknown error from server")
        }
      } catch (error: any) {
        console.error(`[v0] Attempt ${attempt} failed:`, error.message)
        setRetryCount(attempt)

        if (attempt < maxRetries) {
          console.log(`[v0] Retrying in 2 seconds...`)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        } else {
          console.error("[v0] All retry attempts failed")
          toast({
            title: "❌ فشل في إنشاء الجدول",
            description: `${error.message} (بعد ${maxRetries} محاولات). الرجاء التحقق من إعدادات Google Cloud.`,
            variant: "destructive",
          })
        }
      }
    }

    setCreatingSheet(false)
  }

  return (
    <div className="flex flex-col gap-2 w-full">
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
