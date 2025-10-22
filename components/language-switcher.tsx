"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<"ar" | "en">("ar")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "ar" | "en" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
      document.documentElement.lang = savedLanguage
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "ar" ? "en" : "ar"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    document.documentElement.lang = newLanguage
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
    window.location.reload() // Reload to apply language changes
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
      <Globe className="h-4 w-4" />
      {language === "ar" ? "EN" : "ع"}
    </Button>
  )
}

export function useLanguage() {
  const [language, setLanguage] = useState<"ar" | "en">("ar")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "ar" | "en" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  return language
}
