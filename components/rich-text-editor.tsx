"use client"

import { useCallback, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Strikethrough, Palette } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function RichTextEditor({ value, onChange, placeholder, rows = 10 }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const colors = [
    { name: "أسود", value: "#000000" },
    { name: "أحمر", value: "#ef4444" },
    { name: "أزرق", value: "#3b82f6" },
    { name: "أخضر", value: "#22c55e" },
    { name: "أصفر", value: "#eab308" },
    { name: "بنفسجي", value: "#a855f7" },
    { name: "وردي", value: "#ec4899" },
    { name: "برتقالي", value: "#f97316" },
  ]

  const insertTag = useCallback(
    (openTag: string, closeTag: string) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const beforeText = value.substring(0, start)
      const afterText = value.substring(end)

      const newValue = `${beforeText}${openTag}${selectedText}${closeTag}${afterText}`
      onChange(newValue)

      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + openTag.length + selectedText.length + closeTag.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    },
    [value, onChange],
  )

  const insertColorTag = useCallback(
    (color: string) => {
      insertTag(`<span style="color: ${color}">`, "</span>")
    },
    [insertTag],
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-muted/50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertTag("<strong>", "</strong>")}
          title="خط سميك"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => insertTag("<em>", "</em>")} title="خط مائل">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => insertTag("<s>", "</s>")} title="خط مشطوب">
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm" title="لون النص">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.value }}
                  onClick={() => insertColorTag(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
      <div className="text-sm text-muted-foreground">
        <p>يمكنك استخدام الأزرار أعلاه لتنسيق النص:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>حدد النص ثم اضغط على الزر المطلوب</li>
          <li>
            <strong>خط سميك</strong> - لجعل النص بارزاً
          </li>
          <li>
            <em>خط مائل</em> - للتأكيد
          </li>
          <li>
            <s>خط مشطوب</s> - للنص الملغى
          </li>
          <li>
            <span style={{ color: "#ef4444" }}>ألوان</span> - لتلوين النص
          </li>
        </ul>
      </div>
    </div>
  )
}
