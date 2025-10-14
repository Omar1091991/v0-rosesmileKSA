"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right"
  delay?: number
}

export function AnimatedSection({ children, animation = "fade-up", delay = 0 }: AnimatedSectionProps) {
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
  }

  const selectedAnimation = animations[animation]

  return (
    <motion.div
      initial={selectedAnimation.initial}
      whileInView={selectedAnimation.animate}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
