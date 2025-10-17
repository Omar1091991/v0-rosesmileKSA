"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"

interface DentalIcon {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  rotation: number
  type: "tooth" | "toothbrush" | "mirror" | "drill" | "molar" | "logo"
}

// SVG Components for different dental icons
const ToothIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path
      d="M12 2C10.5 2 9 2.5 8 3.5C7 4.5 6.5 6 6.5 7.5C6.5 9 6.5 10.5 6.5 12C6.5 13.5 6.5 15 6.5 16.5C6.5 18 7 19.5 8 20.5C9 21.5 10.5 22 12 22C13.5 22 15 21.5 16 20.5C17 19.5 17.5 18 17.5 16.5C17.5 15 17.5 13.5 17.5 12C17.5 10.5 17.5 9 17.5 7.5C17.5 6 17 4.5 16 3.5C15 2.5 13.5 2 12 2Z"
      fill="currentColor"
      opacity="0.7"
    />
  </svg>
)

const MolarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path
      d="M8 4C6 4 4 6 4 8V12C4 14 4 16 5 18C6 20 7 21 8 21C9 21 10 20 10 18V12V8C10 6 9 4 8 4Z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M16 4C18 4 20 6 20 8V12C20 14 20 16 19 18C18 20 17 21 16 21C15 21 14 20 14 18V12V8C14 6 15 4 16 4Z"
      fill="currentColor"
      opacity="0.7"
    />
  </svg>
)

const ToothbrushIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="3" y="10" width="8" height="4" rx="1" fill="currentColor" opacity="0.7" />
    <path
      d="M11 10L18 3C18.5 2.5 19.5 2.5 20 3C20.5 3.5 20.5 4.5 20 5L13 12"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.7"
    />
    <line x1="4" y1="11" x2="4" y2="13" stroke="currentColor" strokeWidth="0.5" />
    <line x1="6" y1="11" x2="6" y2="13" stroke="currentColor" strokeWidth="0.5" />
    <line x1="8" y1="11" x2="8" y2="13" stroke="currentColor" strokeWidth="0.5" />
    <line x1="10" y1="11" x2="10" y2="13" stroke="currentColor" strokeWidth="0.5" />
  </svg>
)

const MirrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <circle cx="12" cy="8" r="6" fill="currentColor" opacity="0.5" />
    <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="1" opacity="0.7" />
    <line x1="12" y1="14" x2="12" y2="22" stroke="currentColor" strokeWidth="2" opacity="0.7" />
  </svg>
)

const DrillIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="10" y="2" width="4" height="6" rx="1" fill="currentColor" opacity="0.7" />
    <path d="M9 8L15 8L14 14L10 14L9 8Z" fill="currentColor" opacity="0.6" />
    <line x1="12" y1="14" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
    <circle cx="12" cy="21" r="1" fill="currentColor" opacity="0.7" />
  </svg>
)

export function AnimatedBackground() {
  const [icons, setIcons] = useState<DentalIcon[]>([])

  useEffect(() => {
    const generateIcons = () => {
      const newIcons: DentalIcon[] = []
      const count = 30
      const types: DentalIcon["type"][] = ["tooth", "toothbrush", "mirror", "drill", "molar", "logo", "logo"]

      for (let i = 0; i < count; i++) {
        newIcons.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 50 + Math.random() * 80,
          duration: 15 + Math.random() * 15,
          delay: Math.random() * 5,
          rotation: Math.random() * 360,
          type: types[Math.floor(Math.random() * types.length)],
        })
      }

      setIcons(newIcons)
    }

    generateIcons()
  }, [])

  const renderIcon = (type: DentalIcon["type"]) => {
    switch (type) {
      case "tooth":
        return <ToothIcon />
      case "molar":
        return <MolarIcon />
      case "toothbrush":
        return <ToothbrushIcon />
      case "mirror":
        return <MirrorIcon />
      case "drill":
        return <DrillIcon />
      case "logo":
        return (
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled-2-iVEA0ISnmn0GPMPijj4fvY3wRhkNtj.png"
            alt="Rose Smile Logo"
            fill
            className="object-contain"
          />
        )
      default:
        return <ToothIcon />
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className={icon.type === "logo" ? "absolute opacity-20" : "absolute text-primary/30"}
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            width: icon.size,
            height: icon.size,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            rotate: icon.rotation,
          }}
          animate={{
            opacity: icon.type === "logo" ? [0, 0.25, 0.25, 0] : [0, 0.35, 0.35, 0],
            scale: [0, 1, 1, 0],
            rotate: [icon.rotation, icon.rotation + 360],
            y: [0, -100, -200, -300],
          }}
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {renderIcon(icon.type)}
        </motion.div>
      ))}
    </div>
  )
}
