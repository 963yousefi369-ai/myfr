'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, User, Mail, Phone, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/lib/store/auth'
import { getProfile, updateProfile } from '@/lib/api/django'
import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'

const schema = z.object({
  full_name:   z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  email:       z.string().email('ایمیل نامعتبر').or(z.literal('')).optional(),
  national_id: z.string().length(10, 'کد ملی باید ۱۰ رقم باشد').or(z.literal('')).optional(),
})
type FormData = z.infer<typeof schema>

export default function ProfilePage() {
  const { token, user, setAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: '', email: '', national_id: '' },
  })

  useEffect(() => {
    if (!token) return
    getProfile(token)
      .then((p) => {
        form.reset({
          full_name:   p.full_name   ?? '',
          email:       p.email       ?? '',
          national_id: p.national_id ?? '',
        })
      })
      .catch(() => toast.error('خطا در بارگذاری اطلاعات'))
      .finally(() => setLoading(false))
  }, [token])

  const onSubmit = async (data: FormData) => {
    if (!token) return
    setSaving(true)
    try {
      const updated = await updateProfile(token, data)
      if (user) setAuth(token, { ...user, ...updated })
      toast.success('اطلاعات با موفقیت ذخیره شد')
    } catch {
      toast.error('خطا در ذخیره اطلاعات')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Card className="rounded-2xl shadow-md">
          <CardHeader><CardTitle>اطلاعات حساب</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BreadcrumbTrail dark={false} />

      <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#1e3a5f]" />
            </div>
            <CardTitle className="text-[#1e3a5f]">اطلاعات حساب</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              <div className="space-y-2">
                <Label className="text-gray-500 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  شماره موبایل
                </Label>
                <Input
                  value={user?.phone_number ?? ''}
                  disabled
                  className="bg-[#f1f5f9] text-gray-400 cursor-not-allowed rounded-xl"
                  dir="ltr"
                />
                <p className="text-xs text-gray-400">شماره موبایل قابل ویرایش نیست</p>
              </div>

              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      نام و نام خانوادگی
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="علی محمدی" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      ایمیل <span className="text-gray-400 text-xs">(اختیاری)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" dir="ltr" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="national_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5" />
                      کد ملی <span className="text-gray-400 text-xs">(اختیاری)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="۱۰ رقم" maxLength={10} dir="ltr" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white px-8 gap-2 rounded-xl"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
