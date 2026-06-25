'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import SwiperCarousel from '@/components/shared/SwiperCarousel'
import ScrollReveal from '@/components/shared/ScrollReveal'

interface Testimonial {
  id: string
  name: string
  role?: string
  text: string
  rating: number
  avatar?: string
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'محمد رضایی',
    role: 'مدیر ناوگان شرکت حمل‌ونقل پارس',
    text: 'با استفاده از سیستم ردیابی آتی فرزام، مصرف سوخت ناوگان ما ۲۵٪ کاهش پیدا کرد. پشتیبانی عالی و نرم‌افزار بسیار کاربردی.',
    rating: 5,
  },
  {
    id: '2',
    name: 'سارا احمدی',
    role: 'صاحب کسب‌وکار',
    text: 'ردیاب شخصی رو برای پدرم خریدم. خیالمون راحته که همیشه از موقعیتشون خبر داریم. کیفیت دستگاه عالیه.',
    rating: 5,
  },
  {
    id: '3',
    name: 'علی محمدی',
    role: 'مدیرعامل شرکت لجستیک',
    text: 'از سال ۹۸ با آتی فرزام کار می‌کنیم. بیش از ۵۰ دستگاه ردیاب نصب کردیم و کاملاً راضی هستیم. گزارش‌های لحظه‌ای بسیار دقیق هستند.',
    rating: 5,
  },
  {
    id: '4',
    name: 'نیلوفر کریمی',
    role: 'مدیر منابع انسانی',
    text: 'نرم‌افزار مدیریت ناوگانشون خیلی ساده و کاربردیه. آموزش تیممون فقط نیم ساعت طول کشید. پیشنهاد می‌کنم.',
    rating: 4,
  },
]

interface TestimonialsProps {
  testimonials?: Testimonial[]
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsProps) {
  const items = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS

  return (
    <section className="py-20 bg-bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              چه می‌گویند؟
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto">
              بیش از ۵۰۰۰ مشتری به ما اعتماد کرده‌اند
            </p>
          </div>
        </ScrollReveal>

        <SwiperCarousel
          slidesPerView={1}
          spaceBetween={24}
          autoplay={{ delay: 6000 }}
          pagination
          loop
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-14"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-border-default/30 h-full"
            >
              <div className="flex flex-col h-full">
                {/* Quote icon */}
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-navy/40" />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'w-4 h-4',
                        star <= item.rating
                          ? 'text-amber fill-amber'
                          : 'text-border-default fill-border-default/30'
                      )}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-text-primary text-sm leading-relaxed mb-6 flex-1">
                  «{item.text}»
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border-default/30">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy to-teal flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{item.name}</p>
                    {item.role && (
                      <p className="text-text-tertiary text-xs">{item.role}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </SwiperCarousel>
      </div>
    </section>
  )
}
