'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicImageUrl } from '@/lib/api/django'

const ITEMS_PER_PAGE = 5

const FALLBACK_PARTNERS = [
  { id: '1', name: 'تاکسیرانی تهران', logo: null, website: '' },
  { id: '2', name: 'حمل و نقل پارس', logo: null, website: '' },
  { id: '3', name: 'ناوگان آریا', logo: null, website: '' },
  { id: '4', name: 'لجستیک ستاره', logo: null, website: '' },
  { id: '5', name: 'باربری ایران', logo: null, website: '' },
  { id: '6', name: 'خدمات شهری البرز', logo: null, website: '' },
]

interface Partner {
  id: string | number
  name: string
  logo?: string | null
  website?: string
}

export default function PartnersMarquee({ partners }: { partners?: Partner[] }) {
  const items = partners && partners.length > 0 ? partners : FALLBACK_PARTNERS
  const total = items.length
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const canPrev = index > 0
  const canNext = index + ITEMS_PER_PAGE < total
  const visible = items.slice(index, index + ITEMS_PER_PAGE)
  const currentPage = Math.floor(index / ITEMS_PER_PAGE)

  const go = (dir: 1 | -1) => {
    setDirection(dir)
    setIndex((prev) =>
      Math.max(0, Math.min(prev + dir * ITEMS_PER_PAGE, total - ITEMS_PER_PAGE))
    )
  }

  return (
    <section className="bg-slate-50 border-y border-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          مورد اعتماد بیش از ۵۰۰۰ مشتری در سراسر ایران
        </p>

        <div className="flex items-center gap-3">
          {/* دکمه قبلی */}
          <button
            onClick={() => go(-1)}
            disabled={!canPrev}
            aria-label="قبلی"
            className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0 text-slate-400 hover:text-[#1e3a5f] hover:border-[#1e3a5f] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* لیست پارتنرها */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -50 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
              >
                {visible.map((partner) => {
                  const logoUrl = partner.logo ? publicImageUrl(partner.logo) : null
                  const content = (
                    <div className="flex items-center justify-center bg-white rounded-xl border border-slate-100 p-4 h-16 hover:border-slate-300 hover:shadow-sm transition-all grayscale hover:grayscale-0">
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={partner.name}
                          width={100}
                          height={40}
                          className="object-contain max-h-8"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs text-slate-500 font-medium text-center leading-tight">
                          {partner.name}
                        </span>
                      )}
                    </div>
                  )

                  return partner.website ? (
                    <a
                      key={partner.id}
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={partner.id}>{content}</div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* دکمه بعدی */}
          <button
            onClick={() => go(1)}
            disabled={!canNext}
            aria-label="بعدی"
            className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0 text-slate-400 hover:text-[#1e3a5f] hover:border-[#1e3a5f] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* نقطه‌های صفحه */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 mt-5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i * ITEMS_PER_PAGE > index ? 1 : -1)
                  setIndex(i * ITEMS_PER_PAGE)
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentPage === i ? 'w-5 bg-[#1e3a5f]' : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
