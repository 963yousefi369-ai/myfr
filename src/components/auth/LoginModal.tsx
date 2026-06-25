'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Shield, CheckCircle, User, ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OtpInput6 } from '@/components/auth/OtpInput6'
import { useLoginModal } from '@/lib/store/login-modal'
import { useAuthStore } from '@/lib/store/auth'
import { sendOtp, verifyOtp, getProfile, updateProfile } from '@/lib/api/django'
import { toast } from 'sonner'
import { fireSuccessConfetti } from '@/lib/confetti'
import { normalizePhone } from '@/lib/utils'

type Step = 'phone' | 'otp' | 'name' | 'success'

function toFaDigits(n: number) {
  return n.toLocaleString('fa-IR').padStart(2, '۰')
}

export default function LoginModal() {
  const { open, message, returnUrl, onLoginSuccess, closeLogin } = useLoginModal()
  const setAuth = useAuthStore((s) => s.setAuth)
  const token = useAuthStore((s) => s.token)

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [nameLoading, setNameLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [timerKey, setTimerKey] = useState(0)
  const [remaining, setRemaining] = useState(120)
  const [testOtpCode, setTestOtpCode] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep('phone')
        setPhone('')
        setOtp('')
        setName('')
        setPhoneError('')
        setTestOtpCode(null)
      }, 300)
    }
  }, [open])

  useEffect(() => {
    if (open && token) closeLogin()
  }, [open, token, closeLogin])

  useEffect(() => {
    if (step !== 'otp') return
    setRemaining(120)
    setTimerKey((k) => k + 1)
  }, [step])

  useEffect(() => {
    if (step !== 'otp') return
    if (remaining <= 0) return
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, step])

  const validatePhone = (p: string) => /^09[0-9]{9}$/.test(p)

  const handleSendOtp = async () => {
    const normalizedPhone = normalizePhone(phone)
    if (!validatePhone(normalizedPhone)) {
      setPhoneError('شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)')
      return
    }
    setPhoneError('')
    setPhone(normalizedPhone)
    setSendLoading(true)
    setTestOtpCode(null)
    try {
      const res = await sendOtp(normalizedPhone)
      if (res.otp_code) setTestOtpCode(res.otp_code)
      setOtp('')
      setStep('otp')
      toast.success('کد تأیید ارسال شد')
    } catch {
      toast.error('خطا در ارسال کد — لطفاً دوباره تلاش کنید')
    } finally {
      setSendLoading(false)
    }
  }

  const handleResend = async () => {
    setSendLoading(true)
    setTestOtpCode(null)
    try {
      const res = await sendOtp(phone)
      if (res.otp_code) setTestOtpCode(res.otp_code)
      setOtp('')
      setRemaining(120)
      setTimerKey((k) => k + 1)
      toast.success('کد جدید ارسال شد')
    } catch {
      toast.error('خطا در ارسال کد')
    } finally {
      setSendLoading(false)
    }
  }

  const handleVerify = async () => {
    if (otp.length < 6) {
      toast.error('کد ۶ رقمی را کامل وارد کنید')
      return
    }
    setVerifyLoading(true)
    try {
      const { access } = await verifyOtp(phone, otp)
      const user = await getProfile(access)
      setAuth(access, user)
      if (!user.full_name) {
        setStep('name')
      } else {
        setStep('success')
      }
    } catch {
      toast.error('کد وارد شده اشتباه یا منقضی شده است')
      setOtp('')
    } finally {
      setVerifyLoading(false)
    }
  }

  const handleNameSubmit = async () => {
    const tokenVal = useAuthStore.getState().token
    if (!tokenVal) return
    setNameLoading(true)
    try {
      if (name.trim()) {
        const updated = await updateProfile(tokenVal, { full_name: name.trim() })
        const user = useAuthStore.getState().user
        if (user) setAuth(tokenVal, { ...user, full_name: updated.full_name || name.trim() })
      }
      setStep('success')
    } catch {
      setStep('success')
    } finally {
      setNameLoading(false)
    }
  }

  const handleSuccessClose = useCallback(() => {
    closeLogin()
    onLoginSuccess?.()
    if (returnUrl && typeof window !== 'undefined') {
      window.location.href = returnUrl
    }
  }, [closeLogin, onLoginSuccess, returnUrl])

  useEffect(() => {
    if (step === 'success') {
      fireSuccessConfetti()
      const t = setTimeout(handleSuccessClose, 1800)
      return () => clearTimeout(t)
    }
  }, [step, handleSuccessClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'phone') handleSendOtp()
      if (step === 'otp') handleVerify()
      if (step === 'name') handleNameSubmit()
    }
    if (e.key === 'Escape') closeLogin()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[600] bg-black/40 backdrop-blur-sm"
            onClick={closeLogin}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[700] w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            {/* Gradient header */}
            <div className="relative px-6 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #10b981 100%)' }}>
              <button
                onClick={closeLogin}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all duration-200 active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-base leading-tight">آتی فرزام ایرانیان</p>
                  <p className="text-white/60 text-xs leading-tight">سیستم‌های ردیابی GPS</p>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mt-2">
                {step === 'phone' && 'ورود به حساب کاربری'}
                {step === 'otp' && 'تأیید شماره موبایل'}
                {step === 'name' && 'تکمیل پروفایل'}
                {step === 'success' && 'خوش آمدید!'}
              </h2>
              {message && step === 'phone' && (
                <p className="text-white/70 text-sm mt-1.5">{message}</p>
              )}
              {/* Step indicator */}
              {step !== 'success' && (
                <div className="flex gap-2 mt-4">
                  {['phone', 'otp', 'name'].map((s, i) => (
                    <div
                      key={s}
                      className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                        ['phone', 'otp', 'name'].indexOf(step) >= i
                          ? 'bg-white'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {/* PHONE STEP */}
                {step === 'phone' && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-2">
                      <div className="w-16 h-16 rounded-2xl bg-navy/5 flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-7 h-7 text-navy" />
                      </div>
                      <p className="text-sm text-text-secondary">
                        شماره موبایل خود را وارد کنید
                      </p>
                    </div>
                    <div>
                      <div className="flex gap-2" dir="ltr">
                        <div className="flex items-center gap-1.5 px-3 h-12 rounded-xl bg-bg-secondary border border-border-default/50 text-sm text-text-secondary shrink-0">
                          <span className="text-lg">🇮🇷</span>
                          <span className="font-medium">+۹۸</span>
                        </div>
                        <div className="flex-1 relative">
                          <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))
                              setPhoneError('')
                            }}
                            placeholder="9123456789"
                            className="h-12 text-base text-left placeholder:text-slate-300 placeholder:text-sm rounded-xl border-border-default/50 focus:border-navy/30 focus:ring-navy/10"
                            inputMode="numeric"
                            autoFocus
                            dir="ltr"
                          />
                          {phone.length > 0 && (
                            <button
                              type="button"
                              onClick={() => { setPhone(''); setPhoneError('') }}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      {phoneError && (
                        <p className="text-error text-xs mt-2 pr-1">{phoneError}</p>
                      )}
                    </div>
                    <Button
                      onClick={handleSendOtp}
                      disabled={sendLoading}
                      className="w-full h-12 text-base rounded-xl font-bold gap-2 bg-navy hover:bg-navy-dark hover:shadow-lg transition-all duration-200"
                    >
                      {sendLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          دریافت کد تأیید
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* OTP STEP */}
                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-2">
                      <div className="w-16 h-16 rounded-2xl bg-navy/5 flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-7 h-7 text-navy" />
                      </div>
                      <p className="text-sm text-text-secondary">
                        کد ۶ رقمی ارسال‌شده به شماره زیر را وارد کنید
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span dir="ltr" className="font-mono font-semibold text-navy text-sm">{phone}</span>
                        <button
                          onClick={() => { setStep('phone'); setOtp('') }}
                          className="text-xs text-navy hover:underline"
                        >
                          ویرایش
                        </button>
                      </div>
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

                    <OtpInput6 value={otp} onChange={setOtp} disabled={verifyLoading} />

                    {/* Timer */}
                    <div className="flex justify-center">
                      {remaining > 0 ? (
                        <div className="flex items-center gap-2 text-sm text-text-tertiary">
                          <span>ارسال مجدد تا</span>
                          <span className="inline-flex items-center gap-1 bg-bg-secondary/70 px-2.5 py-1 rounded-lg border border-border-default/30">
                            <span className="font-mono font-bold text-text-primary tabular-nums" dir="ltr">
                              {toFaDigits(Math.floor(remaining / 60))}:{toFaDigits(remaining % 60)}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={handleResend}
                          disabled={sendLoading}
                          className="text-sm text-navy hover:text-navy-dark font-medium flex items-center gap-1.5 transition-colors"
                        >
                          {sendLoading ? (
                            <span className="w-3.5 h-3.5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                          ) : null}
                          ارسال مجدد کد
                        </button>
                      )}
                    </div>

                    <Button
                      onClick={handleVerify}
                      disabled={verifyLoading || otp.length < 6}
                      className="w-full h-12 text-base rounded-xl font-bold gap-2 bg-navy hover:bg-navy-dark hover:shadow-lg transition-all duration-200"
                    >
                      {verifyLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          در حال تأیید...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          تأیید و ورود
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* NAME STEP */}
                {step === 'name' && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-2">
                      <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
                        <User className="w-7 h-7 text-teal" />
                      </div>
                      <p className="text-sm text-text-secondary">
                        نام و نام خانوادگی خود را وارد کنید (اختیاری)
                      </p>
                    </div>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: علی محمدی"
                      className="h-12 text-base rounded-xl border-border-default/50 focus:border-navy/30 focus:ring-navy/10"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep('success')}
                        className="flex-1 h-12 rounded-xl text-sm"
                      >
                        رد شدن
                      </Button>
                      <Button
                        onClick={handleNameSubmit}
                        disabled={nameLoading}
                        className="flex-1 h-12 rounded-xl text-sm font-bold gap-2 bg-navy hover:bg-navy-dark hover:shadow-lg transition-all duration-200"
                      >
                        {nameLoading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            ثبت نام
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* SUCCESS STEP */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-green-200"
                    >
                      <motion.div
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        <CheckCircle className="w-10 h-10 text-white" />
                      </motion.div>
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl font-bold text-text-primary mb-2"
                    >
                      ورود موفق!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm text-text-secondary"
                    >
                      خوش آمدید
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border-default/30 bg-bg-secondary/30">
              <p className="text-center text-[11px] text-text-tertiary">
                با ورود به سایت،{' '}
                <a href="#" className="text-navy hover:underline">قوانین و مقررات</a>
                {' '}را می‌پذیرید.
              </p>
            </div>

            {/* Decorative particles */}
            <div className="absolute top-20 left-4 w-2 h-2 rounded-full bg-teal/20 animate-float pointer-events-none" style={{ animationDelay: '0s' }} />
            <div className="absolute top-32 right-8 w-1.5 h-1.5 rounded-full bg-navy/15 animate-float pointer-events-none" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 left-8 w-1 h-1 rounded-full bg-amber/20 animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
