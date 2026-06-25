'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// این صفحه فقط یک bridge است:
// بک‌اند به /payment-result ریدایرکت می‌کند
// ما به /payment/result می‌فرستیم
function RedirectInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const params = searchParams.toString()
    router.replace(`/payment/result${params ? `?${params}` : ''}`)
  }, [])

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center" dir="rtl">
      <p className="text-text-secondary">در حال انتقال...</p>
    </div>
  )
}

export default function PaymentResultRedirect() {
  return (
    <Suspense>
      <RedirectInner />
    </Suspense>
  )
}
