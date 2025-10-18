"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AutoScrollCarouselProps {
  children: React.ReactNode[]
  itemsPerView?: number
  scrollDuration?: number
  direction?: "left" | "right"
  gap?: number
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
  const [isManualScrolling, setIsManualScrolling] = useState(false)
  const [isWaitingToLoop, setIsWaitingToLoop] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prevDirectionRef = useRef(direction)

  const totalItems = children.length

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    if (prevDirectionRef.current !== direction) {
      if (direction === "left") {
        scrollElement.scrollTo({
          left: scrollElement.scrollWidth - scrollElement.clientWidth,
          behavior: "auto",
        })
      } else {
        scrollElement.scrollTo({
          left: 0,
          behavior: "auto",
        })
      }
      prevDirectionRef.current = direction
    }
  }, [direction])

  const scrollByOneItem = (scrollDirection: "left" | "right") => {
    if (!scrollRef.current) return

    const container = scrollRef.current
    const containerWidth = container.offsetWidth
    const scrollAmount = containerWidth / itemsPerView
    const scrollDistance = scrollDirection === "right" ? scrollAmount : -scrollAmount

    container.scrollBy({
      left: scrollDistance,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollElement

      if (direction === "right" && scrollLeft + clientWidth >= scrollWidth - 5 && !isWaitingToLoop) {
        setIsWaitingToLoop(true)

        if (loopTimeoutRef.current) {
          clearTimeout(loopTimeoutRef.current)
        }

        loopTimeoutRef.current = setTimeout(() => {
          scrollElement.scrollTo({
            left: 0,
            behavior: "auto",
          })
          setIsWaitingToLoop(false)
        }, scrollDuration * 1000)
      }

      if (direction === "left" && scrollLeft <= 5 && !isWaitingToLoop) {
        setIsWaitingToLoop(true)

        if (loopTimeoutRef.current) {
          clearTimeout(loopTimeoutRef.current)
        }

        loopTimeoutRef.current = setTimeout(() => {
          scrollElement.scrollTo({
            left: scrollWidth - clientWidth,
            behavior: "auto",
          })
          setIsWaitingToLoop(false)
        }, scrollDuration * 1000)
      }
    }

    scrollElement.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll)
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current)
      }
    }
  }, [direction, scrollDuration, isWaitingToLoop])

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    const handleManualScroll = () => {
      setIsManualScrolling(true)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsManualScrolling(false)
      }, 3000)
    }

    scrollElement.addEventListener("scroll", handleManualScroll, { passive: true })

    return () => {
      scrollElement.removeEventListener("scroll", handleManualScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!autoScroll || isPaused || isManualScrolling || isWaitingToLoop || totalItems <= itemsPerView) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
        autoScrollIntervalRef.current = null
      }
      return
    }

    autoScrollIntervalRef.current = setInterval(() => {
      scrollByOneItem(direction)
    }, scrollDuration * 1000)

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
        autoScrollIntervalRef.current = null
      }
    }
  }, [autoScroll, isPaused, isManualScrolling, isWaitingToLoop, scrollDuration, direction, totalItems, itemsPerView])

  const handlePrevious = () => {
    scrollByOneItem("left")
    setIsManualScrolling(true)
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScrolling(false)
    }, 3000)
  }

  const handleNext = () => {
    scrollByOneItem("right")
    setIsManualScrolling(true)
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScrolling(false)
    }, 3000)
  }

  if (totalItems === 0) return null

  return (
    <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {totalItems > itemsPerView && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-50 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-xl transition-all hover:scale-110 active:scale-95"
            aria-label="السابق"
            type="button"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-50 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-xl transition-all hover:scale-110 active:scale-95"
            aria-label="التالي"
            type="button"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth"
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
    </div>
  )
}
