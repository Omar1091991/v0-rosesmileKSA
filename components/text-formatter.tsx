"use client"

import { Button } from "@/components/ui/button"
import { Bold, Italic, Strikethrough } from "lucide-react"
import { useRef } from "react"

interface TextFormatterProps {
  value: string
  onChange: (value: string) => void
  id: string
  placeholder?: string
  rows?: number
}

export function TextFormatter({ value, onChange, id, placeholder, rows = 3 }: TextFormatterProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const applyFormat = (tag: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    if (selectedText) {
      // Wrap selected text with tag
      const before = value.substring(0, start)
      const after = value.substring(end)
      const formatted = `${before}<${tag}>${selectedText}</${tag}>${after}`
      onChange(formatted)

      // Restore focus and selection
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2)
      }, 0)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 border rounded-md p-1 bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormat("strong")}
          title="خط عريض (Bold)"
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormat("em")}
          title="مائل (Italic)"
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormat("s")}
          title="شطب (Strikethrough)"
          className="h-8 w-8 p-0"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground self-center px-2">حدد النص ثم اضغط على التنسيق المطلوب</span>
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        dir="rtl"
      />
    </div>
  )
}
