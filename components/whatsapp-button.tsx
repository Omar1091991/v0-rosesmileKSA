"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 bg-background border rounded-lg shadow-lg p-4 max-w-xs"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm">تواصل معنا عبر واتساب</h3>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">نحن هنا للإجابة على استفساراتك</p>
            <Button onClick={handleWhatsAppClick} className="w-full bg-[#25D366] hover:bg-[#20BA5A]" size="sm">
              <MessageCircle className="ml-2 h-4 w-4" />
              ابدأ المحادثة
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </div>
  )
}
