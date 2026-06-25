'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface CountdownTimerProps {
  seconds: number
  onExpire?: () => void
  onResend: () => void
  loading?: boolean
}

function toFaDigits(n: number) {
  return n.toLocaleString('fa-IR').padStart(2, '۰')
}

export default function CountdownTimer({ seconds, onExpire, onResend, loading }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(seconds)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    setRemaining(seconds)
    setExpired(false)
  }, [seconds])

  useEffect(() => {
    if (remaining <= 0) {
      setExpired(true)
      onExpire?.()
      return
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining, onExpire])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  if (expired) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onResend}
        disabled={loading}
        className="text-navy hover:text-navy-dark gap-2 h-9 px-4 rounded-xl hover:bg-navy/5 transition-all duration-200"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        ارسال مجدد کد
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm text-text-tertiary">
      <span>ارسال مجدد کد تا</span>
      <span className="inline-flex items-center gap-1 bg-bg-secondary/70 px-2.5 py-1 rounded-lg border border-border-default/30">
        <span className="font-mono font-bold text-text-primary tabular-nums" dir="ltr">
          {toFaDigits(mins)}:{toFaDigits(secs)}
        </span>
      </span>
    </div>
  )
}
