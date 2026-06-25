'use client'
import { Check } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { motion } from 'framer-motion'

type StepStatus = 'completed' | 'current' | 'pending'

interface TimelineStep {
  status: string
  label: string
  date?: string
  stepStatus: StepStatus
}

const ALL_STEPS = [
  { status: 'pending',    label: 'ثبت سفارش'         },
  { status: 'paid',       label: 'تأیید پرداخت'       },
  { status: 'processing', label: 'آماده‌سازی'          },
  { status: 'shipped',    label: 'تحویل به پست'       },
  { status: 'delivered',  label: 'تحویل به مشتری'     },
]

const STATUS_ORDER = ['pending', 'paid', 'processing', 'shipped', 'delivered']

interface OrderTimelineProps {
  currentStatus: string
  history?: Array<{ status: string; created_at: string }>
}

export default function OrderTimeline({ currentStatus, history = [] }: OrderTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus)
  const isCancelled = currentStatus === 'cancelled'

  const historyMap = history.reduce<Record<string, string>>((acc, h) => {
    acc[h.status] = h.created_at
    return acc
  }, {})

  const steps: TimelineStep[] = ALL_STEPS.map((s, idx) => {
    let stepStatus: StepStatus = 'pending'
    if (!isCancelled) {
      if (idx < currentIndex) stepStatus = 'completed'
      else if (idx === currentIndex) stepStatus = 'current'
    }
    return { ...s, date: historyMap[s.status], stepStatus }
  })

  return (
    <div className="relative">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1
        return (
          <motion.div
            key={step.status}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={step.stepStatus === 'current' ? { scale: [1, 1.1, 1] } : {}}
                transition={step.stepStatus === 'current' ? { duration: 2, repeat: Infinity } : {}}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center z-10 shrink-0 border-2 transition-all duration-200 shadow-sm',
                  step.stepStatus === 'completed' && 'bg-green-500 border-green-500 shadow-green-200',
                  step.stepStatus === 'current'   && 'bg-navy border-navy shadow-navy/20',
                  step.stepStatus === 'pending'   && 'bg-white border-gray-200',
                )}
              >
                {step.stepStatus === 'completed' && (
                  <Check className="w-4 h-4 text-white" />
                )}
                {step.stepStatus === 'current'   && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                {step.stepStatus === 'pending'   && <div className="w-2 h-2 rounded-full bg-gray-300" />}
              </motion.div>
              {!isLast && (
                <div className="relative w-0.5 flex-1 min-h-[2.5rem]">
                  <div className="absolute inset-0 bg-gray-200" />
                  {step.stepStatus === 'completed' && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.08 }}
                      className="absolute inset-0 bg-green-300 origin-top"
                    />
                  )}
                </div>
              )}
            </div>

            <div className={cn('pb-7 flex-1', isLast && 'pb-0')}>
              <p
                className={cn(
                  'font-semibold text-sm mt-1.5 transition-colors duration-200',
                  step.stepStatus === 'completed' && 'text-green-600',
                  step.stepStatus === 'current'   && 'text-navy',
                  step.stepStatus === 'pending'   && 'text-gray-400',
                )}
              >
                {step.label}
              </p>
              {step.date && (
                <p className="text-xs text-gray-400 mt-1">{formatDate(step.date)}</p>
              )}
            </div>
          </motion.div>
        )
      })}

      {isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200"
        >
          <p className="text-sm font-medium text-center text-red-600">سفارش لغو شده است</p>
        </motion.div>
      )}
    </div>
  )
}
