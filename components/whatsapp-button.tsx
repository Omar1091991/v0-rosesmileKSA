"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState("+966500000000") // Default number
  const [isVisible, setIsVisible] = useState(true) // Default to visible

  useEffect(() => {
    async function fetchSettings() {
      try {
        console.log("[v0] WhatsAppButton: Fetching settings...")
        const response = await fetch("/api/site-settings")

        if (!response.ok) {
          console.log("[v0] WhatsAppButton: Response not OK, using defaults")
          return
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.log("[v0] WhatsAppButton: Response not JSON, using defaults")
          return
        }

        const data = await response.json()
        const settings = Array.isArray(data) ? data : data.settings || []

        console.log("[v0] WhatsAppButton: Fetched", settings.length, "settings")

        const whatsappSetting = settings.find((s: any) => s.key === "whatsapp_number")
        const visibilitySetting = settings.find((s: any) => s.key === "whatsapp_visible")

        console.log("[v0] WhatsAppButton: whatsapp_number setting:", whatsappSetting)
        console.log("[v0] WhatsAppButton: whatsapp_visible setting:", visibilitySetting)

        if (whatsappSetting?.value_ar) {
          setWhatsappNumber(whatsappSetting.value_ar)
          console.log("[v0] WhatsAppButton: Set number to:", whatsappSetting.value_ar)
        } else {
          console.log("[v0] WhatsAppButton: Using default number:", "+966500000000")
        }

        // Only hide if explicitly set to false
        if (visibilitySetting?.value_ar === "false") {
          setIsVisible(false)
          console.log("[v0] WhatsAppButton: Button hidden by settings")
        } else {
          console.log("[v0] WhatsAppButton: Button visible (default or enabled)")
        }
      } catch (error) {
        console.error("[v0] WhatsAppButton: Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  console.log("[v0] WhatsAppButton: Rendering with isVisible=", isVisible, "number=", whatsappNumber)

  if (!isVisible) {
    console.log("[v0] WhatsAppButton: Not rendering (hidden)")
    return null
  }

  const handleWhatsAppClick = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, "")
    const message = encodeURIComponent("مرحباً، أود الاستفسار عن خدماتكم")
    const url = `https://wa.me/${cleanNumber}?text=${message}`
    console.log("[v0] WhatsAppButton: Opening WhatsApp URL:", url)
    window.open(url, "_blank")
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 left-6 z-[9999] bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 active:scale-95"
      aria-label="تواصل عبر واتساب"
      style={{ position: "fixed", bottom: "24px", left: "24px", zIndex: 9999 }}
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  )
}
