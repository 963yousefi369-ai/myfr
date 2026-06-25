'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn, formatPrice } from '@/lib/utils'
import { createOrder, initiatePayment } from '@/lib/api/django'
import { useCartStore } from '@/lib/store/cart'

interface ConfirmStepProps {
  token: string
  address: any
  shippingMethod: any
  onBack: () => void
}

export default function ConfirmStep({ token, address, shippingMethod, onBack }: ConfirmStepProps) {
  const router = useRouter()
  const { items, totalPrice } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = totalPrice()
  const shipping = shippingMethod?.cost ?? 0
  const total = subtotal + Number(shipping)

  const handlePay = async () => {
    setLoading(true)
    setError('')
    try {
      const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const order = await createOrder(token, {
        address_id: address.id,
        shipping_method_id: shippingMethod.id,
        items: items.map((i) => ({ product_id: Number(i.product_id), quantity: i.quantity })),
        idempotency_key: idempotencyKey,
      })
      const payment = await initiatePayment(token, String(order.id))
      // Save order ID so receipt page can clear cart after confirmed payment
      sessionStorage.setItem('last_order_id', String(order.id))
      sessionStorage.setItem('last_order_items', JSON.stringify(items))
      if (payment.payment_url) {
        window.location.href = payment.payment_url
      } else {
        router.push(`/payment/result?status=paid&order_id=${order.id}`)
      }
    } catch (e: any) {
      const msg = e?.message || ''
      if (msg.includes('422') || msg.includes('validation')) {
        setError('اطلاعات سفارش نامعتبر است. لطفاً مراحل قبل را بررسی کنید.')
      } else if (msg.includes('403') || msg.includes('shop_disabled')) {
        setError('فروشگاه در حال حاضر غیرفعال است.')
      } else if (msg.includes('insufficient_stock') || msg.includes('400')) {
        setError('موجودی یکی از محصولات کافی نیست. لطفاً سبد خرید را بررسی کنید.')
      } else if (msg.includes('401') || msg.includes('403')) {
        setError('نشست شما منقضی شده. لطفاً دوباره وارد شوید.')
      } else {
        setError('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.')
      }
    } finally {
      setLoading(false)
    }
  }

  // بک‌اند province و city را به صورت string برمی‌گرداند (نه آبجکت)
  const provinceName = typeof address?.province === 'object'
    ? address?.province?.name
    : address?.province ?? ''
  const cityName = typeof address?.city === 'object'
    ? address?.city?.name
    : address?.city ?? ''

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-text-primary">تأیید و پرداخت</h2>

      {/* Items */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <p className="font-semibold text-text-primary text-sm mb-3">اقلام سفارش</p>
          {items.map((item) => (
            <div key={item.product_id} className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                <Image
                  src={item.imageUrl || '/placeholder-product.svg'}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-xs font-medium line-clamp-1">{item.name}</p>
                <p className="text-text-tertiary text-xs">× {item.quantity}</p>
              </div>
              <p className="text-navy font-semibold text-sm flex-shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardContent className="p-4">
          <p className="font-semibold text-text-primary text-sm mb-2">آدرس تحویل</p>
          <p className="text-text-secondary text-xs leading-relaxed">
            {provinceName} — {cityName} — {address?.street}
          </p>
          {address?.postal_code && (
            <p className="text-text-tertiary text-xs mt-1">کد پستی: {address.postal_code}</p>
          )}
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-text-primary text-sm">روش ارسال</p>
            <p className="text-text-secondary text-xs">{shippingMethod?.name}</p>
          </div>
          <p className="text-navy font-semibold text-sm">{formatPrice(Number(shipping))}</p>
        </CardContent>
      </Card>

      {/* Price summary */}
      <Card className="border-navy/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>جمع محصولات</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>هزینه ارسال</span>
            <span>{formatPrice(Number(shipping))}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-text-primary text-base">
            <span>جمع کل</span>
            <span className="text-navy">{formatPrice(total)}</span>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-error text-sm text-center bg-error/10 rounded-xl p-3">{error}</p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          مرحله قبل
        </Button>
        <Button
          className="bg-navy hover:bg-navy-dark text-white px-8 gap-2"
          onClick={handlePay}
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'در حال پردازش...' : 'پرداخت آنلاین'}
        </Button>
      </div>
    </div>
  )
}
