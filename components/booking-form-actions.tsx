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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${label} إلى الحافظة`,
    })
  }

  const createNewSheet = async () => {
    setCreatingSheet(true)
    try {
      const response = await fetch(`/api/booking-forms/${formId}/create-sheet`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setHasSheet(true)
        toast({
          title: "✅ تم إنشاء الجدول بنجاح",
          description: "تم إنشاء جدول Google Sheet جديد وربطه بالنموذج",
        })
        onSheetCreated?.()
      } else {
        toast({
          title: "خطأ",
          description: "فشل في إنشاء جدول Google Sheet",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error creating sheet:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الجدول",
        variant: "destructive",
      })
    } finally {
      setCreatingSheet(false)
    }
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
                    <span>جاري الإنشاء...</span>
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
