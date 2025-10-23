"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface HeroSlideshowProps {
  images: string[]
  duration?: number
  animationType?: string
}

export function HeroSlideshow({ images, duration = 5, animationType = "fade-in" }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [images.length, duration])

  useEffect(() => {
    if (images.length === 0) {
      setIsLoading(false)
      return
    }

    // Preload first image
    const img = new window.Image()
    img.src = images[0]
    img.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(0))
      setIsLoading(false)
    }
    img.onerror = () => {
      setIsLoading(false)
    }
  }, [images])

  const animations: Record<string, any> = {
    "fade-in": {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    "scale-in": {
      initial: { opacity: 0, scale: 1.1 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    "slide-left": {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
    },
    "slide-right": {
      initial: { opacity: 0, x: -100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 },
    },
    "fade-up": {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -40 },
    },
  }

  const animation = animations[animationType] || animations["fade-in"]

  if (isLoading || images.length === 0) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/5 to-secondary/5 flex flex-col items-center justify-center gap-6 p-8">
        {/* Logo with pulse animation */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="relative w-32 h-32 sm:w-40 sm:h-40"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D9%84%D9%88%D8%AC%D9%88%20512%D8%B4%D9%81%D8%A7%D9%81-qVL2lmwIonjbkJG7Aoappul690hNUb.png"
            alt="RoseSmile Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Loading text with animated dots */}
        <div className="flex items-center gap-2">
          <motion.span
            className="text-lg sm:text-xl font-semibold text-primary"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            جاري التحميل
          </motion.span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
        <Image src={images[0] || "/placeholder.svg"} alt="صورة القسم الرئيسي" fill className="object-cover" priority />
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={animation.initial}
          animate={animation.animate}
          exit={animation.exit}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`صورة القسم الرئيسي ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Slideshow indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`الانتقال إلى الصورة ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}
