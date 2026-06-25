'use client'
import { ArrowLeft, Shield, Truck, Sparkles, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/auth'
import { useLoginModal } from '@/lib/store/login-modal'
import { useRouter } from 'next/navigation'

interface CartSummaryProps {
  total: number
  count: number
}

export default function CartSummary({ total, count }: CartSummaryProps) {
  const { token } = useAuthStore()
  const openLogin = useLoginModal((s) => s.openLogin)
  const router = useRouter()

  const handleCheckout = () => {
    if (!token) {
      openLogin({
        message: 'برای تکمیل سفارش وارد شوید',
        returnUrl: '/checkout',
      })
      return
    }
    router.push('/checkout')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="sticky top-24 border-0 shadow-lg overflow-hidden rounded-2xl">
        <div className="bg-navy p-4">
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            خلاصه سبد
          </h2>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>تعداد اقلام</span>
              <span className="font-medium text-gray-800">{count} عدد</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>جمع محصولات</span>
              <span className="font-medium text-gray-800">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>هزینه ارسال</span>
              <span className="text-amber-600 text-xs font-semibold bg-amber-50 px-2 py-0.5 rounded-full">پس از انتخاب آدرس</span>
            </div>
          </div>

          <Separator className="bg-gray-100" />

          <div className="flex justify-between font-bold text-base">
            <span className="text-gray-800">جمع کل</span>
            <motion.span
              key={total}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-teal-600 text-xl font-extrabold"
            >
              {formatPrice(total)}
            </motion.span>
          </div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleCheckout}
              className="w-full bg-navy hover:bg-navy-dark text-white gap-2 rounded-xl h-12 text-base font-bold"
            >
              {!token && <LogIn className="w-4 h-4" />}
              ادامه و تکمیل سفارش
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </motion.div>

          <Button
            onClick={() => router.push('/products')}
            variant="outline"
            className="w-full text-gray-500 rounded-xl h-11 border-gray-200 hover:border-teal-200 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200"
          >
            ادامه خرید
          </Button>

          {/* Trust badges */}
          <div className="pt-3 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <Shield className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span>ضمانت اصالت کالا</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <span>ارسال سریع به سراسر کشور</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
