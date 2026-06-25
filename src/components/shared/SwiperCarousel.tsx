'use client'
import { ReactNode } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, FreeMode } from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'

interface SwiperCarouselProps {
  children: ReactNode[]
  className?: string
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  autoplay?: boolean | { delay: number }
  pagination?: boolean
  navigation?: boolean
  freeMode?: boolean
  loop?: boolean
  breakpoints?: SwiperOptions['breakpoints']
  centeredSlides?: boolean
}

export default function SwiperCarousel({
  children,
  className,
  slidesPerView = 1,
  spaceBetween = 24,
  autoplay = false,
  pagination = false,
  navigation = false,
  freeMode = false,
  loop = false,
  breakpoints,
  centeredSlides = false,
}: SwiperCarouselProps) {
  const modules = [Autoplay, Pagination, Navigation, FreeMode].filter(Boolean)

  return (
    <Swiper
      modules={modules}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      autoplay={autoplay === true ? { delay: 5000, disableOnInteraction: false } : autoplay || false}
      pagination={pagination ? { clickable: true } : false}
      navigation={navigation}
      freeMode={freeMode}
      loop={loop}
      breakpoints={breakpoints}
      centeredSlides={centeredSlides}
      className={className}
      dir="rtl"
    >
      {children.map((child, i) => (
        <SwiperSlide key={i}>{child}</SwiperSlide>
      ))}
    </Swiper>
  )
}
