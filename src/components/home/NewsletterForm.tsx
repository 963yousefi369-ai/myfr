'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Send, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      toast.error('لطفاً یک ایمیل معتبر وارد کنید')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    toast.success('عضویت شما با موفقیت ثبت شد!')
    setSubmitted(true)
    setEmail('')
    setLoading(false)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section
      className="py-16 md:py-20"
      style={{
        background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(16,185,129,0.12) 0%, transparent 65%), #1e3a5f',
      }}
    >
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-white font-bold text-2xl md:text-3xl">
          عضویت در خبرنامه
        </h2>
        <p className="text-white/60 text-base mt-2 mb-8">
          آخرین اخبار محصولات و تخفیف‌های ویژه GPS را دریافت کنید
        </p>

        <div className="flex gap-2.5 flex-col sm:flex-row max-w-md mx-auto">
          <div className="relative flex-1">
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              dir="ltr"
              className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/35 focus:border-teal-400/60 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
            />
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-teal hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60 w-full sm:w-auto"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    در حال ثبت...
                  </motion.span>
                ) : submitted ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    ثبت شد!
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    عضویت
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
