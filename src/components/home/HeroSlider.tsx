'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ChevronRight, ChevronLeft, ArrowLeft, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Banner {
  id: string
  title: string
  subtitle?: string
  cta_text?: string
  cta_link?: string
  cta2_text?: string
  cta2_link?: string
  image?: string
  imageUrl?: string
}

const FALLBACK_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'ردیاب‌های GPS پیشرفته',
    subtitle: 'راهکارهای حرفه‌ای مدیریت ناوگان با دقت بالا و پوشش سراسری ایران',
    cta_text: 'مشاهده محصولات',
    cta_link: '/products',
    cta2_text: 'مشاوره رایگان',
    cta2_link: '/contact',
  },
  {
    id: '2',
    title: 'نرم‌افزار ردیابی آنلاین',
    subtitle: 'پنل مدیریتی قدرتمند با گزارش‌دهی لحظه‌ای و هشدارهای هوشمند',
    cta_text: 'درباره نرم‌افزار',
    cta_link: '/software',
    cta2_text: 'درخواست دمو',
    cta2_link: '/contact',
  },
  {
    id: '3',
    title: 'امنیت خودرو، آرامش خاطر',
    subtitle: 'با سیستم ردیابی هوشمند، همیشه و همه‌جا خودروی خود را تحت کنترل داشته باشید',
    cta_text: 'شروع کنید',
    cta_link: '/products',
    cta2_text: 'تماس با ما',
    cta2_link: '/contact',
  },
]

interface HeroSliderProps {
  banners?: Banner[]
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          setDone(true)
          clearInterval(interval)
        }
      }, 45)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-[1em] bg-navy/60 mr-1 animate-pulse align-middle" />}
    </span>
  )
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  const slides = banners && banners.length > 0 ? banners : FALLBACK_BANNERS
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 7000)
    return () => clearInterval(id)
  }, [paused, next])

  const slide = slides[current]
  const hasImage = !!slide.imageUrl && !imgErrors[slide.id]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen flex items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient-1" />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(226,232,240,0.5) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-20 right-1/4 w-96 h-96 bg-teal-500/[0.04] rounded-full blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-80 h-80 bg-navy/[0.04] rounded-full blur-[80px]"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Navigation arrows */}
      <motion.button
        onClick={prev}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-navy hover:border-navy/30 transition-all duration-300 z-20 shadow-sm hover:shadow-md"
        aria-label="قبلی"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>
      <motion.button
        onClick={next}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-navy hover:border-navy/30 transition-all duration-300 z-20 shadow-sm hover:shadow-md"
        aria-label="بعدی"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>

      <motion.div
        className="relative container mx-auto px-6 md:px-14 z-10"
        style={{ opacity: opacityFade }}
      >
        <div className="min-h-screen flex items-center py-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full"
            >
              {/* Text content */}
              <div className="order-2 lg:order-1">
                {/* Live signal badge */}
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium mb-5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  سیگنال فعال — پوشش سراسری ایران
                </motion.div>

                {/* Title with typewriter */}
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-5xl font-extrabold text-navy leading-snug mb-6"
                >
                  <TypewriterText text={slide.title} delay={300} />
                </motion.h1>

                {slide.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-slate-500 text-lg leading-relaxed mb-10 max-w-lg"
                  >
                    {slide.subtitle}
                  </motion.p>
                )}

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex gap-4 flex-wrap"
                >
                  {slide.cta_link && (
                    <Link href={slide.cta_link}>
                      <Button
                        size="lg"
                        className="group/btn bg-navy hover:bg-navy-dark text-white font-semibold px-7 py-3 rounded-xl shadow-navy hover:shadow-lg transition-all duration-200"
                      >
                        <span className="flex items-center gap-2">
                          {slide.cta_text ?? 'مشاهده'}
                          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-1" />
                        </span>
                      </Button>
                    </Link>
                  )}
                  {slide.cta2_link && (
                    <Link href={slide.cta2_link}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-white border border-slate-200 text-navy font-medium px-7 py-3 rounded-xl hover:border-navy/30 hover:bg-slate-50 transition-all duration-200"
                      >
                        {slide.cta2_text ?? 'بیشتر بدانید'}
                      </Button>
                    </Link>
                  )}
                </motion.div>
              </div>

              {/* Image / decorative side */}
              <motion.div
                className="order-1 lg:order-2 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {hasImage ? (
                  <motion.div
                    className="relative w-full h-72 md:h-96 lg:h-[450px]"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Image
                      src={slide.imageUrl!}
                      alt={slide.title}
                      fill
                      className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                      priority
                      unoptimized
                      onError={() => setImgErrors((prev) => ({ ...prev, [slide.id]: true }))}
                    />
                    <div className="absolute inset-0 -z-10 bg-teal-500/5 rounded-full blur-[60px] scale-75" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative w-64 h-64 md:w-80 md:h-80"
                  >
                    <div className="absolute inset-0 rounded-3xl bg-white border border-slate-200 shadow-card flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="mb-4"
                        >
                          <Radio className="w-16 h-16 text-slate-300" />
                        </motion.div>
                        <p className="text-lg font-medium text-slate-500">ردیاب GPS</p>
                      </div>
                    </div>
                    {/* Floating mini cards */}
                    <motion.div
                      className="absolute -top-4 -left-4 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    >
                      <p className="text-xs text-slate-400">موقعیت زنده</p>
                      <p className="text-sm font-bold text-navy">تهران، ولیعصر</p>
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-4 -right-4 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    >
                      <p className="text-xs text-slate-400">سرعت</p>
                      <p className="text-sm font-bold text-teal-600">۶۵ km/h</p>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Slide indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative"
            aria-label={`اسلاید ${i + 1}`}
          >
            <div className={`rounded-full transition-all duration-500 ${
              i === current
                ? 'w-6 h-1.5 bg-navy'
                : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
            }`} />
          </button>
        ))}
      </div>

    </section>
  )
}
