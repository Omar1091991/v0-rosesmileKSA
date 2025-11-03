"use client"

import { useEffect, useState } from "react"

export function DynamicThemeColors() {
  const [colors, setColors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchColors() {
      try {
        const response = await fetch("/api/site-settings")
        const settingsData = await response.json()
        const settings = Array.isArray(settingsData) ? settingsData : settingsData.settings || []

        const colorMap: Record<string, string> = {}

        // Map all color settings to CSS variables
        settings.forEach((setting: any) => {
          if (setting.key && setting.value_ar) {
            // Convert snake_case to kebab-case for CSS variables
            const cssVarName = setting.key.replace(/_/g, "-")
            colorMap[cssVarName] = setting.value_ar
          }
        })

        setColors(colorMap)
      } catch (error) {
        console.error("Error fetching theme colors:", error)
      }
    }

    fetchColors()
  }, [])

  // Generate CSS variables dynamically
  const cssVariables = Object.entries(colors)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n    ")

  return (
    <style jsx global>{`
      :root {
        ${cssVariables}
      }
    `}</style>
  )
}
