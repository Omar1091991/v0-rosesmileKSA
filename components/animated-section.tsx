"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "bounce" | "rotate"
  delay?: number
  section?: string
}

export function AnimatedSection({ children, animation = "fade-up", delay = 0, section }: AnimatedSectionProps) {
  const [animationType, setAnimationType] = useState(animation)
  const [animationDuration, setAnimationDuration] = useState(0.6)

  useEffect(() => {
    if (section) {
      fetch("/api/site-settings")
        .then((res) => res.json())
        .then((data) => {
          const typeKey = `${section}_animation_type`
          const durationKey = `${section}_animation_duration`

          const typeSetting = data.find((s: any) => s.key === typeKey)
          const durationSetting = data.find((s: any) => s.key === durationKey)

          if (typeSetting) setAnimationType(typeSetting.value_ar)
          if (durationSetting) setAnimationDuration(Number.parseFloat(durationSetting.value_ar))
        })
        .catch((error) => console.error("[v0] Error fetching animation settings:", error))
    }
  }, [section])

  const animations = {
    "fade-up": {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
    },
    "fade-in": {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    "scale-in": {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
    "slide-left": {
      initial: { opacity: 0, x: -40 },
      animate: { opacity: 1, x: 0 },
    },
    "slide-right": {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
    },
    bounce: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    rotate: {
      initial: { opacity: 0, rotate: -10 },
      animate: { opacity: 1, rotate: 0 },
    },
  }

  const selectedAnimation = animations[animationType as keyof typeof animations] || animations["fade-up"]

  return (
    <motion.div
      initial={selectedAnimation.initial}
      whileInView={selectedAnimation.animate}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: animationDuration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
