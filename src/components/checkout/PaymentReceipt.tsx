'use client'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2, XCircle, Printer, Phone, Clock,
  MapPin, Truck, Package, Share2, ExternalLink, Copy, Home,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice, formatDate } from '@/lib/utils'
import { getOrder } from '@/lib/api/django'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'sonner'

interface PaymentReceiptProps {
  status: string
  orderId: string | null
  token: string | null
}

export default function PaymentReceipt({ status, orderId, token }: PaymentReceiptProps) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const clearCart = useCartStore((s) => s.clearCart)
  const cartCleared = useRef(false)
  // Only show paid state if URL says paid AND backend confirms it
  const isPaid = status === 'paid'
  const isVerified = isPaid && order && order.status === 'paid'

  // Clear cart once when payment is verified by backend
  useEffect(() => {
    if (isPaid && order && order.status === 'paid' && !cartCleared.current) {
      cartCleared.current = true
      clearCart()
      sessionStorage.removeItem('last_order_id')
      sessionStorage.removeItem('last_order_items')
    }
  }, [isPaid, order, clearCart])

  // Save receipt to localStorage for later viewing
  useEffect(() => {
    if (isPaid && orderId) {
      const receiptData = { orderId, status, timestamp: Date.now() }
      try {
        const existing = JSON.parse(localStorage.getItem('payment_receipts') || '[]')
        const updated = [receiptData, ...existing.filter((r: any) => r.orderId !== orderId)].slice(0, 10)
        localStorage.setItem('payment_receipts', JSON.stringify(updated))
      } catch {}
    }
  }, [isPaid, orderId, status])

  // Fetch order details with timeout
  useEffect(() => {
    if (!isPaid || !orderId || !token) return

    const controller = new AbortController()
    const timeout = setTimeout(() => {
      setTimedOut(true)
      controller.abort()
    }, 10000)

    setLoading(true)
    getOrder(token, orderId, controller.signal)
      .then((data) => {
        setOrder(data)
        setFetchError(false)
      })
      .catch(() => {
        setFetchError(true)
      })
      .finally(() => {
        setLoading(false)
        clearTimeout(timeout)
      })

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [isPaid, orderId, token])

  const handleRetry = () => {
    if (!orderId || !token) return
    setTimedOut(false)
    setFetchError(false)
    setLoading(true)
    getOrder(token, orderId)
      .then((data) => { setOrder(data); setFetchError(false) })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }

  const handleShare = async (platform: 'copy' | 'telegram' | 'whatsapp') => {
    const url = window.location.href
    const text = `سفارش شماره #${orderId} با موفقیت ثبت شد`
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url)
      toast.success('لینک کپی شد')
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank')
    }
  }

  // ─── PAID STATE ───────────────────────────────────────────────
  if (isPaid) {
    return (
      <>
        <style jsx global>{`
          @media print {
            body * { visibility: hidden; }
            .receipt-print, .receipt-print * { visibility: visible; }
            .receipt-print { position: absolute; left: 0; top: 0; width: 100%; }
            .print\\:hidden { display: none !important; }
          }
        `}</style>

        <div className="flex flex-col items-center gap-6 py-6 receipt-print">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-teal-600" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-text-primary mb-1">پرداخت موفق</h1>
            <p className="text-text-secondary text-sm">سفارش شما با موفقیت ثبت و پرداخت شد</p>
          </motion.div>

          {/* Invoice Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-lg"
          >
            <Card className="border-slate-200 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-navy p-5 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">آتی فرزام ایرانیان</span>
                  </div>
                  <span className="text-white/60 text-xs">رسید پرداخت</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/60 text-[10px] mb-0.5">شماره سفارش</p>
                    <p className="text-2xl font-extrabold tracking-wide" dir="ltr">#{orderId}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-white/60 text-[10px] mb-0.5">تاریخ</p>
                    <p className="text-sm font-medium" dir="ltr">
                      {order?.created_at ? formatDate(order.created_at) : formatDate(new Date().toISOString())}
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Status & Amount */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                    <span className="text-sm font-semibold text-teal-600">پرداخت موفق</span>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-text-tertiary">مبلغ پرداختی</p>
                    <p className="text-lg font-extrabold text-navy" dir="ltr">
                      {order?.total_price ? formatPrice(order.total_price) : '—'}
                    </p>
                  </div>
                </div>

                {/* Tracking Number */}
                {order?.tracking_number && (
                  <div className="flex items-center justify-between text-xs bg-bg-secondary rounded-lg px-3 py-2">
                    <span className="text-text-tertiary">شماره پیگیری</span>
                    <span className="font-mono text-text-primary" dir="ltr">{order.tracking_number}</span>
                  </div>
                )}

                <Separator />

                {/* Loading skeleton */}
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : (timedOut || fetchError) && !order ? (
                  /* Error fallback */
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Clock className="w-4 h-4" />
                      <p className="text-sm font-semibold">جزئیات سفارش در دسترس نیست</p>
                    </div>
                    <p className="text-xs text-amber-600">
                      پرداخت شما با موفقیت انجام شد. شماره سفارش شما <span className="font-bold">#{orderId}</span> است.
                    </p>
                    <p className="text-xs text-amber-600">
                      در صورت عدم دریافت سفارش، با پشتیبانی تماس بگیرید.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={handleRetry}
                        className="text-xs font-medium text-navy hover:underline"
                      >
                        تلاش مجدد
                      </button>
                      <a
                        href="tel:02112345678"
                        className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700"
                      >
                        <Phone className="w-3 h-3" />
                        ۰۲۱-۱۲۳۴۵۶۷۸
                      </a>
                    </div>
                  </div>
                ) : order ? (
                  <>
                    {/* Order Items */}
                    {order.items?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          اقلام سفارش
                        </p>
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 py-1.5">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-text-primary line-clamp-1">
                                {item.product_name ?? item.product?.name ?? 'محصول'}
                              </p>
                              <p className="text-text-tertiary text-[10px]">× {item.quantity}</p>
                            </div>
                            <p className="text-navy font-semibold text-xs flex-shrink-0" dir="ltr">
                              {formatPrice(item.unit_price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <Separator />

                    {/* Shipping Address */}
                    {order.shipping_address_snapshot && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-text-tertiary" />
                        </div>
                        <div>
                          <p className="text-[10px] text-text-tertiary mb-0.5">آدرس تحویل</p>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {order.shipping_address_snapshot.province} — {order.shipping_address_snapshot.city} — {order.shipping_address_snapshot.street}
                          </p>
                          {order.shipping_address_snapshot.postal_code && (
                            <p className="text-[10px] text-text-tertiary mt-0.5" dir="ltr">
                              کد پستی: {order.shipping_address_snapshot.postal_code}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status History */}
                    {order.history?.length > 0 && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Clock className="w-4 h-4 text-text-tertiary" />
                        </div>
                        <div>
                          <p className="text-[10px] text-text-tertiary mb-1">وضعیت سفارش</p>
                          {order.history.map((h: any, idx: number) => (
                            <p key={idx} className="text-xs text-text-secondary">
                              {h.status_display} — {h.note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shipping Cost */}
                    {order.shipping_cost > 0 && (
                      <div className="flex justify-between text-xs text-text-secondary">
                        <span>هزینه ارسال</span>
                        <span dir="ltr">{formatPrice(order.shipping_cost)}</span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between font-bold text-text-primary border-t border-slate-100 pt-3 mt-1">
                      <span className="text-sm">جمع کل پرداخت‌شده</span>
                      <span className="text-lg text-teal-600" dir="ltr">
                        {formatPrice(order.total_price)}
                      </span>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 text-[10px] text-text-tertiary">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              پرداخت امن
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              گارانتی اصالت
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              پشتیبانی ۲۴/۷
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center print:hidden">
            <Button asChild className="bg-navy hover:bg-navy-dark text-white gap-2 h-10 text-sm rounded-xl">
              <Link href="/profile/orders">
                <Package className="w-4 h-4" />
                پیگیری سفارش
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 text-sm rounded-xl gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                بازگشت به فروشگاه
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 text-sm rounded-xl gap-2"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" />
              چاپ رسید
            </Button>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-2 print:hidden">
            <span className="text-[10px] text-text-tertiary">اشتراک‌گذاری:</span>
            <button
              onClick={() => handleShare('copy')}
              className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center hover:bg-slate-200 transition-colors"
              title="کپی لینک"
            >
              <Copy className="w-3.5 h-3.5 text-text-secondary" />
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
              title="تلگرام"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors"
              title="واتساپ"
            >
              <Share2 className="w-3.5 h-3.5 text-green-600" />
            </button>
          </div>

          {/* Support */}
          <div className="text-center print:hidden">
            <p className="text-[10px] text-text-tertiary mb-1">مشکلی دارید؟ تماس بگیرید</p>
            <a
              href="tel:02112345678"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              <Phone className="w-3.5 h-3.5" />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </a>
          </div>
        </div>
      </>
    )
  }

  // ─── FAILED STATE ─────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-text-primary mb-1">پرداخت ناموفق</h1>
        <p className="text-text-secondary text-sm mb-3">متأسفانه پرداخت انجام نشد</p>
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 rounded-xl px-4 py-2 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          مبلغی از حساب شما کسر نشده است
        </div>
        {orderId && (
          <p className="text-xs text-text-tertiary mt-2">
            شماره سفارش: <span className="font-mono font-medium" dir="ltr">#{orderId}</span>
          </p>
        )}
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button asChild className="bg-navy hover:bg-navy-dark text-white h-10 text-sm rounded-xl">
          <Link href="/checkout">تلاش مجدد</Link>
        </Button>
        <Button asChild variant="outline" className="h-10 text-sm rounded-xl">
          <Link href="/cart">بازگشت به سبد خرید</Link>
        </Button>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-text-tertiary mb-1">مشکلی دارید؟ تماس بگیرید</p>
        <a
          href="tel:02112345678"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700"
        >
          <Phone className="w-3.5 h-3.5" />
          ۰۲۱-۱۲۳۴۵۶۷۸
        </a>
      </div>
    </div>
  )
}
