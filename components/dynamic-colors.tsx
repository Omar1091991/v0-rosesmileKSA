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
            setting.key.includes("_border_") ||
            setting.key.includes("book_appointment_") ||
            setting.key.includes("sidebar_")
          ) {
            colorSettings[setting.key] = setting.value_ar || ""
          }
        })

        setColors(colorSettings)
      } catch (error) {
        console.error("Error fetching colors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchColors()

    const interval = setInterval(() => {
      fetchColors()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (loading || Object.keys(colors).length === 0) return

    const root = document.documentElement

    // Apply each color as a CSS variable
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        const cssVarName = `--${key.replace(/_/g, "-")}`
        root.style.setProperty(cssVarName, value)
      }
    })

    // Force CSS recalculation without visible reload
    requestAnimationFrame(() => {
      root.style.transform = "translateZ(0)"
      requestAnimationFrame(() => {
        root.style.transform = ""
      })
    })
  }, [colors, loading])

  return null
}
