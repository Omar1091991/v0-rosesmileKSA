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
        console.log("[v0] Fetching social media settings...")
        const response = await fetch("/api/site-settings")

        console.log("[v0] Response status:", response.status)

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.error("[v0] Error: Response is not JSON, content-type:", contentType)
          return
        }

        const data = await response.json()
        console.log("[v0] Received data:", data)

        if (data.error) {
          console.error("[v0] Error in response:", data.error)
          return
        }

        const settings = Array.isArray(data) ? data : data.settings || []

        if (!Array.isArray(settings)) {
          console.error("[v0] Invalid data format, expected array")
          return
        }

        const platforms = [
          { key: "facebook", icon: <Facebook className="h-5 w-5" /> },
          { key: "twitter", icon: <Twitter className="h-5 w-5" /> },
          { key: "instagram", icon: <Instagram className="h-5 w-5" /> },
          { key: "linkedin", icon: <Linkedin className="h-5 w-5" /> },
          { key: "youtube", icon: <Youtube className="h-5 w-5" /> },
        ]

        const links: SocialLink[] = []

        platforms.forEach((platform) => {
          const urlSetting = settings.find((s: any) => s.key === platform.key)

          if (urlSetting?.value) {
            links.push({
              platform: platform.key,
              url: urlSetting.value,
              visible: true,
              icon: platform.icon,
            })
          }
        })

        console.log("[v0] Processed social links:", links)
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
