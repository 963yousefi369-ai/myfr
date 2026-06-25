'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Truck, ShieldCheck, Headphones, Zap, Bell, Phone, CheckCircle, Box, Weight } from 'lucide-react'

import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'
import PulsingDot from '@/components/tracking/PulsingDot'
import ImageSlider from '@/components/product/ImageSlider'
import QuantitySelector from '@/components/product/QuantitySelector'
import AddToCartButton from '@/components/product/AddToCartButton'
import ProductDetailTabs from './ProductDetailTabs'
import SimilarProducts from './SimilarProducts'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatPrice, cn } from '@/lib/utils'

interface ProductDetailClientProps {
  product: {
    id: string | number
    name: string
    slug: string
    price: number
    compare_price?: number
    effective_price?: number
    description?: string
    sku?: string
    in_stock?: boolean
    stock?: number
    weight?: number
    length?: number
    width?: number
    height?: number
    volumetric_weight?: number
    effective_shipping_weight?: number
    rating?: number
    review_count?: number
    category_id?: number
    features?: string[]
    specifications?: Record<string, string>
    faqs?: Array<{ q: string; a: string }>
    reviews?: any[]
  }
  images: string[]
  similarProducts: any[]
}

export default function ProductDetailClient({
  product,
  images,
  similarProducts,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [notifyPhone, setNotifyPhone] = useState('')
  const [notifySent, setNotifySent] = useState(false)

  const maxQty = product.stock ?? 99
  const isOutOfStock = product.in_stock === false || product.stock === 0
  const hasDiscount = product.compare_price != null && product.compare_price > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compare_price!) * 100)
    : 0
  const features: string[] = product.features ?? []
  const specs: Record<string, string> = product.specifications ?? {}
  const faqs = product.faqs ?? []

  const handleNotify = () => {
    if (!notifyPhone || !/^09[0-9]{9}$/.test(notifyPhone)) {
      toast.error('شماره موبایل معتبر وارد کنید')
      return
    }
    setNotifySent(true)
    toast.success('ثبت شد! به محض موجود شدن اطلاع‌رسانی می‌شوید')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BreadcrumbTrail dark={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="order-1">
            <ImageSlider images={images} productName={product.name} />
          </div>

          <div className="order-2 flex flex-col gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-xs text-gray-400">کد محصول: {product.sku}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <PulsingDot color={isOutOfStock ? 'red' : 'green'} size={8} />
              <span
                className={cn(
                  'text-sm font-semibold',
                  isOutOfStock ? 'text-red-600' : 'text-[#10b981]'
                )}
              >
                {isOutOfStock ? 'ناموجود' : 'موجود در انبار'}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={cn(
                    'text-3xl font-extrabold',
                    hasDiscount ? 'text-navy' : 'text-[#1e3a5f]'
                  )}
                >
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <Badge className="bg-teal-600 text-white border-0 font-bold text-sm px-3 py-1">
                      {discountPercent}٪ تخفیف
                    </Badge>
                    <span className="text-gray-400 text-sm line-through">
                      {formatPrice(product.compare_price!)}
                    </span>
                  </>
                )}
              </div>
              {hasDiscount && (
                <p className="text-[#10b981] text-sm mt-2 font-semibold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {formatPrice(product.compare_price! - product.price)} صرفه‌جویی
                </p>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 leading-7">{product.description}</p>
            )}

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 font-medium">تعداد:</span>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={maxQty}
              />
            </div>

            {isOutOfStock ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-red-50 rounded-2xl p-5 border border-red-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-5 h-5 text-red-500" />
                  <h4 className="font-bold text-red-700">فعلاً موجود نیست</h4>
                </div>
                <p className="text-sm text-red-600 mb-4">
                  شماره موبایل خود را وارد کنید تا به محض موجود شدن اطلاع‌رسانی شوید.
                </p>
                <AnimatePresence mode="wait">
                  {notifySent ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200"
                    >
                      <CheckCircle className="w-5 h-5 text-[#10b981]" />
                      <span className="text-green-700 font-medium text-sm">ثبت شد! اطلاع‌رسانی خواهید شد.</span>
                    </motion.div>
                  ) : (
                    <motion.div key="form" className="flex gap-2" dir="ltr">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="tel"
                          value={notifyPhone}
                          onChange={(e) => setNotifyPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                          placeholder="09123456789"
                          className="h-11 rounded-xl text-left pl-10 border-red-200 focus:border-red-400 focus:ring-red-100"
                          dir="ltr"
                        />
                      </div>
                      <Button
                        onClick={handleNotify}
                        className="h-11 px-5 rounded-xl bg-[#f59e0b] text-white font-semibold hover:shadow-lg transition-all"
                      >
                        <Bell className="w-4 h-4 ml-1.5" />
                        اطلاع‌رسانی
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <AddToCartButton
                product={product}
                quantity={quantity}
                imageUrl={images[0]}
                inStock={!isOutOfStock}
              />
            )}

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">ارسال به سراسر ایران</p>
                <p className="text-xs text-slate-500 mt-0.5">تحویل ۲ تا ۵ روز کاری — هزینه ارسال بر اساس آدرس</p>
              </div>
            </div>

            {(product.weight ?? 0) > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Weight className="w-4 h-4 text-blue-600" />
                  <p className="text-xs font-semibold text-blue-700">اطلاعات وزن ارسال</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">وزن واقعی:</span>
                    <span className="font-medium text-gray-700">{product.weight} kg</span>
                  </div>
                  {(product.volumetric_weight ?? 0) > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">وزن حجمی:</span>
                        <span className="font-medium text-gray-700">{(product.volumetric_weight ?? 0).toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between col-span-2 pt-1 border-t border-blue-100">
                        <span className="text-blue-600 font-medium">وزن نهایی ارسال:</span>
                        <span className="font-bold text-blue-700">{(product.effective_shipping_weight ?? 0).toFixed(2)} kg</span>
                      </div>
                      <p className="col-span-2 text-[10px] text-gray-400 mt-1">
                        وزن حجمی = (طول × عرض × ارتفاع) ÷ ۵۰۰۰ — هر کدام بیشتر باشد ملاک است
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, label: 'ارسال سریع', color: 'text-[#1e3a5f]', bg: 'bg-blue-50' },
                { icon: ShieldCheck, label: 'ضمانت اصالت', color: 'text-[#10b981]', bg: 'bg-green-50' },
                { icon: Headphones, label: 'پشتیبانی ۲۴/۷', color: 'text-[#f59e0b]', bg: 'bg-amber-50' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div
                  key={label}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-2xl p-3 border border-slate-100 text-center',
                    bg
                  )}
                >
                  <Icon className={cn('w-5 h-5', color)} />
                  <span className="text-xs text-gray-600 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProductDetailTabs
          product={product}
          features={features}
          specs={specs}
          faqs={faqs}
        />

        {similarProducts.length > 0 && (
          <SimilarProducts products={similarProducts} />
        )}
      </div>
    </div>
  )
}
