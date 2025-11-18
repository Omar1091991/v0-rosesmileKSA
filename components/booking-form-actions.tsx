"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BookingFormActionsProps {
  formId: string
  formName: string
  onEdit: () => void
  onDelete: () => void
  onView: () => void
}

export function BookingFormActions({
  formId,
  formName,
  onEdit,
  onDelete,
  onView,
}: BookingFormActionsProps) {
  const [isCopying, setIsCopying] = useState(false)

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

  return (
    <TooltipProvider>
      <div className="flex gap-1">
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onView}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>معاينة صفحة الحجز</TooltipContent>
        </Tooltip>

        {/* زر التعديل */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
            >
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
