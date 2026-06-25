'use client'
import Link from 'next/link'
import { Phone, Mail, MapPin as MapPinIcon, Instagram, Send, Shield, Truck, Headphones, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import { RadarPing } from '@/components/tracking'
import FooterTrail from '@/components/trail/FooterTrail'

const QUICK_LINKS = [
  { href: '/products', label: 'محصولات' },
  { href: '/software', label: 'نرم‌افزار ردیابی' },
  { href: '/blog',     label: 'وبلاگ' },
  { href: '/about',    label: 'درباره ما' },
  { href: '/contact',  label: 'تماس با ما' },
]

const SUPPORT_LINKS = [
  { href: '/faq',       label: 'سوالات متداول' },
  { href: '/privacy',   label: 'حریم خصوصی' },
  { href: '/terms',     label: 'قوانین استفاده' },
  { href: '/warranty',  label: 'گارانتی و خدمات' },
]

const TRUST_ITEMS = [
  { icon: Truck, label: 'ارسال سریع' },
  { icon: Shield, label: 'ضمانت اصالت' },
  { icon: Headphones, label: 'پشتیبانی 24/7' },
  { icon: CreditCard, label: 'پرداخت امن' },
]


export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Trust bar */}
      <div className="bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 justify-center md:justify-start group"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy/5 to-teal/5 flex items-center justify-center shrink-0 group-hover:from-navy/10 group-hover:to-teal/10 transition-all duration-300">
                  <item.icon className="w-5 h-5 text-navy group-hover:text-teal transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-text-secondary group-hover:text-navy transition-colors duration-300">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative bg-gradient-to-b from-navy-deeper to-gray-950 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-navy/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal/10 rounded-full blur-3xl" />
          {/* Radar in background */}
          <div className="absolute top-10 left-10 opacity-10">
            <RadarPing size={120} color="#10b981" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <MapPinIcon className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight">آتی فرزام ایرانیان</p>
                  <p className="text-xs text-white/50 leading-tight mt-0.5">ATI Farzam Iranian</p>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-5">
                ارائه‌دهنده راهکارهای هوشمند ردیابی GPS برای خودروهای شخصی، ناوگان تجاری و اشخاص. با ما موقعیت همه چیز را بدانید.
              </p>
              <div className="flex gap-2.5">
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 border border-white/10 transition-all duration-300 flex items-center justify-center hover:shadow-lg"
                  aria-label="اینستاگرام"
                >
                  <Instagram className="w-4 h-4" />
                </motion.a>
                <motion.a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-blue-400 hover:to-blue-600 border border-white/10 transition-all duration-300 flex items-center justify-center hover:shadow-lg"
                  aria-label="تلگرام"
                >
                  <Send className="w-4 h-4" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-5 text-white/90 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-teal to-navy" />
                دسترسی سریع
              </h3>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white hover:pr-1 transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-teal/60 shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold mb-5 text-white/90 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-amber to-navy" />
                خدمات مشتریان
              </h3>
              <ul className="space-y-2.5">
                {SUPPORT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white hover:pr-1 transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-amber/60 shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold mb-5 text-white/90 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-teal to-navy" />
                اطلاعات تماس
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-white/60 group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-teal/20 transition-colors">
                    <Phone className="w-4 h-4 text-teal" />
                  </div>
                  <span className="group-hover:text-white transition-colors" dir="ltr">021-12345678</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/60 group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-teal/20 transition-colors">
                    <Mail className="w-4 h-4 text-teal" />
                  </div>
                  <span className="group-hover:text-white transition-colors">info@atifarzam.ir</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/60 group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-teal/20 transition-colors">
                    <MapPinIcon className="w-4 h-4 text-teal" />
                  </div>
                  <span className="group-hover:text-white transition-colors leading-relaxed">تهران، خیابان ولیعصر، پلاک 123</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Trail */}
          <div className="mt-8 pt-4 border-t border-white/5">
            <FooterTrail />
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              1403 آتی فرزام ایرانیان — تمامی حقوق محفوظ است
            </p>
            <div className="flex gap-5">
              <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                حریم خصوصی
              </Link>
              <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                قوانین استفاده
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
