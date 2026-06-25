import { cn } from '@/lib/utils'

type StatusKey = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

const STATUS_MAP: Record<StatusKey, { label: string; className: string }> = {
  pending:    { label: 'در انتظار تأیید',   className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  paid:       { label: 'تأیید شده',         className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  processing: { label: 'در حال آماده‌سازی', className: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
  shipped:    { label: 'تحویل به پست',      className: 'bg-purple-50 text-purple-700 border border-purple-200' },
  delivered:  { label: 'تحویل شده',         className: 'bg-green-50 text-green-700 border border-green-200' },
  cancelled:  { label: 'لغو شده',           className: 'bg-red-50 text-red-700 border border-red-200' },
}

interface OrderStatusBadgeProps {
  status: string
  className?: string
}

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const cfg = STATUS_MAP[status as StatusKey] ?? {
    label: status,
    className: 'bg-gray-50 text-gray-600 border border-gray-200',
  }
  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all duration-200', cfg.className, className)}>
      {status === 'delivered' && '✓ '}{cfg.label}
    </span>
  )
}
