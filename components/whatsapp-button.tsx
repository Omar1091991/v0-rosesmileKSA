"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState("+966500000000") // Default number
  const [isVisible, setIsVisible] = useState(true) // Default to visible

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/site-settings")

        if (!response.ok) {
          return
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          return
        }

        const data = await response.json()
        const settings = Array.isArray(data) ? data : data.settings || []

        const whatsappSetting = settings.find((s: any) => s.key === "whatsapp_number")
        const visibilitySetting = settings.find((s: any) => s.key === "whatsapp_visible")

        if (whatsappSetting?.value_ar) {
          setWhatsappNumber(whatsappSetting.value_ar)
        }

        // Only hide if explicitly set to false
        if (visibilitySetting?.value_ar === "false") {
          setIsVisible(false)
        }
      } catch (error) {
        console.error("[v0] WhatsAppButton: Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  if (!isVisible) {
    return null
  }

  const handleWhatsAppClick = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, "")
    const message = encodeURIComponent("مرحباً، أود الاستفسار عن خدماتكم")
    const url = `https://wa.me/${cleanNumber}?text=${message}`
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
