"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D9%84%D9%88%D8%AC%D9%88%20512%D8%B4%D9%81%D8%A7%D9%81-qVL2lmwIonjbkJG7Aoappul690hNUb.png"
          alt="RoseSmile Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </motion.div>

      <motion.div
        className="flex items-center gap-2 text-xl font-semibold text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span>جاري التحميل</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          ...
        </motion.span>
      </motion.div>
    </div>
  )
}
