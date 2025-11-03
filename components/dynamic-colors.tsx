"use client"

import { useEffect, useState } from "react"

export function DynamicColors() {
  const [colors, setColors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchColors() {
      try {
        const response = await fetch("/api/site-settings")
        if (!response.ok) return

        const data = await response.json()
        const settings = Array.isArray(data) ? data : data.settings || []

        const colorSettings: Record<string, string> = {}
        settings.forEach((setting: any) => {
          if (
            setting.key.includes("color") ||
            setting.key.includes("background") ||
            setting.key.includes("_title_color") ||
            setting.key.includes("_text_color") ||
            setting.key.includes("_description_color") ||
            setting.key.includes("header_") ||
            setting.key.includes("footer_") ||
            setting.key.includes("button_") ||
            setting.key.includes("card_") ||
            setting.key.includes("_hover_") ||
            setting.key.includes("_border_")
          ) {
            colorSettings[setting.key] = setting.value_ar || ""
          }
        })

        setColors(colorSettings)
      } catch (error) {
        console.error("[v0] Error fetching colors:", error)
      }
    }

    fetchColors()
  }, [])

  // Apply colors as CSS variables
  useEffect(() => {
    if (Object.keys(colors).length === 0) return

    const root = document.documentElement

    // Apply each color as a CSS variable
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--${key.replace(/_/g, "-")}`, value)
      }
    })

    console.log("[v0] Applied", Object.keys(colors).length, "custom colors")
  }, [colors])

  return null
}
