"use client"

import { Button } from "@/components/ui/button"
import { Bold, Italic, Strikethrough, Palette } from "lucide-react"
import { useRef, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TextFormatterProps {
  value: string
  onChange: (value: string) => void
  id: string
  placeholder?: string
  rows?: number
}

export function TextFormatter({ value, onChange, id, placeholder, rows = 3 }: TextFormatterProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [selectedColor, setSelectedColor] = useState("#000000")

  const colors = [
    "#000000",
    "#E91E63",
    "#2196F3",
    "#4CAF50",
    "#FF9800",
    "#9C27B0",
    "#F44336",
    "#00BCD4",
    "#8BC34A",
    "#FF5722",
  ]

  const applyFormat = (tag: string, attribute?: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    if (selectedText) {
      const before = value.substring(0, start)
      const after = value.substring(end)
      const openTag = attribute ? `<${tag} ${attribute}>` : `<${tag}>`
      const formatted = `${before}${openTag}${selectedText}</${tag}>${after}`
      onChange(formatted)

      // Restore focus and selection
      setTimeout(() => {
        textarea.focus()
        const offset = openTag.length
        textarea.setSelectionRange(start + offset, end + offset)
      }, 0)
    }
  }

  const applyColor = (color: string) => {
    applyFormat("span", `style="color: ${color}"`)
    setSelectedColor(color)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 border rounded-md p-1 bg-muted/50 flex-wrap">
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

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="لون الخط" className="h-8 w-8 p-0">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? "#000" : "transparent",
                  }}
                  onClick={() => applyColor(color)}
                  title={color}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => applyColor(e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
          </PopoverContent>
        </Popover>

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
