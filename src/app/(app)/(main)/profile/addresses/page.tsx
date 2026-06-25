'use client'
import { useEffect, useState } from 'react'
import { Plus, MapPin, Trash2, Loader2, Home, Building, Edit2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { useAuthStore } from '@/lib/store/auth'
import { getAddresses, addAddress, getProvinces, getCities } from '@/lib/api/django'
import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'

const EMPTY_FORM = {
  title: '', province_id: '', province_name: '',
  city_id: '', city_name: '', street: '', postal_code: '',
}

export default function AddressesPage() {
  const { token } = useAuthStore()
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [provinces, setProvinces] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    if (!token) return
    Promise.all([getAddresses(token), getProvinces()])
      .then(([addrs, provs]) => { setAddresses(addrs); setProvinces(provs) })
      .catch(() => toast.error('خطا در بارگذاری اطلاعات'))
      .finally(() => setLoading(false))
  }, [token])

  const handleProvinceChange = async (provinceId: string) => {
    const province = provinces.find((p) => String(p.id) === provinceId)
    setForm((f) => ({ ...f, province_id: provinceId, province_name: province?.name ?? '', city_id: '', city_name: '' }))
    setCities([])
    try { setCities(await getCities(Number(provinceId))) } catch {}
  }

  const handleCityChange = (cityId: string) => {
    const city = cities.find((c) => String(c.id) === cityId)
    setForm((f) => ({ ...f, city_id: cityId, city_name: city?.name ?? '' }))
  }

  const handleSave = async () => {
    if (!form.province_name || !form.city_name || !form.street || !form.postal_code) {
      setSaveError('لطفاً تمام فیلدهای ستاره‌دار را پر کنید')
      return
    }
    if (!token) return
    setSaving(true); setSaveError('')
    try {
      const newAddr = await addAddress(token, {
        title: form.title || 'آدرس جدید',
        province: form.province_name,
        city: form.city_name,
        street: form.street,
        postal_code: form.postal_code,
        is_default: addresses.length === 0,
      })
      setAddresses((prev) => [...prev, newAddr])
      setShowDialog(false)
      setForm(EMPTY_FORM)
      setCities([])
      toast.success('آدرس جدید اضافه شد')
    } catch {
      setSaveError('خطا در ذخیره آدرس. لطفاً دوباره تلاش کنید.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    toast.success('آدرس حذف شد')
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Card className="rounded-2xl shadow-md">
          <CardHeader><CardTitle>آدرس‌های من</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[1,2].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BreadcrumbTrail dark={false} />

      <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#1e3a5f]" />
            </div>
            <CardTitle className="text-[#1e3a5f]">آدرس‌های من</CardTitle>
          </div>
          <Button
            size="sm"
            className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white gap-2 rounded-xl"
            onClick={() => { setShowDialog(true); setSaveError(''); setForm(EMPTY_FORM); setCities([]) }}
          >
            <Plus className="w-4 h-4" />
            افزودن آدرس
          </Button>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-[#1e3a5f]/40" />
              </div>
              <p className="text-gray-600 font-medium">هنوز آدرسی ثبت نشده</p>
              <Button
                variant="outline"
                className="border-[#1e3a5f]/30 text-[#1e3a5f] hover:bg-[#1e3a5f]/5 gap-2 mt-2 rounded-xl"
                onClick={() => setShowDialog(true)}
              >
                <Plus className="w-4 h-4" />
                افزودن اولین آدرس
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr, idx) => (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.3 }}
                  className="flex items-start justify-between gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#1e3a5f]/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center shrink-0 mt-0.5">
                      {addr.title?.includes('کار') ? (
                        <Building className="w-4 h-4 text-[#1e3a5f]" />
                      ) : (
                        <Home className="w-4 h-4 text-[#1e3a5f]" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1e3a5f] text-sm">{addr.title || 'آدرس'}</p>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                        {addr.province} — {addr.city} — {addr.street}
                      </p>
                      {addr.postal_code && (
                        <p className="text-gray-400 text-xs mt-0.5">کد پستی: {addr.postal_code}</p>
                      )}
                      {addr.is_default && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-xs bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/25 px-2 py-0.5 rounded-full font-medium">
                          <MapPin className="w-3 h-3" />
                          پیش‌فرض
                        </span>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0 rounded-xl"
                        disabled={deletingId === addr.id}
                      >
                        {deletingId === addr.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir="rtl" className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف آدرس</AlertDialogTitle>
                        <AlertDialogDescription>
                          آیا مطمئن هستید که می‌خواهید این آدرس را حذف کنید؟
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-row-reverse gap-2">
                        <AlertDialogAction
                          onClick={() => handleDelete(addr.id)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                        >
                          حذف
                        </AlertDialogAction>
                        <AlertDialogCancel className="rounded-xl">انصراف</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent dir="rtl" className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1e3a5f]">افزودن آدرس جدید</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>عنوان آدرس</Label>
                <Input
                  placeholder="خانه، محل کار..."
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>کد پستی *</Label>
                <Input
                  placeholder="۱۰ رقم"
                  maxLength={10}
                  dir="ltr"
                  value={form.postal_code}
                  onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>استان *</Label>
                <Select value={form.province_id} onValueChange={handleProvinceChange}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="انتخاب استان" /></SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
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
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={form.province_id ? 'انتخاب شهر' : 'اول استان'} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>آدرس دقیق *</Label>
              <Textarea
                placeholder="خیابان، کوچه، پلاک، واحد..."
                rows={3}
                value={form.street}
                onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            {saveError && (
              <p className="text-red-500 text-sm bg-red-50 rounded-xl p-2.5">{saveError}</p>
            )}
            <Button
              className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white gap-2 rounded-xl"
              onClick={handleSave}
              disabled={saving}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'در حال ذخیره...' : 'ذخیره آدرس'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
