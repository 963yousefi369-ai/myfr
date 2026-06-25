import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  getSettings, getProducts, getBanners, getPartners, getDjangoBlogs, djangoImageUrl,
} from '@/lib/api/django'
import HeroSlider from '@/components/home/HeroSlider'
import PartnersMarquee from '@/components/home/PartnersMarquee'
import StatsCounter from '@/components/home/StatsCounter'
import SectionTitle from '@/components/shared/SectionTitle'
import ProductCard from '@/components/product/ProductCard'
import NewsletterForm from '@/components/home/NewsletterForm'
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel'
import BlogCard from '@/components/blog/BlogCard'
import { PulsingDot } from '@/components/tracking'
import {
  Shield, Zap, Headphones, Monitor, Smartphone, Bell, BarChart3,
  Star,
  Play, Apple,
} from 'lucide-react'

export const revalidate = 3600

export const metadata = {
  title: 'آتی فرزام ایرانیان - توسعه‌دهنده ردیاب GPS',
  description: 'خرید ردیاب GPS خودرو و ناوگان با بهترین قیمت و کیفیت از نمایندگی رسمی',
}

async function fetchAllData() {
  const [bannersResult, partnersResult, settingsResult, productsResult, blogsResult] =
    await Promise.allSettled([
      getBanners(),
      getPartners(),
      getSettings(),
      getProducts({ page_size: 8 }),
      getDjangoBlogs(),
    ])

  const products = productsResult.status === 'fulfilled'
    ? (productsResult.value?.results ?? productsResult.value ?? [])
    : []

  const imageMap: Record<string, string> = {}
  for (const p of products) {
    if (p.image) {
      imageMap[String(p.id)] = djangoImageUrl(p.image)
    }
  }

  return {
    banners: bannersResult.status === 'fulfilled' ? bannersResult.value : [],
    partners: partnersResult.status === 'fulfilled' ? partnersResult.value : [],
    settings: settingsResult.status === 'fulfilled' ? settingsResult.value : null,
    products,
    imageMap,
    blogs: blogsResult.status === 'fulfilled' ? (blogsResult.value ?? []) : [],
  }
}

const WHY_US = [
  { key: 'why_us_icon_1', title: 'کیفیت ساخت بالا', desc: 'استفاده از بهترین قطعات و تکنولوژی روز دنیا', fallback: Shield },
  { key: 'why_us_icon_2', title: 'قیمت مناسب و رقابتی', desc: 'قیمت‌های رقابتی بدون کاهش کیفیت', fallback: Zap },
  { key: 'why_us_icon_3', title: 'پشتیبانی در کنار شما', desc: 'پشتیبانی فنی در کنار خرید و نصب ردیاب', fallback: Headphones },
]

const SOFTWARE_FEATURES = [
  { icon: Monitor, label: 'دشبورد وب', desc: 'مدیریت از طریق مرورگر' },
  { icon: Smartphone, label: 'اپلیکیشن', desc: 'دسترسی با iOS و اندروید' },
  { icon: Bell, label: 'اعلان هوشمند', desc: 'هشارهای لحظه‌ای سرقت/تعداد' },
  { icon: BarChart3, label: 'گزارش‌گیری', desc: 'گزارشات جامع و تجزیئی' },
]

