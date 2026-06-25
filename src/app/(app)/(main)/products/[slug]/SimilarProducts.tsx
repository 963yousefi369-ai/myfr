'use client'

import ProductCard from '@/components/product/ProductCard'
import SatelliteOrbit from '@/components/tracking/SatelliteOrbit'

interface SimilarProductsProps {
  products: any[]
}

export default function SimilarProducts({ products }: SimilarProductsProps) {
  if (!products || products.length === 0) return null

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1e3a5f]">محصولات مشابه</h2>
        <SatelliteOrbit size={36} duration={10} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            imageUrl={product._imageUrl}
          />
        ))}
      </div>
    </div>
  )
}
