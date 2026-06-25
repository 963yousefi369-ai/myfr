'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Search,
  PackageX,
  SlidersHorizontal,
  Tag,
  DollarSign,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { ProductSkeletonGrid } from '@/components/product/ProductSkeleton'
import AfiPagination from '@/components/shared/Pagination'
import { BreadcrumbTrail } from '@/components/trail'
import EmptyState from '@/components/shared/EmptyState'
import { motion, AnimatePresence } from 'framer-motion'
import { StaggerContainer, StaggerItem } from '@/components/shared/ScrollReveal'
import { cn } from '@/lib/utils'

interface Category {
  id: number | string
  name: string
}

interface Product {
  id: string | number
  name: string
  price: number
  compare_price?: number
  in_stock?: boolean
  stock?: number
  slug?: string
}

interface ProductsClientProps {
  initialProducts: Product[]
  initialTotal: number
  initialTotalPages: number
  categories: Category[]
  imageMap: Record<string, string>
  initialPage: number
  initialCategory: string
  initialSearch: string
}

const PAGE_SIZE = 12
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export default function ProductsClient({
  initialProducts,
  initialTotal,
  initialTotalPages,
  categories,
  imageMap: initialImageMap,
  initialPage,
  initialCategory,
  initialSearch,
}: ProductsClientProps) {
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [loading, setLoading] = useState(false)
  const [imageMap, setImageMap] = useState<Record<string, string>>(initialImageMap)
  const [resultCount, setResultCount] = useState(initialTotal)

  const [search, setSearch] = useState(initialSearch)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [page, setPage] = useState(initialPage)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(t)
  }, [search])

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const controller = new AbortController()

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('page_size', String(PAGE_SIZE))
        if (activeCategory) params.set('category_id', activeCategory)
        if (debouncedSearch) params.set('search', debouncedSearch)
        if (priceMin) params.set('price_min', priceMin)
        if (priceMax) params.set('price_max', priceMax)

        const res = await fetch(`${API_URL}/api/products?${params}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const rawList: any[] = Array.isArray(data) ? data : (data.results ?? [])
        const count: number = data.count ?? rawList.length
        const list: Product[] = rawList.map((p: any) => ({
          ...p,
          price: p.effective_price ?? p.discount_price ?? p.price,
          compare_price: p.is_on_sale ? p.price : undefined,
          in_stock: p.stock > 0,
        }))
        setProducts(list)
        setResultCount(count)
        setTotalPages(Math.max(1, Math.ceil(count / PAGE_SIZE)))

        const ids = list.map((p) => String(p.id)).join(',')
        if (ids) {
          const imgRes = await fetch(`/api/product-images?ids=${ids}`, {
            signal: controller.signal,
          })
          if (imgRes.ok) {
            const newImageMap: Record<string, string> = await imgRes.json()
            setImageMap((prev) => ({ ...prev, ...newImageMap }))
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error('Products fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    return () => controller.abort()
  }, [page, activeCategory, debouncedSearch, priceMin, priceMax])

  useEffect(() => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    if (activeCategory) params.set('category', activeCategory)
    if (debouncedSearch) params.set('search', debouncedSearch)
    const qs = params.toString()
    router.replace(`/products${qs ? '?' + qs : ''}`, { scroll: false })
  }, [page, activeCategory, debouncedSearch, router])

  const handleCategory = (catId: string) => {
    setActiveCategory(catId)
    setPage(1)
  }

  const handlePageChange = (pg: number) => {
    setPage(pg)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearch('')
    setActiveCategory('')
    setPriceMin('')
    setPriceMax('')
    setPage(1)
  }

  const hasActiveFilters = activeCategory || search || priceMin || priceMax

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <BreadcrumbTrail dark={false} />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">محصولات</h1>
        <div className="section-underline !mx-0 mt-2" />
        <p className="text-gray-500 text-sm mt-2">
          ردیاب GPS حرفه‌ای برای انواع کاربردها
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24 space-y-6">
            {/* Search */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-[#1e3a5f]" />
                <span className="text-sm font-semibold text-[#1e3a5f]">جستجو</span>
              </div>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder="نام محصول..."
                  className="pr-9 bg-gray-50 border-gray-200 focus-visible:ring-[#1e3a5f] rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[#1e3a5f]" />
                  <span className="text-sm font-semibold text-[#1e3a5f]">دسته‌بندی</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategory('')}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-medium transition-all border',
                      activeCategory === ''
                        ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    )}
                  >
                    همه
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategory(String(cat.id))}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-xs font-medium transition-all border',
                        activeCategory === String(cat.id)
                          ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-[#1e3a5f]" />
                <span className="text-sm font-semibold text-[#1e3a5f]">محدوده قیمت</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={priceMin}
                  onChange={(e) => { setPriceMin(e.target.value); setPage(1) }}
                  placeholder="حداقل"
                  className="bg-gray-50 border-gray-200 focus-visible:ring-[#1e3a5f] rounded-xl h-9 text-sm"
                />
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={priceMax}
                  onChange={(e) => { setPriceMax(e.target.value); setPage(1) }}
                  placeholder="حداکثر"
                  className="bg-gray-50 border-gray-200 focus-visible:ring-[#1e3a5f] rounded-xl h-9 text-sm"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                حذف فیلترها
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-[#1e3a5f] w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                فیلترها
              </div>
              {sidebarOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 mt-3 space-y-5">
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <Input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        placeholder="جستجوی محصول..."
                        className="pr-9 bg-gray-50 border-gray-200 focus-visible:ring-[#1e3a5f] rounded-xl h-10 text-sm"
                      />
                    </div>

                    {/* Mobile Categories */}
                    {categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleCategory('')}
                          className={cn(
                            'rounded-full px-3 py-1.5 text-xs font-medium transition-all border',
                            activeCategory === ''
                              ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md'
                              : 'bg-gray-50 text-gray-600 border-gray-200'
                          )}
                        >
                          همه
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategory(String(cat.id))}
                            className={cn(
                              'rounded-full px-3 py-1.5 text-xs font-medium transition-all border',
                              activeCategory === String(cat.id)
                                ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md'
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                            )}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Mobile Price Range */}
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={priceMin}
                        onChange={(e) => { setPriceMin(e.target.value); setPage(1) }}
                        placeholder="حداقل قیمت"
                        className="bg-gray-50 border-gray-200 focus-visible:ring-[#1e3a5f] rounded-xl h-9 text-sm"
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={priceMax}
                        onChange={(e) => { setPriceMax(e.target.value); setPage(1) }}
                        placeholder="حداکثر قیمت"
                        className="bg-gray-50 border-gray-200 focus-visible:ring-[#1e3a5f] rounded-xl h-9 text-sm"
                      />
                    </div>

                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        حذف فیلترها
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-[#1e3a5f]">{resultCount}</span> محصول
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <ProductSkeletonGrid count={PAGE_SIZE} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<PackageX className="w-10 h-10 text-gray-400" />}
              title="محصولی یافت نشد"
              description="فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید"
            />
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${page}-${activeCategory}-${debouncedSearch}-${priceMin}-${priceMax}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <StaggerContainer
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                    staggerDelay={0.05}
                  >
                    {products.map((product) => (
                      <StaggerItem key={product.id}>
                        <ProductCard
                          product={product}
                          imageUrl={imageMap[String(product.id)]}
                        />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </motion.div>
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <AfiPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
