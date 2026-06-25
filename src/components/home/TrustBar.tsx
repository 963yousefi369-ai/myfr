'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Truck, Shield, Headphones, CreditCard } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: Truck, label: 'ارسال سریع', sublabel: 'به سراسر کشور', color: 'text-navy', bg: 'bg-teal-50' },
  { icon: Shield, label: 'ضمانت اصالت', sublabel: 'تضمین کیفیت', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Headphones, label: 'پشتیبانی ۲۴/۷', sublabel: 'همیشه در کنار شما', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: CreditCard, label: 'پرداخت امن', sublabel: 'درگاه معتبر', color: 'text-purple-600', bg: 'bg-purple-50' },
]

export default function TrustBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="relative -mt-16 z-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="flex items-center gap-4 group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110`}>
                  <item.icon className={`w-5.5 h-5.5 ${item.color}`} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.sublabel}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
