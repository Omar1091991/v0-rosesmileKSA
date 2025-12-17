"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

type LanguageContextType = {
  language: "ar" | "en"
  setLanguage: (lang: "ar" | "en") => void
  isArabic: boolean
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<"ar" | "en">("ar")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "ar" | "en" | null
    if (savedLanguage) {
      setLanguageState(savedLanguage)
      document.documentElement.lang = savedLanguage
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
    }
    setMounted(true)
  }, [])

  const setLanguage = (newLanguage: "ar" | "en") => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
    document.documentElement.lang = newLanguage
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
  }

  // Prevent hydration mismatch by returning default until mounted
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "ar", setLanguage, isArabic: true }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isArabic: language === "ar" }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function LanguageSwitcher() {
  const context = useContext(LanguageContext)
  const [localLanguage, setLocalLanguage] = useState<"ar" | "en">("ar")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "ar" | "en" | null
    if (savedLanguage) {
      setLocalLanguage(savedLanguage)
    }
  }, [])

  const language = context?.language ?? localLanguage

  const toggleLanguage = () => {
    const newLanguage = language === "ar" ? "en" : "ar"
    if (context) {
      context.setLanguage(newLanguage)
    } else {
      setLocalLanguage(newLanguage)
      localStorage.setItem("language", newLanguage)
      document.documentElement.lang = newLanguage
      document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
    }
    window.location.reload()
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
      <Globe className="h-4 w-4" />
      {language === "ar" ? "ع" : "EN"}
    </Button>
  )
}

export function useLanguage(): { language: "ar" | "en"; isArabic: boolean } {
  const context = useContext(LanguageContext)
  const [language, setLanguage] = useState<"ar" | "en">("ar")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "ar" | "en" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  if (context) {
    return { language: context.language, isArabic: context.isArabic }
  }

  return { language, isArabic: language === "ar" }
}
