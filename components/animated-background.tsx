"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ToothIcon {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  rotation: number
}

export function AnimatedBackground() {
  const [teeth, setTeeth] = useState<ToothIcon[]>([])

  useEffect(() => {
    // Generate random tooth icons
    const generateTeeth = () => {
      const newTeeth: ToothIcon[] = []
      const count = 20 // Increased number of tooth icons from 15 to 20

      for (let i = 0; i < count; i++) {
        newTeeth.push({
          id: i,
          x: Math.random() * 100, // Random x position (0-100%)
          y: Math.random() * 100, // Random y position (0-100%)
          size: 40 + Math.random() * 50, // Increased size from 30-70px to 40-90px
          duration: 15 + Math.random() * 15, // Faster animation from 20-40s to 15-30s
          delay: Math.random() * 5, // Random delay (0-5s)
          rotation: Math.random() * 360, // Random initial rotation
        })
      }

      setTeeth(newTeeth)
    }

    generateTeeth()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {teeth.map((tooth) => (
        <motion.div
          key={tooth.id}
          className="absolute"
          style={{
            left: `${tooth.x}%`,
            top: `${tooth.y}%`,
            width: tooth.size,
            height: tooth.size,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            rotate: tooth.rotation,
          }}
          animate={{
            opacity: [0, 0.35, 0.35, 0],
            scale: [0, 1, 1, 0],
            rotate: [tooth.rotation, tooth.rotation + 360],
            y: [0, -100, -200, -300],
          }}
          transition={{
            duration: tooth.duration,
            delay: tooth.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {/* Tooth SVG Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-primary/30"
          >
            <path
              d="M12 2C10.5 2 9 2.5 8 3.5C7 4.5 6.5 6 6.5 7.5C6.5 9 6.5 10.5 6.5 12C6.5 13.5 6.5 15 6.5 16.5C6.5 18 7 19.5 8 20.5C9 21.5 10.5 22 12 22C13.5 22 15 21.5 16 20.5C17 19.5 17.5 18 17.5 16.5C17.5 15 17.5 13.5 17.5 12C17.5 10.5 17.5 9 17.5 7.5C17.5 6 17 4.5 16 3.5C15 2.5 13.5 2 12 2Z"
              fill="currentColor"
              opacity="0.7"
            />
            <path
              d="M10 4C9 4.5 8.5 5.5 8.5 7C8.5 8.5 8.5 10 8.5 11.5C8.5 13 8.5 14.5 8.5 16C8.5 17 9 18 10 18.5"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
            />
            <path
              d="M14 4C15 4.5 15.5 5.5 15.5 7C15.5 8.5 15.5 10 15.5 11.5C15.5 13 15.5 14.5 15.5 16C15.5 17 15 18 14 18.5"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
