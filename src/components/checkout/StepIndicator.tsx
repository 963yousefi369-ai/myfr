'use client'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const STEPS = [
  { id: 1, label: 'آدرس تحویل' },
  { id: 2, label: 'روش ارسال' },
  { id: 3, label: 'تأیید و پرداخت' },
]

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-10" dir="rtl">
      {STEPS.map((step, idx) => {
        const isCompleted = step.id < currentStep
        const isActive = step.id === currentStep

        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center gap-2.5"
            >
              <motion.div
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={isActive ? { duration: 2, repeat: Infinity } : {}}
                className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all duration-200 shadow-sm',
                  isCompleted && 'bg-green-500 border-green-500 text-white shadow-green-200',
                  isActive && 'bg-navy border-navy text-white shadow-navy/20',
                  !isCompleted && !isActive && 'bg-white border-gray-200 text-gray-400'
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  step.id
                )}
              </motion.div>
              <span
                className={cn(
                  'text-xs font-semibold whitespace-nowrap transition-colors duration-200',
                  isActive ? 'text-navy' : isCompleted ? 'text-green-600' : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </motion.div>
            {idx < STEPS.length - 1 && (
              <div className="relative mx-3 mb-6 w-16 sm:w-28">
                <div className="h-0.5 w-full rounded-full bg-gray-200" />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 h-0.5 rounded-full bg-green-400 origin-right"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
