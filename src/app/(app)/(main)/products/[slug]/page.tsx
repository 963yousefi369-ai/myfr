import { notFound } from 'next/navigation'
import { getProduct, getProducts, djangoImageUrl } from '@/lib/api/django'
import type { Metadata } from 'next'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 86400

export async function generateStaticParams() {
  try {
    const data = await getProducts({ page_size: 100 })
    const products = Array.isArray(data) ? data : (data.results ?? [])
    return products.map((product: any) => ({ slug: product.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await getProduct(slug)
    return {
      title: `${product.name} | آتی فرزام ایرانیان`,
      description: product.description?.slice(0, 155) ?? product.meta_description ?? '',
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 155) ?? '',
        locale: 'fa_IR',
        type: 'website',
      },
    }
  } catch {
    return { title: 'محصول | آتی فرزام ایرانیان' }
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let product: any
  try {
    product = await getProduct(slug)
  } catch {
    notFound()
  }

  let images: string[] = []
  if (product.image) {
    images.push(djangoImageUrl(product.image))
  }
  if (product.images && Array.isArray(product.images)) {
    const extra = product.images
      .map((img: any) => djangoImageUrl(typeof img === 'string' ? img : img.image))
      .filter((u: string) => u && !images.includes(u))
    images = [...images, ...extra]
  }

  const isOutOfStock = product.in_stock === false || product.stock === 0

  let similarProducts: any[] = []
  try {
    const similarParams: Record<string, string | number> = { page_size: 4 }
    if (product.category_id) similarParams.category_id = product.category_id
    const similarData = await getProducts(similarParams)
    const similarList = Array.isArray(similarData) ? similarData : (similarData.results ?? [])
    similarProducts = similarList.filter((p: any) => p.slug !== slug).slice(0, 4)
    for (const p of similarProducts) {
      p._imageUrl = p.image ? djangoImageUrl(p.image) : ''
    }
  } catch {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description?.slice(0, 500) ?? '',
    image: images.length > 0 ? images[0] : undefined,
    sku: product.sku ?? undefined,
    brand: { '@type': 'Brand', name: 'آتی فرزام ایرانیان' },
    offers: {
      '@type': 'Offer',
      price: product.effective_price ?? product.price,
      priceCurrency: 'IRR',
      availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    },
    aggregateRating: product.review_count ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating ?? 4.5,
      reviewCount: product.review_count,
    } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        images={images}
        similarProducts={similarProducts}
      />
    </>
  )
}
