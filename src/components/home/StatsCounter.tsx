'use client'
import { motion } from 'framer-motion'
import AnimatedCounter from '@/components/shared/AnimatedCounter'
import { Users, Radio, Trophy, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Stat {
  label: string
  value: number
  suffix?: string
  icon?: LucideIcon
}

const DEFAULT_STATS: Stat[] = [
  { label: 'مشتری فعال', value: 5000, suffix: '+', icon: Users },
  { label: 'دستگاه نصب‌شده', value: 25000, suffix: '+', icon: Radio },
  { label: 'سال تجربه', value: 12, suffix: '', icon: Trophy },
  { label: 'شهر تحت پوشش', value: 31, suffix: '', icon: Globe },
]

interface StatsCounterProps {
  stats?: Stat[]
  darkMode?: boolean
}

export default function StatsCounter({ stats, darkMode = false }: StatsCounterProps) {
  const items = stats && stats.length > 0 ? stats : DEFAULT_STATS

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {items.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="stat-card-beam rounded-2xl"
            >
              <div className={darkMode
                ? "bg-white/8 border border-white/12 rounded-2xl p-6 md:p-8 text-center hover:border-white/25 hover:bg-white/12 transition-all duration-300"
                : "bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300"
              }>
                {stat.icon && (
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-teal-500/15' : 'bg-teal-500/10'}`}>
                    <stat.icon className={`w-5 h-5 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                  </div>
                )}
                <div className={`text-4xl font-black mb-1 ${darkMode ? 'text-white' : 'text-[#0f172a]'}`}>
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix && (
                    <span className={darkMode ? 'text-teal-400' : 'text-teal-600'}>{stat.suffix}</span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-500'}`}>{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
