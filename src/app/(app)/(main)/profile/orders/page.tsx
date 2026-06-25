'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ChevronLeft, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import OrderStatusBadge from '@/components/profile/OrderStatusBadge'
import MapPreview from '@/components/tracking/MapPreview'
import SignalStrength from '@/components/tracking/SignalStrength'
import { useAuthStore } from '@/lib/store/auth'
import { getOrders } from '@/lib/api/django'
import { formatPrice, formatDate } from '@/lib/utils'
import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'

export default function OrdersPage() {
  const { token } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    getOrders(token)
      .then(setOrders)
      .catch(() => setError('خطا در بارگذاری سفارشات'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Card className="rounded-2xl shadow-md">
          <CardHeader><CardTitle>سفارش‌های من</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="rounded-2xl shadow-md">
        <CardContent className="py-16 text-center">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="rounded-2xl shadow-md">
        <CardContent className="py-20 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-[#1e3a5f]/40" />
          </div>
          <p className="text-gray-600 font-medium">هنوز سفارشی ندارید</p>
          <p className="text-gray-400 text-sm">محصولات GPS ما را کشف کنید</p>
          <Button asChild className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white mt-2 rounded-xl">
            <Link href="/products">مشاهده محصولات</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <BreadcrumbTrail dark={false} />

      <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#1e3a5f]" />
            </div>
            <CardTitle className="text-[#1e3a5f]">سفارش‌های من</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
            >
              <Link
                href={`/profile/orders/${order.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1e3a5f]/20 hover:bg-[#f1f5f9]/50 transition-all duration-200 group"
              >
                <div className="shrink-0 hidden sm:block">
                  <MapPreview width={80} height={60} className="rounded-lg" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-semibold text-[#1e3a5f]">#{order.id}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                  <p className="text-sm font-bold text-[#1e3a5f]">
                    {formatPrice(order.total_price ?? order.total ?? 0)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <SignalStrength
                    bars={
                      order.status === 'delivered' ? 4 :
                      order.status === 'shipped' ? 3 :
                      order.status === 'processing' ? 2 :
                      order.status === 'paid' ? 1 : 1
                    }
                    activeColor={
                      order.status === 'delivered' ? '#10b981' :
                      order.status === 'cancelled' ? '#ef4444' : '#1e3a5f'
                    }
                  />
                  <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-[#1e3a5f] transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
