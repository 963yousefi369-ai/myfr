'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OtpForm from '@/components/auth/OtpForm'
import PasswordForm from '@/components/auth/PasswordForm'

function LoginCard() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  return (
    <div className="w-full max-w-md">
      {/* Logo & header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-teal shadow-lg mb-4">
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">ورود به حساب کاربری</h1>
        <p className="text-sm text-text-secondary mt-1">آتی فرزام ایرانیان — سیستم‌های ردیابی GPS</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-border-default p-6 sm:p-8">
        <Tabs defaultValue="otp" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6 h-11 bg-bg-secondary rounded-xl">
            <TabsTrigger
              value="otp"
              className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
            >
              کد یک‌بار مصرف
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
            >
              رمز عبور
            </TabsTrigger>
          </TabsList>

          <TabsContent value="otp" className="mt-0">
            <OtpForm redirectTo={redirectTo} />
          </TabsContent>

          <TabsContent value="password" className="mt-0">
            <PasswordForm redirectTo={redirectTo} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-text-tertiary mt-6">
        با ورود به سایت،{' '}
        <a href="#" className="text-navy hover:underline">قوانین و مقررات</a>
        {' '}را می‌پذیرید.
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-bg-secondary rounded-lg mb-6 mx-auto w-48" />
        <div className="space-y-4">
          <div className="h-12 bg-bg-secondary rounded-xl" />
          <div className="h-12 bg-bg-secondary rounded-xl" />
        </div>
      </div>
    }>
      <LoginCard />
    </Suspense>
  )
}
