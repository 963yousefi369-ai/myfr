import type { Metadata } from 'next'
import { getDjangoBlogs, type DjangoBlogPost } from '@/lib/api/django'
import BlogCard from '@/components/blog/BlogCard'
import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'
import SignalStrength from '@/components/tracking/SignalStrength'
import { Search, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'وبلاگ | آتی فرزام ایرانیان',
  description: 'آخرین مقالات، اخبار و راهنماهای ردیاب GPS از تیم آتی فرزام ایرانیان',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  let posts: DjangoBlogPost[] = []
  let error = false

  try {
    posts = await getDjangoBlogs()
  } catch {
    error = true
  }

  return (
    <div className="bg-white min-h-screen">
      <section
        className="text-white py-20 md:py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #10b981 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#10b981]/10 rounded-full blur-2xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <BreadcrumbTrail />
          <h1 className="text-4xl md:text-5xl font-black mt-6 mb-4">وبلاگ</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            آخرین مقالات، اخبار و راهنماهای تخصصی ردیابی خودرو
          </p>
          <div className="mt-6 flex justify-center">
            <SignalStrength bars={4} activeColor="#ffffff" />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">جدیدترین مطالب</h2>
            <div className="section-underline !mx-0 mt-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {error && (
                <div className="text-center py-24 text-gray-500">
                  <p className="text-lg">خطا در دریافت مقالات. لطفاً مطمئن شوید بک‌اند روشن است.</p>
                </div>
              )}

              {!error && posts.length === 0 && (
                <div className="text-center py-24 text-gray-500">
                  <p className="text-lg">هنوز مقاله‌ای منتشر نشده است.</p>
                </div>
              )}

              {!error && posts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl shadow-md bg-white p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-[#1e3a5f]" />
                  <h3 className="font-bold text-gray-900 text-sm">جستجو</h3>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="جستجو در مقالات..."
                    className="w-full h-10 pr-4 pl-10 rounded-xl border border-gray-200 text-sm focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 outline-none transition-all"
                    readOnly
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="rounded-2xl shadow-md bg-white p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-[#10b981]" />
                  <h3 className="font-bold text-gray-900 text-sm">دسته‌بندی‌ها</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['ردیاب GPS', 'مدیریت ناوگان', 'آموزش', 'اخبار', 'فنی'].map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1.5 text-xs rounded-lg bg-[#f1f5f9] text-gray-600 hover:bg-[#1e3a5f] hover:text-white cursor-pointer transition-colors"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
