'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, ArrowLeft, Phone, CheckCircle } from 'lucide-react'
import { Eye, EyeOff } from 'lucide-react'
import { normalizePhone, isValidPhone } from '@/lib/utils'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import OtpInput from '@/components/auth/OtpInput'
import CountdownTimer from '@/components/auth/CountdownTimer'
import { forgotPassword, resetPassword } from '@/lib/api/django'

const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'شماره موبایل را وارد کنید')
    .transform((v) => normalizePhone(v))
    .refine((v) => isValidPhone(v), {
      message: 'شماره موبایل معتبر نیست (مثال: 09123456789)',
    }),
})

const resetSchema = z
  .object({
    otp: z.string().length(6, 'کد ۶ رقمی را کامل وارد کنید'),
    password: z.string().min(6, 'رمز جدید حداقل ۶ کاراکتر باشد'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'رمز عبور و تکرار آن یکسان نیستند',
    path: ['confirm'],
  })

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'reset' | 'done'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [timerKey, setTimerKey] = useState(0)

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  })

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: '', password: '', confirm: '' },
  })

  async function handleSendOtp(values: z.infer<typeof phoneSchema>) {
    setLoading(true)
    try {
      await forgotPassword(values.phone)
      setPhone(values.phone)
      setStep('reset')
      setTimerKey((k) => k + 1)
      toast.success('کد بازیابی ارسال شد')
    } catch {
      toast.error('خطا در ارسال کد — شماره موبایل ثبت‌نام‌شده باشد')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setLoading(true)
    try {
      await forgotPassword(phone)
      setOtp('')
      setTimerKey((k) => k + 1)
      toast.success('کد جدید ارسال شد')
    } catch {
      toast.error('خطا در ارسال مجدد کد')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(values: z.infer<typeof resetSchema>) {
    setLoading(true)
    try {
      await resetPassword(phone, values.otp, values.password)
      setStep('done')
      toast.success('رمز عبور با موفقیت تغییر یافت')
    } catch {
      toast.error('کد وارد شده اشتباه یا منقضی شده است')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-deeper to-navy shadow-navy mb-4">
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">بازیابی رمز عبور</h1>
        <p className="text-sm text-text-secondary mt-1">آتی فرزام ایرانیان</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-border-default p-6 sm:p-8">

        {/* ── مرحله ۱: شماره موبایل ── */}
        {step === 'phone' && (
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-5" noValidate>
              <p className="text-sm text-text-secondary text-center mb-2">
                شماره موبایل ثبت‌نام‌شده را وارد کنید تا کد بازیابی برایتان ارسال شود.
              </p>
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره موبایل</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        dir="ltr"
                        placeholder="09123456789"
                        className="h-12 text-base text-left placeholder:text-right"
                        inputMode="numeric"
                        autoFocus
                      />
                    </FormControl>
                    <p className="text-xs text-text-tertiary mt-1">
                      فرمت‌های مجاز: 09123456789 ، 9123456789 ، +989123456789
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 bg-navy hover:bg-navy-dark text-white font-semibold" disabled={loading}>
                {loading ? 'در حال ارسال...' : 'ارسال کد بازیابی'}
              </Button>
            </form>
          </Form>
        )}

        {/* ── مرحله ۲: OTP + رمز جدید ── */}
        {step === 'reset' && (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-5" noValidate>
              <div className="flex items-center justify-between bg-bg-secondary rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Phone className="w-4 h-4" />
                  <span dir="ltr" className="font-mono font-medium">{phone}</span>
                </div>
                <button type="button" onClick={() => setStep('phone')} className="text-sm text-navy hover:text-navy-dark font-medium flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />ویرایش
                </button>
              </div>

              <FormField
                control={resetForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-center block">کد بازیابی</FormLabel>
                    <FormControl>
                      <OtpInput value={field.value} onChange={field.onChange} disabled={loading} />
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <CountdownTimer key={timerKey} seconds={120} onResend={handleResend} loading={loading} />
              </div>

              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز عبور جدید</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type={showPass ? 'text' : 'password'} dir="ltr" placeholder="حداقل ۶ کاراکتر" className="h-12 text-base pl-10 text-left" />
                        <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تکرار رمز عبور جدید</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type={showConfirm ? 'text' : 'password'} dir="ltr" placeholder="••••••••" className="h-12 text-base pl-10 text-left" />
                        <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-12 bg-navy hover:bg-navy-dark text-white font-semibold" disabled={loading}>
                {loading ? 'در حال تغییر رمز...' : 'تغییر رمز عبور'}
              </Button>
            </form>
          </Form>
        )}

        {/* ── مرحله ۳: موفق ── */}
        {step === 'done' && (
          <div className="text-center space-y-5 py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-success" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">رمز عبور تغییر یافت</h2>
              <p className="text-sm text-text-secondary mt-1">می‌توانید با رمز جدید وارد شوید.</p>
            </div>
            <Button className="w-full h-12 bg-navy hover:bg-navy-dark text-white font-semibold" onClick={() => router.push('/login')}>
              رفتن به صفحه ورود
            </Button>
          </div>
        )}
      </div>

      <div className="text-center mt-6">
        <Link href="/login" className="text-sm text-text-secondary hover:text-navy flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />بازگشت به ورود
        </Link>
      </div>
    </div>
  )
}
