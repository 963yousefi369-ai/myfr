'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, CheckCircle, Bell, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/store/cart'
import { useShopStatus } from '@/lib/store/shop-status'
import { fireAddToCartConfetti } from '@/lib/confetti'

interface AddToCartButtonProps {
  product: {
    id: string | number
    name: string
    price: number
  }
  quantity: number
  imageUrl?: string
  inStock?: boolean
}

export default function AddToCartButton({ product, quantity, imageUrl, inStock = true }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { shopEnabled, supportPhone } = useShopStatus()
  const [added, setAdded] = useState(false)

  if (!shopEnabled) {
    return (
      <Button asChild className="w-full h-14 text-base rounded-xl bg-teal-600 hover:bg-teal-700 hover:shadow-lg gap-2.5 transition-all duration-200 font-bold" size="lg">
        <Link href="/contact">
          <Phone className="w-5 h-5" />
          تماس با ما
        </Link>
      </Button>
    )
  }

  const handleAdd = () => {
    if (!inStock) {
      toast.error('این محصول در حال حاضر موجود نیست')
      return
    }

    addItem({
      product_id: String(product.id),
      name: product.name,
      price: product.price,
      quantity,
      imageUrl,
    })

    setAdded(true)
    fireAddToCartConfetti()
    toast.success(`«${product.name}» به سبد خرید اضافه شد ✓`, {
      description: `تعداد: ${quantity} عدد`,
      duration: 3000,
    })
    setTimeout(() => setAdded(false), 2500)
  }

  if (!inStock) {
    return (
      <Button disabled className="w-full h-14 text-base rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" size="lg">
        <Bell className="w-5 h-5 ml-2" />
        ناموجود
      </Button>
    )
  }

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleAdd}
        className="w-full h-14 text-base rounded-xl bg-navy hover:bg-navy-dark hover:shadow-lg gap-2.5 transition-all duration-200 font-bold relative overflow-hidden"
        size="lg"
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 relative z-10"
            >
              <CheckCircle className="w-5 h-5" />
              افزوده شد ✓
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 relative z-10"
            >
              <ShoppingCart className="w-5 h-5" />
              افزودن به سبد خرید
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}
