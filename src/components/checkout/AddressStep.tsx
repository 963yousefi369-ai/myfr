'use client'
import { useEffect, useState } from 'react'
import { Check, Plus, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { getAddresses, addAddress, getProvinces, getCities } from '@/lib/api/django'

interface AddressStepProps {
  token: string
  selectedId: number | null
  onSelect: (id: number, addressObj?: any) => void
  onNext: () => void
}

export default function AddressStep({ token, selectedId, onSelect, onNext }: AddressStepProps) {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [provinces, setProvinces] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loadError, setLoadError] = useState('')

  const [form, setForm] = useState({
    title: '',
    province_id: '',
    province_name: '',   // ← نام استان برای ارسال به بک‌اند
    city_id: '',
    city_name: '',       // ← نام شهر برای ارسال به بک‌اند
    street: '',
    postal_code: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [addrs, provs] = await Promise.all([getAddresses(token), getProvinces()])
        setAddresses(addrs)
        setProvinces(provs)
        if (addrs.length > 0 && !selectedId) onSelect(addrs[0].id, addrs[0])
      } catch {
        setLoadError('خطا در بارگذاری آدرس‌ها. لطفاً صفحه را رفرش کنید.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const handleProvinceChange = async (provinceId: string) => {
    // پیدا کردن نام استان از لیست
    const province = provinces.find((p) => String(p.id) === provinceId)
    setForm((f) => ({
      ...f,
      province_id: provinceId,
      province_name: province?.name ?? '',
      city_id: '',
      city_name: '',
    }))
    setCities([])
    try {
      const c = await getCities(Number(provinceId))
      setCities(c)
    } catch {
      // ignore
    }
  }

  const handleCityChange = (cityId: string) => {
    // پیدا کردن نام شهر از لیست
    const city = cities.find((c) => String(c.id) === cityId)
    setForm((f) => ({
      ...f,
      city_id: cityId,
      city_name: city?.name ?? '',
    }))
  }

  const handleSave = async () => {
    if (!form.province_name || !form.city_name || !form.street || !form.postal_code) return
    setSaving(true)
    setSaveError('')
    try {
      // بک‌اند انتظار دارد province و city به صورت string (نام) باشند
      const newAddr = await addAddress(token, {
        title: form.title || 'آدرس جدید',
        province: form.province_name,   // ← string نه id
        city: form.city_name,           // ← string نه id
        street: form.street,
        postal_code: form.postal_code,
        is_default: addresses.length === 0,
      })
      setAddresses((prev) => [...prev, newAddr])
      onSelect(newAddr.id, newAddr)
      setShowForm(false)
      setForm({ title: '', province_id: '', province_name: '', city_id: '', city_name: '', street: '', postal_code: '' })
    } catch (e: any) {
      setSaveError('خطا در ذخیره آدرس. لطفاً دوباره تلاش کنید.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text-primary mb-4">انتخاب آدرس تحویل</h2>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center space-y-3">
            <p className="text-red-600 text-sm">{loadError}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-text-primary mb-4">انتخاب آدرس تحویل</h2>

      {addresses.map((addr) => (
        <Card
          key={addr.id}
          onClick={() => onSelect(addr.id, addr)}
          className={cn(
            'cursor-pointer transition-all border-2',
            selectedId === addr.id
              ? 'border-navy bg-navy/5 shadow-[var(--shadow-navy)]'
              : 'border-border-default hover:border-navy/40'
          )}
        >
          <CardContent className="p-4 flex items-start gap-3">
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0',
                selectedId === addr.id ? 'border-navy bg-navy' : 'border-border-default'
              )}
            >
              {selectedId === addr.id && <Check className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-text-primary text-sm">
                {addr.title || 'آدرس'}
              </p>
              <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                {/* بک‌اند province و city را به صورت string برمی‌گرداند */}
                {addr.province} — {addr.city} — {addr.street}
              </p>
              {addr.postal_code && (
                <p className="text-text-tertiary text-xs mt-1">
                  کد پستی: {addr.postal_code}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add new address */}
      <Button
        variant="outline"
        className="w-full border-dashed border-navy/40 text-navy hover:bg-navy/5 gap-2"
        onClick={() => setShowForm((v) => !v)}
      >
        {showForm ? <ChevronDown className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {showForm ? 'بستن فرم' : 'افزودن آدرس جدید'}
      </Button>

      {showForm && (
        <Card className="border-navy/20">
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>عنوان آدرس</Label>
                <Input
                  placeholder="مثال: خانه، محل کار"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>کد پستی *</Label>
                <Input
                  placeholder="۱۰ رقم"
                  value={form.postal_code}
                  onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>استان *</Label>
                <Select value={form.province_id} onValueChange={handleProvinceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب استان" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>شهر *</Label>
                <Select
                  value={form.city_id}
                  onValueChange={handleCityChange}
                  disabled={!form.province_id || cities.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={form.province_id ? 'انتخاب شهر' : 'ابتدا استان انتخاب کنید'} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>آدرس دقیق *</Label>
              <Textarea
                placeholder="خیابان، کوچه، پلاک..."
                rows={3}
                value={form.street}
                onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
              />
            </div>

            {saveError && (
              <p className="text-error text-sm bg-error/10 rounded-lg p-2">{saveError}</p>
            )}

            <Button
              className="w-full bg-navy hover:bg-navy-dark text-white"
              onClick={handleSave}
              disabled={saving || !form.province_name || !form.city_name || !form.street || !form.postal_code}
            >
              {saving ? 'در حال ذخیره...' : 'ذخیره آدرس'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-start pt-4">
        <Button
          className="bg-navy hover:bg-navy-dark text-white px-8"
          onClick={onNext}
          disabled={!selectedId}
        >
          مرحله بعد
        </Button>
      </div>
    </div>
  )
}
