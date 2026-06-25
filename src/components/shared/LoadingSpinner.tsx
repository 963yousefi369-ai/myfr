import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-navy/20 border-t-navy',
          sizes[size]
        )}
        role="status"
        aria-label="در حال بارگذاری"
      />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-3 border-navy/10 border-t-navy animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-navy/10 animate-pulse" />
        </div>
      </div>
      <p className="text-text-tertiary text-sm font-medium">در حال بارگذاری...</p>
    </div>
  )
}
