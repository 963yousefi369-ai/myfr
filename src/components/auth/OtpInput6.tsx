'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OtpInput6Props {
  value: string
  onChange: (val: string) => void
  disabled?: boolean
}

export function OtpInput6({ value, onChange, disabled }: OtpInput6Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const [focused, setFocused] = useState<number | null>(0)

  const digits = value.split('').concat(Array(6 - value.length).fill(''))

  const handleChange = useCallback((index: number, val: string) => {
    if (disabled) return
    const d = val.replace(/[^0-9]/g, '')
    if (!d) return
    const next = (value.slice(0, index) + d[0]).slice(0, 6)
    onChange(next)
    if (index < 5 && d[0]) {
      refs.current[index + 1]?.focus()
    }
  }, [value, onChange, disabled])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1))
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
        onChange(value.slice(0, index - 1) + value.slice(index))
      }
    }
    if (e.key === 'ArrowLeft' && index < 5) {
      refs.current[index + 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }, [value, onChange])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6)
    if (pasted) onChange(pasted)
    if (pasted.length >= 6) {
      refs.current[5]?.focus()
    } else if (pasted.length > 0) {
      refs.current[Math.min(pasted.length, 5)]?.focus()
    }
  }, [onChange])

  useEffect(() => {
    if (!disabled) refs.current[0]?.focus()
  }, [disabled])

  return (
    <div dir="ltr" className="flex justify-center gap-2.5" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="relative">
          <input
            ref={(el) => { refs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i] || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(null)}
            disabled={disabled}
            className={cn(
              'w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none',
              'bg-bg-secondary/50 text-text-primary',
              focused === i
                ? 'border-navy ring-2 ring-navy/20 scale-105 bg-white'
                : digits[i]
                  ? 'border-navy/40 bg-white'
                  : 'border-border-default/50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            autoComplete="one-time-code"
          />
          {i === 2 && (
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-border-default/50 rounded-full" />
          )}
        </div>
      ))}
    </div>
  )
}
