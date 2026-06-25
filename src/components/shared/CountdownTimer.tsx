'use client'
import { useState, useEffect } from 'react'
import { cn, toFa } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface CountdownTimerProps {
  targetDate: string | Date
  className?: string
  compact?: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownTimer({ targetDate, className, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const target = new Date(targetDate)
    setTimeLeft(calcTimeLeft(target))

    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft(target))
    }, 1000)

    return () => clearInterval(id)
  }, [targetDate])

  if (!mounted) return null

  const units = [
    { value: timeLeft.days, label: 'روز' },
    { value: timeLeft.hours, label: 'ساعت' },
    { value: timeLeft.minutes, label: 'دقیقه' },
    { value: timeLeft.seconds, label: 'ثانیه' },
  ]

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-1.5">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5 min-w-[36px] text-center">
              <motion.span
                key={unit.value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-white font-bold text-sm tabular-nums inline-block"
              >
                {toFa(unit.value).padStart(2, '۰')}
              </motion.span>
            </div>
            {i < units.length - 1 && (
              <span className="text-white/60 text-xs font-medium">:</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[56px] text-center border border-white/10">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: -15, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 15, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="text-white font-black text-2xl tabular-nums inline-block"
                >
                  {toFa(unit.value).padStart(2, '۰')}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-white/70 text-[11px] font-medium mt-1.5">{unit.label}</span>
          </div>
          {i < units.length - 1 && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-white/40 text-2xl font-bold -mt-5"
            >
              :
            </motion.span>
          )}
        </div>
      ))}
    </div>
  )
}
