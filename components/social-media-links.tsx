"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { motion } from "framer-motion"

interface SocialLink {
  platform: string
  url: string
  visible: boolean
  icon: React.ReactNode
}

export function SocialMediaLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/site-settings")
        const data = await response.json()

        const platforms = [
          { key: "facebook", icon: <Facebook className="h-5 w-5" /> },
          { key: "twitter", icon: <Twitter className="h-5 w-5" /> },
          { key: "instagram", icon: <Instagram className="h-5 w-5" /> },
          { key: "linkedin", icon: <Linkedin className="h-5 w-5" /> },
          { key: "youtube", icon: <Youtube className="h-5 w-5" /> },
          {
            key: "tiktok",
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            ),
          },
          {
            key: "snapchat",
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.206 2.024c-1.013 0-2.023.211-2.843.619-.857.426-1.504 1.056-1.873 1.822-.369.766-.45 1.684-.45 2.684v.623c-.137.024-.274.048-.411.072-.411.072-.822.145-1.233.266-.411.121-.822.29-1.185.508-.363.218-.678.484-.918.798-.24.314-.411.677-.411 1.089 0 .363.097.702.29.992.193.29.459.532.774.726.315.193.677.338 1.04.435.362.097.726.145 1.088.145.097 0 .193 0 .29-.024.096-.024.193-.048.29-.072.096-.024.193-.048.29-.097.096-.048.193-.097.29-.169.096-.072.193-.169.266-.29.072-.121.121-.266.121-.435 0-.169-.024-.338-.097-.484-.072-.145-.169-.266-.29-.363-.121-.097-.266-.169-.435-.218-.169-.048-.363-.072-.58-.072-.097 0-.193 0-.29.024-.096.024-.193.048-.29.097-.096.048-.193.097-.29.169-.096.072-.193.169-.266.29-.072.121-.121.266-.121.435 0 .169.024.338.097.484.072.145.169.266.29.363.121.097.266.169.435.218.169.048.363.072.58.072.097 0 .193 0 .29-.024.096-.024.193-.048.29-.097.096-.048.193-.097.29-.169.096-.072.193-.169.266-.29.072-.121.121-.266.121-.435 0-.169-.024-.338-.097-.484-.072-.145-.169-.266-.29-.363-.121-.097-.266-.169-.435-.218-.169-.048-.363-.072-.58-.072z" />
              </svg>
            ),
          },
        ]

        const links: SocialLink[] = []

        platforms.forEach((platform) => {
          const urlSetting = data.find((s: any) => s.key === `${platform.key}_url`)
          const visibleSetting = data.find((s: any) => s.key === `${platform.key}_visible`)

          if (urlSetting?.value_ar && visibleSetting?.value_ar === "true") {
            links.push({
              platform: platform.key,
              url: urlSetting.value_ar,
              visible: true,
              icon: platform.icon,
            })
          }
        })

        setSocialLinks(links)
      } catch (error) {
        console.error("[v0] Error fetching social media settings:", error)
      }
    }

    fetchSettings()
  }, [])

  if (socialLinks.length === 0) return null

  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((link, index) => (
        <motion.a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          {link.icon}
        </motion.a>
      ))}
    </div>
  )
}
