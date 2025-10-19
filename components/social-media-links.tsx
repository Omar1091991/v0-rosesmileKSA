"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { motion } from "framer-motion"

interface SocialLink {
  platform: string
  url: string
  visible: boolean
  icon: React.ReactNode
}

const TikTokIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

const SnapchatIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.206 2.003a7.482 7.482 0 0 0-7.723 6.297c-.244 1.814.232 3.169.923 4.155.347.495.673.85.88 1.092a.38.38 0 0 1-.048.537 2.11 2.11 0 0 1-.706.354c-.388.12-.82.214-1.213.308-.393.095-.786.19-1.108.324-.645.27-1.041.771-1.041 1.32 0 .548.396 1.05 1.041 1.32.322.134.715.229 1.108.324.393.094.825.188 1.213.308.26.08.5.196.706.354a.38.38 0 0 1 .048.537c-.207-.242-.533-.597-.88-1.092-.691-.986-1.167-2.341-.923-4.155a7.482 7.482 0 0 0 7.723 6.297 7.482 7.482 0 0 0 7.723-6.297c.244-1.814-.232-3.169-.923-4.155-.347-.495-.673-.85-.88-1.092a.38.38 0 0 1 .048-.537c.206-.158.446-.274.706-.354.388-.12.82-.214 1.213-.308.393-.095.786-.19 1.108-.324.645-.27 1.041-.771 1.041-1.32 0-.548-.396-1.05-1.041-1.32-.322-.134-.715-.229-1.108-.324-.393-.094-.825-.188-1.213-.308a2.11 2.11 0 0 1-.706-.354.38.38 0 0 1-.048-.537c.207-.242.533-.597.88-1.092.691-.986 1.167-2.341.923-4.155A7.482 7.482 0 0 0 12.206 2.003z" />
  </svg>
)

export function SocialMediaLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  useEffect(() => {
    async function fetchSettings() {
      try {
        console.log("[v0] Fetching social media settings...")
        const response = await fetch("/api/site-settings", {
          next: { revalidate: 60 },
        })

        console.log("[v0] Response status:", response.status)

        if (!response.ok) {
          console.error("[v0] API returned error status:", response.status)
          return
        }

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
          { key: "youtube", icon: <Youtube className="h-5 w-5" /> },
          { key: "tiktok", icon: <TikTokIcon /> },
          { key: "snapchat", icon: <SnapchatIcon /> },
        ]

        const links: SocialLink[] = []

        platforms.forEach((platform) => {
          const urlSetting = settings.find((s: any) => s.key === `${platform.key}_url`)
          const visibleSetting = settings.find((s: any) => s.key === `${platform.key}_visible`)

          const isVisible = visibleSetting?.value_ar === "true" || visibleSetting?.value === "true"
          const url = urlSetting?.value_ar || urlSetting?.value

          console.log(`[v0] ${platform.key}: visible=${isVisible}, url=${url}`)

          if (isVisible && url) {
            links.push({
              platform: platform.key,
              url: url,
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

  const getBrandColor = (platform: string) => {
    const colors: Record<string, string> = {
      facebook: "#1877F2",
      twitter: "#1DA1F2",
      instagram: "#E4405F",
      youtube: "#FF0000",
      tiktok: "#000000",
      snapchat: "#FFFC00",
    }
    return colors[platform] || "#666"
  }

  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((link, index) => (
        <motion.a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          whileHover={{
            scale: 1.2,
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
          whileTap={{ scale: 0.9 }}
          className="relative group"
        >
          <motion.div
            className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity"
            style={{ backgroundColor: getBrandColor(link.platform) }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <div
            className="relative p-3 rounded-full transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: getBrandColor(link.platform),
              color: link.platform === "snapchat" ? "#000" : "#fff",
            }}
          >
            {link.icon}
          </div>
        </motion.a>
      ))}
    </div>
  )
}
