"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/site-settings")
        const data = await response.json()

        const whatsappSetting = data.find((s: any) => s.key === "whatsapp_number")
        const visibilitySetting = data.find((s: any) => s.key === "whatsapp_visible")

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
