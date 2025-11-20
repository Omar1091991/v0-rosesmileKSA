"use client"

import { useEffect, useState } from "react"

export function DynamicColors() {
  const [colors, setColors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchColors() {
      try {
        const response = await fetch("/api/site-settings?_t=" + Date.now(), {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!response.ok) {
          console.error("[v0] Failed to fetch site settings:", response.status)
          return
        }

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
      } finally {
        setLoading(false)
      }
    }

    fetchColors()

    const interval = setInterval(fetchColors, 30000)

    return () => clearInterval(interval)
  }, [])

  // Apply colors as CSS variables
  useEffect(() => {
    if (loading || Object.keys(colors).length === 0) return

    const root = document.documentElement

    const existingVars = Array.from(root.style).filter((prop) => prop.startsWith("--") && prop.includes("color"))
    existingVars.forEach((prop) => {
      root.style.removeProperty(prop)
    })

    // Apply each color as a CSS variable
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        const cssVarName = `--${key.replace(/_/g, "-")}`
        root.style.setProperty(cssVarName, value)
      }
    })

    document.body.style.display = "none"
    // biome-ignore lint: Force reflow
    document.body.offsetHeight
    document.body.style.display = ""
  }, [colors, loading])

  return null
}
