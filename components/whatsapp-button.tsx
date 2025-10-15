"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        console.log("[v0] Fetching WhatsApp settings...")
        const response = await fetch("/api/site-settings")

        if (!response.ok) {
          console.error("[v0] WhatsApp settings API returned:", response.status)
          return
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.error("[v0] WhatsApp settings API returned non-JSON response")
          return
        }

        const data = await response.json()
        console.log("[v0] WhatsApp settings data:", data)

        const settings = Array.isArray(data) ? data : data.settings || []

        const whatsappSetting = settings.find((s: any) => s.key === "whatsapp_number")
        const visibilitySetting = settings.find((s: any) => s.key === "whatsapp_visible")

        if (whatsappSetting?.value_ar) {
          setWhatsappNumber(whatsappSetting.value_ar)
        }

        if (visibilitySetting?.value_ar === "true") {
          setIsVisible(true)
        }
      } catch (error) {
        console.error("[v0] Error fetching WhatsApp settings:", error)
      }
    }

    fetchSettings()
  }, [])

  if (!isVisible || !whatsappNumber) return null

  const handleWhatsAppClick = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, "")
    const message = encodeURIComponent("مرحباً، أود الاستفسار عن خدماتكم")
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank")
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 active:scale-95"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  )
}
