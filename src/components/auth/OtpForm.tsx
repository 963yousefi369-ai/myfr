'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { sendOtp, verifyOtp, getProfile } from '@/lib/api/django'
import { useAuthStore } from '@/lib/store/auth'
import { normalizePhone } from '@/lib/utils'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import OtpInput from './OtpInput'
import CountdownTimer from './CountdownTimer'
import { ArrowLeft, Phone, Shield } from 'lucide-react'

const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'شماره موبایل را وارد کنید')
    .transform((v) => normalizePhone(v))
    .refine((v) => /^09[0-9]{9}$/.test(v), {
      message: 'شماره موبایل معتبر نیست',
    }),
})

interface OtpFormProps {
  redirectTo: string
}

export default function OtpForm({ redirectTo }: OtpFormProps) {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [testOtpCode, setTestOtpCode] = useState<string | null>(null)

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  })

  async function handleSendOtp(values: z.infer<typeof phoneSchema>) {
    setSendLoading(true)
    setTestOtpCode(null)
    try {
      const res = await sendOtp(values.phone)
      if (res.otp_code) setTestOtpCode(res.otp_code)
      setPhone(values.phone)
      setOtp('')
      setStep('otp')
      setTimerKey((k) => k + 1)
      toast.success('کد تأیید ارسال شد')
    } catch {
      toast.error('خطا در ارسال کد — لطفاً دوباره تلاش کنید')
    } finally {
      setSendLoading(false)
    }
  }

  async function handleResend() {
    setSendLoading(true)
    setTestOtpCode(null)
    try {
      const res = await sendOtp(phone)
      if (res.otp_code) setTestOtpCode(res.otp_code)
      setOtp('')
      setTimerKey((k) => k + 1)
      toast.success('کد جدید ارسال شد')
    } catch {
      toast.error('خطا در ارسال کد')
    } finally {
      setSendLoading(false)
    }
  }

  async function handleVerify() {
    if (otp.length < 6) {
      toast.error('کد ۶ رقمی را کامل وارد کنید')
      return
    }
    setVerifyLoading(true)
    try {
      const { access } = await verifyOtp(phone, otp)
      try {
        const user = await getProfile(access)
        setAuth(access, user)
        toast.success('ورود موفق')
        router.push(redirectTo)
      } catch {
        toast.error('خطا در دریافت اطلاعات کاربر. دوباره تلاش کنید.')
        setOtp('')
      }
    } catch {
      toast.error('کد وارد شده اشتباه یا منقضی شده است')
      setOtp('')
    } finally {
      setVerifyLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <div className="space-y-6">
        {/* Phone display */}
        <div className="flex items-center justify-between bg-bg-secondary/70 rounded-xl px-4 py-3 border border-border-default/30">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Phone className="w-4 h-4 text-navy" />
            <span dir="ltr" className="font-mono font-medium">{phone}</span>
          </div>
          <button
            type="button"
            onClick={() => { setStep('phone'); setOtp('') }}
            className="text-sm text-navy hover:text-navy-dark font-medium flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            ویرایش
          </button>
        </div>

        {testOtpCode && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center">
            <p className="text-xs text-amber-600 mb-1 font-medium">
              ⚠️ حالت آزمایشی — کد تأیید نمایش داده میشود
            </p>
            <button
              type="button"
              onClick={() => { setOtp(testOtpCode); navigator.clipboard?.writeText(testOtpCode) }}
              className="font-mono text-2xl font-extrabold text-amber-700 tracking-widest hover:text-amber-800 transition-colors"
              dir="ltr"
            >
              {testOtpCode}
            </button>
            <p className="text-[10px] text-amber-500 mt-1">برای کپی کلیک کنید</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="space-y-3">
          <p className="text-sm text-text-secondary text-center">
            کد ۶ رقمی ارسال‌شده را وارد کنید
          </p>
          <OtpInput value={otp} onChange={setOtp} disabled={verifyLoading} />
        </div>

        {/* Timer */}
        <div className="flex justify-center">
          <CountdownTimer
            key={timerKey}
            seconds={120}
            onResend={handleResend}
            loading={sendLoading}
          />
        </div>

        {/* Verify button */}
        <Button
          type="button"
          className="w-full h-12 bg-gradient-to-l from-navy to-navy-dark hover:shadow-navy text-white font-semibold text-base rounded-xl hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
          onClick={handleVerify}
          disabled={verifyLoading || otp.length < 6}
        >
          {verifyLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              در حال تأیید...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              تأیید و ورود
            </span>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Form {...phoneForm}>
      <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-5" noValidate>
        <FormField
          control={phoneForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-text-primary">شماره موبایل</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789 یا 9123456789"
                  className="h-12 text-base text-left placeholder:text-slate-300 placeholder:text-right rounded-xl border-border-default/50 focus:border-navy/30 focus:ring-navy/10 transition-all duration-200"
                  inputMode="numeric"
                  autoComplete="tel"
                  autoFocus
                />
              </FormControl>
              <p className="text-xs text-slate-400 mt-1">
                با یا بدون صفر اول قبول میشه — مثلاً 9123456789 یا 09123456789
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-l from-navy to-navy-dark hover:shadow-navy text-white font-semibold text-base rounded-xl hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
          disabled={sendLoading}
        >
          {sendLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              در حال ارسال...
            </span>
          ) : (
            'دریافت کد تأیید'
          )}
        </Button>
      </form>
    </Form>
  )
}
