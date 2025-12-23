"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Edit, Trash2, Eye, FileSpreadsheet, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BookingFormActionsProps {
  formId: string
  formName: string
  googleSheetUrl?: string | null
  onEdit: () => void
  onDelete: () => void
  onView: () => void
  onSheetCreated?: (sheetUrl: string) => void
}

export function BookingFormActions({
  formId,
  formName,
  googleSheetUrl,
  onEdit,
  onDelete,
  onView,
  onSheetCreated,
}: BookingFormActionsProps) {
  const [isCopying, setIsCopying] = useState(false)
  const [isCreatingSheet, setIsCreatingSheet] = useState(false)

  const bookingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/booking/${formId}`

  const copyToClipboard = async (text: string, label: string) => {
    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(text)
      toast({
        title: "تم النسخ!",
        description: `تم نسخ ${label} بنجاح`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل نسخ النص",
      })
    } finally {
      setTimeout(() => setIsCopying(false), 1000)
    }
  }

  const handleCreateSheet = async () => {
    try {
      setIsCreatingSheet(true)
      const response = await fetch("/api/google-sheets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, formName }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "تم بنجاح",
          description: "تم إنشاء وربط Google Sheet بالنموذج",
        })
        if (onSheetCreated) {
          onSheetCreated(data.sheetUrl)
        }
      } else {
        throw new Error(data.error || "فشل في إنشاء الشيت")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إنشاء الشيت",
      })
    } finally {
      setIsCreatingSheet(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex gap-1 flex-wrap">
        {googleSheetUrl ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => window.open(googleSheetUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>فتح Google Sheet</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={handleCreateSheet}
                disabled={isCreatingSheet}
              >
                {isCreatingSheet ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>إنشاء Google Sheet</TooltipContent>
          </Tooltip>
        )}

        {/* زر نسخ رابط الحجز */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => copyToClipboard(bookingUrl, "رابط صفحة الحجز")}
              disabled={isCopying}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>انسخ رابط صفحة الحجز</TooltipContent>
        </Tooltip>

        {/* زر المعاينة */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>معاينة صفحة الحجز</TooltipContent>
        </Tooltip>

        {/* زر التعديل */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>تعديل النموذج</TooltipContent>
        </Tooltip>

        {/* زر الحذف */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>حذف النموذج</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
