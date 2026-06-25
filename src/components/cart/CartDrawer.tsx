'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Sparkles, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartDrawer } from '@/lib/store/cart-drawer'
import { useCartStore } from '@/lib/store/cart'
import { useAuthStore } from '@/lib/store/auth'
import { useLoginModal } from '@/lib/store/login-modal'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
  const { open, closeDrawer } = useCartDrawer()
  const { items, removeItem, updateQuantity, totalPrice, totalCount } = useCartStore()
  const { token } = useAuthStore()
  const openLogin = useLoginModal((s) => s.openLogin)
  const router = useRouter()

  const handleCheckout = () => {
    closeDrawer()
    if (!token) {
      setTimeout(() => {
        openLogin({
          message: 'برای تکمیل سفارش وارد شوید',
          returnUrl: '/checkout',
        })
      }, 200)
      return
    }
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[600] bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-[700] w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <ShoppingCart className="w-4.5 h-4.5 text-navy" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">سبد خرید</h2>
                  <p className="text-[11px] text-gray-400">
                    {totalCount() > 0 ? `${totalCount().toLocaleString('fa-IR')} کالا` : 'خالی'}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={closeDrawer}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4"
                  >
                    <ShoppingCart className="w-9 h-9 text-amber-400" />
                  </motion.div>
                  <p className="font-semibold text-gray-800 mb-1">سبد خرید شما خالی است</p>
                  <p className="text-sm text-gray-400 mb-6">محصولات مورد علاقه‌تان را به سبد اضافه کنید</p>
                  <Button asChild variant="outline" className="rounded-xl border-navy text-navy hover:bg-teal-50" onClick={closeDrawer}>
                    <Link href="/products">مشاهده محصولات</Link>
                  </Button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.product_id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        className="flex gap-3 p-3 rounded-xl bg-amber-50/30 border border-gray-100"
                      >
                        <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 border border-gray-100">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-gray-200" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 truncate">{item.name}</h4>
                          <p className="text-sm font-bold text-navy mt-1">{formatPrice(item.price)}</p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-navy hover:border-navy transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <span className="w-8 text-center text-sm font-bold text-gray-800 tabular-nums">
                                {item.quantity.toLocaleString('fa-IR')}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-navy hover:border-navy transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </motion.button>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => removeItem(item.product_id)}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t border-gray-100 p-5 space-y-3 bg-white"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">جمع سبد:</span>
                  <motion.span
                    key={totalPrice()}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-lg font-extrabold text-navy"
                  >
                    {formatPrice(totalPrice())}
                  </motion.span>
                </div>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 h-11 rounded-xl text-sm font-medium gap-2 border-gray-200 hover:border-navy"
                    onClick={closeDrawer}
                  >
                    <Link href="/cart">
                      مشاهده سبد
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 h-11 rounded-xl text-sm font-bold gap-2 bg-navy hover:bg-navy-dark"
                  >
                    {!token && <LogIn className="w-4 h-4" />}
                    تسویه حساب
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
