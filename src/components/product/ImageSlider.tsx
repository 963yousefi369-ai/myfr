'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLACEHOLDER = '/placeholder-product.svg'

interface ImageSliderProps {
  images: string[]
  productName: string
}

function isValidSrc(src: string | undefined | null): boolean {
  return typeof src === 'string' && src.trim().length > 0
}

export default function ImageSlider({ images, productName }: ImageSliderProps) {
  const validImages = images.filter(isValidSrc)
  const safeImages = validImages.length > 0 ? validImages : [PLACEHOLDER]
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const goNext = () => setActiveIndex((prev) => (prev + 1) % safeImages.length)
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Main image */}
      <div
        className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-white"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={safeImages[activeIndex]}
          alt={`${productName} — تصویر ${activeIndex + 1}`}
          fill
          className="object-contain p-8"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={activeIndex === 0}
          unoptimized={safeImages[activeIndex] === PLACEHOLDER}
        />

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-md flex items-center justify-center text-navy hover:bg-gray-50 transition-colors"
              aria-label="تصویر قبلی"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-md flex items-center justify-center text-navy hover:bg-gray-50 transition-colors"
              aria-label="تصویر بعدی"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto" dir="rtl">
          {safeImages.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative w-20 h-20 shrink-0 rounded-xl border-2 overflow-hidden bg-white transition-all duration-200',
                activeIndex === idx
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-100 hover:border-blue-300'
              )}
            >
              <Image
                src={src}
                alt={`thumbnail ${idx + 1}`}
                fill
                className="object-contain p-2"
                sizes="80px"
                unoptimized={src === PLACEHOLDER}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}