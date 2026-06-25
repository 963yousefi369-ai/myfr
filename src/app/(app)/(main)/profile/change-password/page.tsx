'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useAuthStore } from '@/lib/store/auth'
import { changePassword } from '@/lib/api/django'
import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'

const schema = z.object({
  old_password:        z.string().min(1, 'رمز فعلی الزامی است'),
  new_password:        z.string().min(8, 'رمز جدید باید حداقل ۸ کاراکتر باشد'),
  confirm_password:    z.string().min(1, 'تأیید رمز الزامی است'),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'رمز جدید و تأیید آن یکسان نیستند',
  path: ['confirm_password'],
})
type FormData = z.infer<typeof schema>

function PasswordField({
  label, name, form, placeholder,
}: {
  label: string; name: keyof FormData; form: any; placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                dir="ltr"
                className="pl-10 rounded-xl"
                {...field}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default function ChangePasswordPage() {
  const { token } = useAuthStore()
  const [saving, setSaving] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { old_password: '', new_password: '', confirm_password: '' },
  })

  const onSubmit = async (data: FormData) => {
    if (!token) return
    setSaving(true)
    try {
      await changePassword(token, {
        old_password: data.old_password,
        new_password: data.new_password,
      })
      toast.success('رمز عبور با موفقیت تغییر کرد')
      form.reset()
    } catch {
      toast.error('رمز فعلی اشتباه است یا خطایی رخ داده')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <BreadcrumbTrail dark={false} />

      <Card className="max-w-lg rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#1e3a5f]" />
            </div>
            <CardTitle className="text-[#1e3a5f]">تغییر رمز عبور</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <PasswordField label="رمز عبور فعلی"  name="old_password"     form={form} />
              <PasswordField label="رمز عبور جدید"  name="new_password"     form={form} placeholder="حداقل ۸ کاراکتر" />
              <PasswordField label="تأیید رمز جدید" name="confirm_password" form={form} />
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white px-8 gap-2 rounded-xl"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'در حال ذخیره...' : 'تغییر رمز'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
