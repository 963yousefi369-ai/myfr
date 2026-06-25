'use client'
import { useEffect, useState } from 'react'
import { Check, Truck, Clock, Bike, Package, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatPrice } from '@/lib/utils'
import { calculateShipping, getProvinces, getCities } from '@/lib/api/django'
import { useCartStore } from '@/lib/store/cart'

interface ShippingOption {
  id: number
  name: string
  slug: string
  carrier_name: string
  tracking_url_template: string
  cost: number
  min_days: number
  max_days: number
  method_type: string
}

interface ShippingStepProps {
  addressId: number
  address: any
  selectedMethodId: number | null
  onSelect: (method: ShippingOption) => void
  onNext: () => void
  onBack: () => void
}

const METHOD_ICONS: Record<string, typeof Truck> = {
  pishtaz: Package,
  sefareshi: Truck,
  tipax: Zap,
  pik: Bike,
  barbari: Truck,
}

const METHOD_COLORS: Record<string, { bg: string; text: string }> = {
  pishtaz: { bg: 'bg-blue-50', text: 'text-blue-600' },
  sefareshi: { bg: 'bg-gray-50', text: 'text-gray-600' },
  tipax: { bg: 'bg-orange-50', text: 'text-orange-600' },
  pik: { bg: 'bg-green-50', text: 'text-green-600' },
  barbari: { bg: 'bg-amber-50', text: 'text-amber-600' },
}

export default function ShippingStep({
  addressId, address, selectedMethodId, onSelect, onNext, onBack
}: ShippingStepProps) {
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { items } = useCartStore()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const provinces = await getProvinces()
        const province = provinces.find((p: any) => p.name === address?.province)
        if (!province) {
          setError('استان آدرس یافت نشد.')
          setLoading(false)
          return
        }

        let cityId: number | undefined
        try {
          const cities = await getCities(province.id)
          const city = cities.find((c: any) => c.name === address?.city)
          if (city) cityId = city.id
        } catch {}

        const data = await calculateShipping({
          province_id: province.id,
          city_id: cityId ?? 0,
          items: items.map((i) => ({ product_id: Number(i.product_id), quantity: i.quantity })),
        })
        const list = Array.isArray(data) ? data : data.options ?? []
        setOptions(list)
        if (list.length === 0) {
          setError('روش ارسالی برای آدرس شما یافت نشد.')
        }
      } catch (e: any) {
        setError('خطا در دریافت روش‌های ارسال.')
      } finally {
        setLoading(false)
      }
    }
    if (addressId && items.length > 0) load()
  }, [addressId, address, items])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-error text-sm bg-error/10 rounded-xl p-3 text-center">{error}</p>
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={onBack}>مرحله قبل</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-text-primary mb-4">انتخاب روش ارسال</h2>

      {options.map((opt) => {
        const Icon = METHOD_ICONS[opt.method_type] || Truck
        const colors = METHOD_COLORS[opt.method_type] || { bg: 'bg-gray-50', text: 'text-gray-600' }

        return (
          <Card
            key={opt.id}
            onClick={() => onSelect(opt)}
            className={cn(
              'cursor-pointer transition-all border-2',
              selectedMethodId === opt.id
                ? 'border-navy bg-navy/5 shadow-[var(--shadow-navy)]'
                : 'border-border-default hover:border-navy/40'
            )}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  selectedMethodId === opt.id ? 'border-navy bg-navy' : 'border-border-default'
                )}
              >
                {selectedMethodId === opt.id && <Check className="w-3 h-3 text-white" />}
              </div>

              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', colors.bg)}>
                <Icon className={cn('w-4 h-4', colors.text)} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-text-primary text-sm">{opt.name}</p>
                  {opt.carrier_name && (
                    <span className="text-[10px] bg-teal/10 text-teal px-1.5 py-0.5 rounded-full">
                      {opt.carrier_name}
                    </span>
                  )}
                  {opt.method_type === 'pik' && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                      فقط مشهد
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  {opt.method_type !== 'pik' && (
                    <div className="flex items-center gap-1 text-text-tertiary text-xs">
                      <Clock className="w-3 h-3" />
                      {opt.min_days === opt.max_days
                        ? `${opt.min_days} روز کاری`
                        : `${opt.min_days} تا ${opt.max_days} روز کاری`}
                    </div>
                  )}
                  {opt.method_type === 'pik' && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <Zap className="w-3 h-3" />
                      ارسال در همان روز
                    </div>
                  )}
                </div>
              </div>

              <div className="text-left flex-shrink-0">
                {opt.cost === 0 ? (
                  <p className="font-bold text-emerald-600 text-sm">رایگان</p>
                ) : (
                  <p className="font-bold text-navy text-sm">{formatPrice(opt.cost)} تومان</p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          مرحله قبل
        </Button>
        <Button
          className="bg-navy hover:bg-navy-dark text-white px-8"
          onClick={onNext}
          disabled={!selectedMethodId}
        >
          مرحله بعد
        </Button>
      </div>
    </div>
  )
}
