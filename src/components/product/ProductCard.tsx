'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, cn } from '@/lib/utils'
import { ShoppingCart, Heart, Star, Phone } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart'
import { useShopStatus } from '@/lib/store/shop-status'
import { toast } from 'sonner'
import { fireAddToCartConfetti } from '@/lib/confetti'

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    price: number
    compare_price?: number
    in_stock?: boolean
    stock?: number
    slug?: string
    rating?: number
    review_count?: number
  }
  imageUrl?: string
  variant?: 'grid' | 'featured'
}

export default function ProductCard({ product, imageUrl, variant = 'grid' }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((s) => s.addItem)
  const { shopEnabled, supportPhone } = useShopStatus()

  const isOutOfStock = product.in_stock === false || product.stock === 0
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compare_price!) * 100)
    : 0
  const rating = product.rating ?? 0
  const reviewCount = product.review_count ?? 0
  const hasRating = rating > 0

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    cardRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    cardRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!shopEnabled) return
    if (isOutOfStock) {
      toast.error('این محصول در حال حاضر موجود نیست')
      return
    }
    addItem({
      product_id: String(product.id),
      name: product.name,
      price: product.price,
      imageUrl: imageUrl || '',
      quantity: 1,
    })
    fireAddToCartConfetti()
    toast.success('به سبد خرید اضافه شد ✓')
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(!wishlisted)
    toast.success(wishlisted ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد')
  }

  return (
    <Link href={`/products/${product.slug ?? product.id}`} className="group block">
      <Card
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className={cn(
          'card-modern bg-white border border-slate-100/80 rounded-2xl overflow-hidden h-full',
          'hover:border-slate-200/80',
          isOutOfStock && 'opacity-80'
        )}
      >
        {/* Image */}
        <div className={cn(
          'relative overflow-hidden',
          variant === 'featured' ? 'h-72' : 'h-52',
          'bg-slate-50'
        )}>
          {!imgLoaded && (
            <div className="absolute inset-0 animate-shimmer bg-slate-100" />
          )}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className={cn(
                'object-contain p-5 transition-opacity duration-300',
                imgLoaded ? 'opacity-100' : 'opacity-0',
                isOutOfStock && 'grayscale-[30%]'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImgLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-slate-200" />
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Badge className="bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full">
                ناموجود
              </Badge>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
            {hasDiscount && (
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {discountPercent}٪ تخفیف
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <motion.button
            onClick={handleWishlist}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 text-slate-300 hover:text-red-400"
          >
            <Heart className={cn('w-4 h-4', wishlisted && 'fill-red-400 text-red-400')} />
          </motion.button>
        </div>

        <CardContent className="p-4 space-y-2">
          {/* Rating */}
          {hasRating && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-3 h-3',
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200 fill-slate-100'
                    )}
                  />
                ))}
              </div>
              {reviewCount > 0 && (
                <span className="text-xs text-slate-400">({reviewCount})</span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-navy transition-colors duration-200">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-1.5">
            <p className="text-navy font-bold text-base">
              {formatPrice(product.price)}
            </p>
            {hasDiscount && (
              <p className="text-slate-400 text-xs line-through mr-1.5">
                {formatPrice(product.compare_price!)}
              </p>
            )}
          </div>

          {/* Add to cart / shop disabled */}
          {!shopEnabled ? (
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = '/contact' }}
              className="w-full text-sm font-medium py-2.5 rounded-xl mt-3 bg-teal-600 text-white flex items-center justify-center gap-1.5 hover:bg-teal-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              تماس با ما
            </a>
          ) : (
          <motion.button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            whileHover={!isOutOfStock ? { scale: 1.01 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
            className={cn(
              'w-full text-sm font-medium py-2.5 rounded-xl transition-all mt-3',
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-navy hover:bg-navy-dark text-white shadow-sm hover:shadow-navy'
            )}
          >
            {isOutOfStock ? 'ناموجود' : 'افزودن به سبد'}
          </motion.button>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
