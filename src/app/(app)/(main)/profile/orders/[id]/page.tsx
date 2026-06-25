'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ExternalLink, Loader2, Package, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import OrderStatusBadge from '@/components/profile/OrderStatusBadge'
import OrderTimeline from '@/components/profile/OrderTimeline'
import MapPreview from '@/components/tracking/MapPreview'
import AnimatedRoute from '@/components/tracking/AnimatedRoute'
import PulsingDot from '@/components/tracking/PulsingDot'
import SignalStrength from '@/components/tracking/SignalStrength'
import { useAuthStore } from '@/lib/store/auth'
import { getOrder, cancelOrder } from '@/lib/api/django'
import { formatPrice, formatDate } from '@/lib/utils'
import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuthStore()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    getOrder(token, id)
      .then(setOrder)
      .catch(() => setError('خطا در بارگذاری سفارش'))
      .finally(() => setLoading(false))
  }, [token, id])

  const handleCancel = async () => {
    if (!token) return
    setCancelling(true)
    try {
      await cancelOrder(token, id)
      setOrder((o: any) => ({ ...o, status: 'cancelled' }))
      toast.success('سفارش با موفقیت لغو شد')
    } catch {
      toast.error('خطا در لغو سفارش')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <Card className="rounded-2xl shadow-md">
        <CardContent className="py-16 text-center space-y-4">
          <p className="text-red-500">{error || 'سفارش یافت نشد'}</p>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/profile/orders">بازگشت به سفارش‌ها</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const provinceName = typeof order.address?.province === 'object'
    ? order.address?.province?.name
    : order.address?.province ?? ''
  const cityName = typeof order.address?.city === 'object'
    ? order.address?.city?.name
    : order.address?.city ?? ''

  const signalBars = (
    order.status === 'delivered' ? 4 :
    order.status === 'shipped' ? 3 :
    order.status === 'processing' ? 2 :
    order.status === 'paid' ? 1 : 1
  ) as 1 | 2 | 3 | 4

  return (
    <div className="space-y-5">
      <BreadcrumbTrail dark={false} />

      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-[#1e3a5f] rounded-xl">
          <Link href="/profile/orders">
            <ArrowLeft className="w-4 h-4" />
            بازگشت
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-[#1e3a5f]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
              سفارش #{order.id}
              <PulsingDot
                color={order.status === 'delivered' ? 'green' : order.status === 'cancelled' ? 'red' : 'blue'}
                size={5}
              />
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SignalStrength bars={signalBars} activeColor={order.status === 'cancelled' ? '#ef4444' : '#10b981'} />
          <OrderStatusBadge status={order.status} />
          {order.status === 'pending' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl">
                  لغو سفارش
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl" className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>لغو سفارش #{order.id}</AlertDialogTitle>
                  <AlertDialogDescription>
                    آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row-reverse gap-2">
                  <AlertDialogAction
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="bg-red-500 hover:bg-red-600 text-white gap-2 rounded-xl"
                  >
                    {cancelling && <Loader2 className="w-3 h-3 animate-spin" />}
                    بله، لغو کن
                  </AlertDialogAction>
                  <AlertDialogCancel className="rounded-xl">انصراف</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader><CardTitle className="text-base text-[#1e3a5f]">اقلام سفارش</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">محصول</TableHead>
                    <TableHead className="text-right">تعداد</TableHead>
                    <TableHead className="text-right">قیمت واحد</TableHead>
                    <TableHead className="text-right">جمع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(order.items ?? []).map((item: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="text-sm">
                        {item.product_name ?? item.name ?? `محصول ${item.product_id}`}
                      </TableCell>
                      <TableCell className="text-sm">{item.quantity}</TableCell>
                      <TableCell className="text-sm">{formatPrice(item.price ?? item.unit_price ?? 0)}</TableCell>
                      <TableCell className="text-sm font-semibold text-[#1e3a5f]">
                        {formatPrice((item.price ?? item.unit_price ?? 0) * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>جمع محصولات</span>
                  <span>{formatPrice(order.subtotal ?? 0)}</span>
                </div>
                {order.shipping_cost !== undefined && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>هزینه ارسال</span>
                    <span>{formatPrice(order.shipping_cost)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-[#1e3a5f]">
                  <span>جمع کل</span>
                  <span>{formatPrice(order.total_price ?? order.total ?? 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.address && (
            <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader><CardTitle className="text-base text-[#1e3a5f]">آدرس تحویل</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <MapPreview width={120} height={80} className="rounded-lg" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {provinceName}{provinceName && cityName ? ' — ' : ''}{cityName}
                      {order.address.street ? ` — ${order.address.street}` : ''}
                    </p>
                    {order.address.postal_code && (
                      <p className="text-gray-400 text-xs mt-1">
                        کد پستی: {order.address.postal_code}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {order.tracking_code && (
            <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader><CardTitle className="text-base text-[#1e3a5f]">اطلاعات ارسال</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <AnimatedRoute direction="horizontal" color="#1e3a5f" />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-gray-500 text-sm">کد رهگیری پستی</p>
                    <p className="font-mono font-semibold text-[#1e3a5f] mt-1">
                      {order.tracking_code}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="gap-2 text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981]/5 rounded-xl">
                    <a
                      href={`https://tracking.post.ir/?code=${order.tracking_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      رهگیری مرسوله
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 sticky top-24">
            <CardHeader><CardTitle className="text-base text-[#1e3a5f]">مراحل سفارش</CardTitle></CardHeader>
            <CardContent>
              <OrderTimeline
                currentStatus={order.status}
                history={order.history ?? order.status_history ?? []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
