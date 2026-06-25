'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, MessageCircle } from 'lucide-react'

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-6 left-6 z-[200] flex flex-col gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-white shadow-[var(--shadow-lg)] border border-border-default/50 flex items-center justify-center text-text-secondary hover:text-navy hover:border-navy/30 transition-colors duration-300"
            aria-label="بازگشت به بالا"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/989123456789"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.5 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className="hidden sm:flex relative w-12 h-12 rounded-full bg-success text-white items-center justify-center shadow-[var(--shadow-lg)] animate-breathe"
        aria-label="واتساپ"
      >
        <MessageCircle className="w-5 h-5" />
        {/* Unread dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-error rounded-full border-2 border-white animate-pulse" />
      </motion.a>
    </div>
  )
}