export default async function HomePage() {
  const { banners, partners, settings, products, imageMap, blogs } = await fetchAllData()

  const bannersWithImages = banners.map((b: any) => ({
    ...b,
    imageUrl: b.image ?? undefined,
    cta_link: b.cta_link || b.link || undefined,
    cta2_link: b.cta2_link || undefined,
  }))

  const aboutImageUrl = settings?.about_image ? djangoImageUrl(settings.about_image) : null
  const softwareImageUrl = settings?.software_image ? djangoImageUrl(settings.software_image) : null
  const appImageUrl = settings?.app_image ? djangoImageUrl(settings.app_image) : null

  return (
    <div dir="rtl">

      {/* ── 1. HERO SLIDER ───────────────────────────────────── */}
      <HeroSlider banners={bannersWithImages} />

      {/* ── 2. PARTNERS (trust bar) ── */}
      <PartnersMarquee partners={partners} />

      {/* ── 3. FEATURED PRODUCTS ───────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            eyebrow="محصولات"
            title="محصولات ویژه"
            className="mb-10"
            action={
              <Button asChild variant="outline" className="shrink-0 rounded-xl">
                <Link href="/products">مشاهده همه</Link>
              </Button>
            }
          />

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product: any) => (
                <div key={product.id} className="relative">
                  <ProductCard
                    product={product}
                    imageUrl={imageMap[String(product.id)]}
                  />
                  <div className="absolute top-3 left-3 z-30">
                    <PulsingDot
                      color={product.in_stock !== false ? 'green' : 'red'}
                      size={5}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-12">محصولی یافت نشد</p>
          )}
        </div>
      </section>

      {/* ── 5. WHY US ─────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle eyebrow="چرا آتی فرزام" title="چرا ما را انتخاب کنید؟" align="center" className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_US.map((item) => {
              const iconUrl = settings?.[item.key] ? djangoImageUrl(settings[item.key]) : null
              const FallbackIcon = item.fallback
              return (
                <div
                  key={item.key}
                  className="rounded-2xl shadow-md bg-white p-6 md:p-8 text-center hover:shadow-xl transition-shadow"
                >
                  {iconUrl ? (
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <Image
                        src={iconUrl}
                        alt={item.title}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
                      <FallbackIcon className="w-8 h-8 text-[#10b981]" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-[#0f172a] mb-2">{item.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#0f172a] py-12">
        <StatsCounter darkMode />
      </section>

      {/* ── 6. ABOUT ───────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            {aboutImageUrl && (
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={aboutImageUrl}
                  alt="درباره ما"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className={aboutImageUrl ? '' : 'md:col-span-2'}>
              <SectionTitle
                title="درباره آتی فرزام ایرانیان"
                subtitle={settings?.about_us ?? 'شرکت آتی فرزام ایرانیان با بیش از یک دهه تجربه در حوزه ردیابی GPS، راهکارهای جامع مدیریت ناوگان و امنیت خودرو را به سازمان‌ها و افراد ارائه می‌دهد.'}
              />
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Shield, label: 'کیفیت ساخت بالا' },
                  { icon: Zap, label: 'قیمت مناسب و رقابتی' },
                  { icon: Headphones, label: 'پشتیبانی در کنار شما' },
                  { icon: Star, label: 'نظام گردش مالی مطلوب' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-[#f1f5f9]">
                    <div className="w-9 h-9 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <span className="text-gray-600 text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="border-teal text-teal hover:bg-teal hover:text-white rounded-xl">
                <Link href="/about">بیشتر بدانید</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. SOFTWARE ─────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div className="order-2 md:order-1">
              <SectionTitle
                eyebrow="نرم‌افزار"
                title="نرم‌افزار ردیابی پیشرفته"
                subtitle={settings?.software_description ?? 'پلتفرم جامع مدیریت ناوگان با قابلیت ردیابی لحظه‌ای، گزارش‌گیری دقیق و هشدارهای هوشمند'}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {SOFTWARE_FEATURES.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex gap-3 p-4 rounded-xl bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0f172a] text-sm">{label}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button asChild className="bg-teal hover:bg-teal-dark text-white px-6 rounded-xl">
                  <Link href="/software">آشنایی با نرم‌افزار</Link>
                </Button>
                <Button asChild variant="outline" className="border-teal text-teal hover:bg-teal hover:text-white px-6 rounded-xl">
                  <Link href="/contact">درخواست دمو</Link>
                </Button>
              </div>
            </div>

            {softwareImageUrl && (
              <div className="order-1 md:order-2 relative aspect-square rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={softwareImageUrl}
                  alt="نرم‌افزار ردیابی"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 8. APP ─────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            {appImageUrl && (
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={appImageUrl}
                  alt="اپلیکیشن موبایل"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <div className={appImageUrl ? '' : 'md:col-span-2 text-center'}>
              <SectionTitle
                title="اپلیکیشن موبایل"
                subtitle="ردیاب ناوگان در کف دست شما — همیشه و همه‌جا"
                centered={!appImageUrl}
              />
              <div className={`flex gap-4 flex-wrap ${appImageUrl ? '' : 'justify-center'}`}>
                <a
                  href={settings?.google_play_url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3.5 bg-[#0f172a] text-white rounded-xl hover:bg-[#1e3a5f] transition-colors shadow-lg hover:scale-[1.02]"
                >
                  <Play className="w-5 h-5" />
                  <div className="text-right">
                    <p className="text-[10px] text-white/70">دانلود از</p>
                    <p className="font-bold text-sm">Google Play</p>
                  </div>
                </a>
                <a
                  href={settings?.app_store_url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3.5 bg-[#0f172a] text-white rounded-xl hover:bg-[#1e3a5f] transition-colors shadow-lg hover:scale-[1.02]"
                >
                  <Apple className="w-5 h-5" />
                  <div className="text-right">
                    <p className="text-[10px] text-white/70">دانلود از</p>
                    <p className="font-bold text-sm">App Store</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. TESTIMONIALS ─────────────────────────────────────── */}
      <TestimonialsCarousel />

      {/* ── 11. BLOG ─────────────────────────────────────────────── */}
      {blogs.length > 0 && (
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <SectionTitle
              eyebrow="بلاگ"
              title="آخرین مقالات"
              className="mb-10"
              action={
                <Button asChild variant="outline" className="shrink-0 rounded-xl">
                  <Link href="/blog">مشاهده همه</Link>
                </Button>
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.slice(0, 3).map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 12. NEWSLETTER ─────────────────────────────────────── */}
      <NewsletterForm />

    </div>
  )
}
