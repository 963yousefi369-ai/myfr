import type { Metadata } from 'next'
import { getProducts, getCategories, djangoImageUrl } from '@/lib/api/django'
import ProductsClient from './ProductsClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>
}): Promise<Metadata> {
  const sp = await searchParams
  const search = sp.search ?? ''
  const category = sp.category ?? ''

  let title = 'محصولات | آتی فرزام ایرانیان'
  let description = 'ردیاب GPS حرفه‌ای برای خودرو، موتورسیکلت و ناوگان'

  if (search) {
    title = `جستجو: ${search} | محصولات آتی فرزام`
    description = `نتایج جستجوی "${search}" در محصولات ردیاب GPS آتی فرزام ایرانیان`
  } else if (category) {
    try {
      const categories = await getCategories()
      const cat = categories.find((c: any) => String(c.id) === category)
      if (cat) {
        title = `${cat.name} | محصولات آتی فرزام ایرانیان`
        description = `خرید ${cat.name} با ضمانت اصالت و پشتیبانی ۲۴ ساعته`
      }
    } catch {}
  }

  return {
    title,
    description,
    openGraph: { title, description, locale: 'fa_IR', type: 'website' },
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>
}) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page ?? 1))
  const category = sp.category ?? ''
  const search = sp.search ?? ''

  const params: Record<string, string | number> = { page, page_size: 12 }
  if (category) params.category_id = category
  if (search) params.search = search

  let products: any[] = []
  let totalCount = 0
  let categories: any[] = []

  try {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(params),
      getCategories(),
    ])
    const rawList = Array.isArray(productsData) ? productsData : (productsData.results ?? [])
    totalCount = productsData.count ?? rawList.length
    products = rawList.map((p: any) => ({
      ...p,
      price: p.effective_price ?? p.discount_price ?? p.price,
      compare_price: p.is_on_sale ? p.price : undefined,
      in_stock: p.stock > 0,
    }))
    categories = categoriesData ?? []
  } catch (err) {
    console.error('Products fetch error:', err)
  }

  const imageMap: Record<string, string> = {}
  for (const p of products) {
    if (p.image) {
      imageMap[String(p.id)] = djangoImageUrl(p.image)
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / 12))

  return (
    <ProductsClient
      initialProducts={products}
      initialTotal={totalCount}
      initialTotalPages={totalPages}
      categories={categories}
      imageMap={imageMap}
      initialPage={page}
      initialCategory={category}
      initialSearch={search}
    />
  )
}
