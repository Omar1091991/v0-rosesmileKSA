"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AutoScrollCarouselProps {
  children: React.ReactNode[]
  itemsPerView?: number
  scrollDuration?: number // in seconds
  direction?: "left" | "right"
  gap?: number // gap between items in pixels
  autoScroll?: boolean
}

export function AutoScrollCarousel({
  children,
  itemsPerView = 3,
  scrollDuration = 3,
  direction = "right",
  gap = 24,
  autoScroll = true,
}: AutoScrollCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const totalItems = children.length
  const maxIndex = Math.max(0, totalItems - itemsPerView)

  useEffect(() => {
    if (!autoScroll || isPaused || totalItems <= itemsPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = direction === "right" ? prev + 1 : prev - 1

        // Loop back to start/end
        if (next > maxIndex) return 0
        if (next < 0) return maxIndex

        return next
      })
    }, scrollDuration * 1000)

    return () => clearInterval(interval)
  }, [autoScroll, isPaused, scrollDuration, direction, maxIndex, totalItems, itemsPerView])

  useEffect(() => {
    if (!scrollRef.current) return

    const itemWidth = scrollRef.current.scrollWidth / totalItems
    const scrollPosition = currentIndex * itemWidth

    scrollRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    })
  }, [currentIndex, totalItems])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
  }

  if (totalItems === 0) return null

  return (
    <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {totalItems > itemsPerView && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="السابق"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="التالي"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          gap: `${gap}px`,
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{
              width: `calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})`,
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {totalItems > itemsPerView && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
              }`}
              aria-label={`الانتقال إلى المجموعة ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
