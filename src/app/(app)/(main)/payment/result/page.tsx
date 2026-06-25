'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import AfiBreadcrumb from '@/components/shared/Breadcrumb'
import PaymentReceipt from '@/components/checkout/PaymentReceipt'
import { useAuthStore } from '@/lib/store/auth'

function getTokenFromStorage(): string | null {
  try {
    const raw = localStorage.getItem('afi_auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

function PaymentResultInner() {
  const searchParams = useSearchParams()
  const { token } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !token) {
      const t = setTimeout(() => setHydrated(true), 500)
      return () => clearTimeout(t)
    }
    if (token) setHydrated(true)
  }, [mounted, token])

  const status = searchParams.get('status') ?? 'failed'
  const orderId = searchParams.get('order_id')
  const effectiveToken = token || getTokenFromStorage()

  if (!mounted || !hydrated) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center" dir="rtl">
        <p className="text-text-secondary">در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <AfiBreadcrumb
            items={[
              { label: 'خانه', href: '/' },
              { label: 'نتیجه پرداخت' },
            ]}
          />
        </div>
        <PaymentReceipt status={status} orderId={orderId} token={effectiveToken} />
      </div>
    </div>
  )
}

export default function PaymentResultPage() {
  return (
    <Suspense>
      <PaymentResultInner />
    </Suspense>
  )
}