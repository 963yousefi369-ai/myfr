'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'
import SatelliteOrbit from '@/components/tracking/SatelliteOrbit'
import TrailDot from '@/components/trail/TrailDot'
import MagneticButton from '@/components/shared/MagneticButton'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/5 right-1/4 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(30,58,95,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/5 left-1/4 w-64 h-64 rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, delay: 3 }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 w-48 h-48 rounded-full blur-[70px]"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1.5 }}
        />
      </div>

      <div className="text-center max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center mb-6"
        >
          <SatelliteOrbit size={56} duration={10} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-8xl md:text-9xl font-black mb-2 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #10b981 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ۴۰۴
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <TrailDot showLabel={false} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-xl md:text-2xl font-bold text-[#1e3a5f] mb-3"
        >
          ماهواره ارتباط برقرار نمی‌کند
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-gray-400 text-sm leading-relaxed mb-10"
        >
          سیگنال این مسیر قطع شده است. مقصد مورد نظر شما در مدار ما ثبت نشده یا مسیر آن تغییر کرده است.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
          <MagneticButton
            as="a"
            href="/"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-200/50"
            style={{
              background: 'linear-gradient(135deg, #1e3a5f 0%, #10b981 100%)',
            }}
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت به خانه
          </MagneticButton>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium text-[#1e3a5f]/60 hover:text-[#1e3a5f] border border-gray-200 hover:border-[#1e3a5f]/20 transition-all duration-200"
          >
            <Search className="w-4 h-4" />
            جستجوی محصولات
          </Link>
        </motion.div>
      </div>

      {[
        { size: 6, top: '12%', left: '8%', color: '#1e3a5f', dur: 4 },
        { size: 10, top: '22%', left: '85%', color: '#10b981', dur: 5 },
        { size: 8, top: '70%', left: '12%', color: '#f59e0b', dur: 6 },
        { size: 5, top: '80%', left: '78%', color: '#1e3a5f', dur: 3.5 },
        { size: 12, top: '45%', left: '5%', color: '#10b981', dur: 7 },
        { size: 7, top: '55%', left: '92%', color: '#f59e0b', dur: 4.5 },
        { size: 4, top: '35%', left: '70%', color: '#1e3a5f', dur: 5.5 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            top: dot.top,
            left: dot.left,
            background: dot.color,
            opacity: 0.12,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: dot.dur, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span>در حال جستجوی سیگنال...</span>
        </div>
      </motion.div>
    </div>
  )
}
