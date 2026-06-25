'use client'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import QuantitySelector from '@/components/product/QuantitySelector'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'
import { motion } from 'framer-motion'
import type { CartItem as CartItemType } from '@/lib/store/cart'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <Card className="flex gap-4 p-4 items-start border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 group rounded-xl">
      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-amber-50/50 shrink-0 border border-gray-100">
        <Image
          src={item.imageUrl || '/placeholder-product.svg'}
          alt={item.name}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          sizes="96px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm leading-relaxed line-clamp-2 mb-2 group-hover:text-navy transition-colors">
          {item.name}
        </h3>
        <p className="text-gray-400 text-xs mb-3">
          قیمت واحد: {formatPrice(item.price)}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => updateQuantity(item.product_id, qty)}
          />
          <p className="font-extrabold text-navy text-base">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-red-500 hover:bg-red-50 shrink-0 rounded-xl transition-all duration-200"
          onClick={() => removeItem(item.product_id)}
          aria-label="حذف از سبد"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </motion.div>
    </Card>
  )
}
