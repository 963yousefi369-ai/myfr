'use client'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { toFa, cn } from '@/lib/utils'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-0 border border-border-default/60 rounded-xl overflow-hidden bg-white w-fit shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-none hover:bg-navy/8 text-text-secondary hover:text-navy disabled:opacity-30 transition-all duration-200 active:scale-90"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className="w-3.5 h-3.5" />
      </Button>
      <span className="w-10 text-center font-bold text-text-primary text-sm tabular-nums select-none">
        {toFa(value)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-none hover:bg-navy/8 text-text-secondary hover:text-navy disabled:opacity-30 transition-all duration-200 active:scale-90"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus className="w-3.5 h-3.5" />
      </Button>
    </div>
  )
}
