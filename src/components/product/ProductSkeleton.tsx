import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

export default function ProductSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-border-default/40 overflow-hidden bg-white"
    >
      <Skeleton className="h-52 w-full rounded-none animate-premium-shimmer" />
      <div className="p-4 space-y-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-3.5 w-3.5 rounded-sm" />
          ))}
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    </motion.div>
  )
}

export function ProductSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <ProductSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="min-h-[520px] bg-gradient-to-br from-navy-deeper to-navy flex items-center">
      <div className="container mx-auto px-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <Skeleton className="h-12 w-3/4 bg-white/10" />
          <Skeleton className="h-6 w-full bg-white/10" />
          <Skeleton className="h-6 w-2/3 bg-white/10" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 w-36 bg-white/10 rounded-xl" />
            <Skeleton className="h-12 w-36 bg-white/10 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-72 w-full bg-white/10 rounded-3xl" />
      </div>
    </div>
  )
}

export function BlogSkeleton() {
  return (
    <div className="rounded-2xl border border-border-default/40 overflow-hidden bg-white">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  )
}
