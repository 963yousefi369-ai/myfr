import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSettings, djangoImageUrl } from '@/lib/api/django'
import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'
import SectionTitle from '@/components/shared/SectionTitle'
import ScrollReveal from '@/components/shared/ScrollReveal'
import { Button } from '@/components/ui/button'
import {
  Monitor, Smartphone, Bell, BarChart3, Shield, Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'نرم‌افزار مدیریت ردیابی | آتی فرزام ایرانیان',
  description: 'سامانه آنلاین مدیریت ناوگان و ردیابی خودرو — مشاهده موقعیت لحظه‌ای، گزارش‌گیری و هشدار',
  openGraph: {
    title: 'نرم‌افزار مدیریت ردیابی | آتی فرزام ایرانیان',
    description: 'سامانه آنلاین مدیریت ناوگان و ردیابی خودرو',
    locale: 'fa_IR',
    type: 'website',
  },
}

export const revalidate = 604800

const FEATURES = [
  {
    icon: BarChart3,
    title: 'گزارش‌گیری پیشرفته',
    desc: 'تحلیل مسیر، مصرف سوخت، کیلومتر کارکرد و گزارش‌های جامع ناوگان.',
  },
  {
    icon: Bell,
    title: 'هشدارهای فوری',
    desc: 'دریافت هشدار سرعت، خروج از محدوده، خاموش و روشن شدن خودرو.',
  },
  {
    icon: Shield,
    title: 'امنیت داده‌ها',
    desc: 'رمزگذاری پیشرفته و محافظت کامل از اطلاعات ناوگان شما.',
  },
  {
    icon: Zap,
    title: 'عملکرد سریع',
    desc: 'به‌روزرسانی لحظه‌ای موقعیت و پردازش سریع داده‌ها.',
  },
]

export default async function SoftwarePage() {
  let settings: any = null
  try {
    settings = await getSettings()
  } catch {}

  const loginUrl: string = settings?.software_login_url ?? '#'
  const softwareImage = settings?.software_image ? djangoImageUrl(settings.software_image) : null
  const softwareDesc: string = settings?.software_description ?? ''

  return (
    <div className="bg-white min-h-screen">
      <section
        className="text-white py-20 md:py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #10b981 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#f59e0b]/10 rounded-full blur-2xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <BreadcrumbTrail />
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mt-6 mb-6">
            <Zap className="w-4 h-4" />
            <span>سامانه مدیریت هوشمند ناوگان</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            نرم‌افزار ردیابی
            <br />
            <span className="text-[#f59e0b]">آتی فرزام ایرانیان</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            مدیریت هوشمند ناوگان خودرویی با امکانات پیشرفته ردیابی، گزارش‌گیری و هشدار آنی
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-l from-[#f59e0b] to-[#d97706] hover:shadow-lg hover:scale-[1.02] text-white font-bold px-8 rounded-xl shadow-lg transition-all duration-200"
            >
              <Link href={loginUrl} target="_blank" rel="noopener noreferrer">
                <Monitor className="w-5 h-5 ml-2" />
                ورود به سامانه
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white/10 rounded-xl"
            >
              <Link href="/contact">
                <Smartphone className="w-5 h-5 ml-2" />
                درخواست دمو
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="امکانات سامانه" subtitle="تمام ابزارهای لازم برای مدیریت حرفه‌ای ناوگان" centered />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white p-6 border border-gray-100 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#1e3a5f]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {softwareImage && (
        <section className="py-20 md:py-28 bg-[#f1f5f9]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <SectionTitle title="نمایی از سامانه" centered />
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={softwareImage}
                  alt="نرم‌افزار مدیریت ردیابی آتی فرزام"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                />
              </div>
            </div>
            {softwareDesc && (
              <p className="text-center text-gray-600 mt-8 max-w-2xl mx-auto leading-8">
                {softwareDesc}
              </p>
            )}
          </div>
        </section>
      )}

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <SectionTitle title="چرا سامانه ما؟" centered />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              'راه‌اندازی سریع در کمتر از ۵ دقیقه',
              'امنیت و رمزگذاری داده‌های شما',
              'پشتیبانی ۲۴ ساعته',
              'بدون نیاز به نصب نرم‌افزار جداگانه',
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-2xl bg-[#f1f5f9] border border-gray-100"
              >
                <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-[#10b981]" />
                </div>
                <span className="text-sm text-gray-800 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 md:py-28 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #10b981 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-black mb-4">آماده شروع هستید؟</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            همین حالا وارد سامانه شوید و ناوگان خود را هوشمند مدیریت کنید.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-l from-[#f59e0b] to-[#d97706] hover:shadow-lg hover:scale-[1.02] text-white font-bold px-10 rounded-xl shadow-lg transition-all duration-200"
          >
            <Link href={loginUrl} target="_blank" rel="noopener noreferrer">
              <Monitor className="w-5 h-5 ml-2" />
              ورود به سامانه
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
