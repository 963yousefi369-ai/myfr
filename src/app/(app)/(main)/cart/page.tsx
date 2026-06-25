'use client'

import Link from 'next/link'
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import { useCartStore } from '@/lib/store/cart'
import { SatelliteOrbit } from '@/components/tracking'
import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const { items, totalCount, totalPrice } = useCartStore()
  const count = totalCount()
  const total = totalPrice()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm mx-auto px-4"
        >
          <div className="flex justify-center mb-6">
            <SatelliteOrbit size={60} />
          </div>
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">سبد خرید شما خالی است</h2>
          <p className="text-gray-400 text-sm mb-6">
            محصولات مورد نظرتان را به سبد اضافه کنید
          </p>
          <Button
            asChild
            className="bg-gradient-to-l from-[#1e3a5f] to-[#2a4f7a] text-white rounded-xl px-8 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <Link href="/products">مشاهده محصولات</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 flex items-center gap-3">
          <BreadcrumbTrail dark={false} />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-[#1e3a5f]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">سبد خرید</h1>
            <p className="text-gray-400 text-sm">{count} کالا</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <CartItem item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary total={total} count={count} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
