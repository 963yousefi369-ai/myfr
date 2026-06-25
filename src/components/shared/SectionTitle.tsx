'use client'
import { cn } from '@/lib/utils'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'right' | 'left'
  centered?: boolean
  dark?: boolean
  className?: string
  action?: React.ReactNode
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align,
  centered,
  dark = false,
  className,
  action,
}: SectionTitleProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const isCentered = centered ?? align === 'center'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn('mb-10', isCentered && 'text-center', className)}
    >
      <div className={cn('flex items-end justify-between gap-4', isCentered && 'flex-col items-center')}>
        <div>
          {eyebrow && (
            <div className={cn(
              'inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest mb-3',
              dark ? 'text-teal-400' : 'text-teal-600'
            )}>
              <span className="w-1 h-1 rounded-full bg-teal-500" />
              {eyebrow}
            </div>
          )}
          <h2 className={cn(
            'text-2xl md:text-3xl font-bold',
            dark ? 'text-white' : 'text-slate-900'
          )}>
            {title}
          </h2>
          {subtitle && (
            <p className={cn(
              'text-base mt-2 leading-relaxed max-w-2xl',
              dark ? 'text-white/70' : 'text-slate-500'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </motion.div>
  )
}
