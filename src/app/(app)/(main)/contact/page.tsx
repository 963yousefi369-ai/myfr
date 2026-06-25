'use client'

import ContactForm from '@/components/contact/ContactForm'
import MapPreview from '@/components/tracking/MapPreview'
import PulsingDot from '@/components/tracking/PulsingDot'
import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'
import { Phone, Mail, MapPin } from 'lucide-react'

const contactCards = [
  {
    icon: Phone,
    title: 'تلفن پشتیبانی',
    value: '۰۲۱-۱۲۳۴۵۶۷۸',
    href: 'tel:02112345678',
    dotColor: 'green' as const,
  },
  {
    icon: Mail,
    title: 'ایمیل',
    value: 'info@atifarzam.ir',
    href: 'mailto:info@atifarzam.ir',
    dotColor: 'blue' as const,
  },
  {
    icon: MapPin,
    title: 'آدرس دفتر',
    value: 'تهران، ایران',
    href: null,
    dotColor: 'red' as const,
  },
]

export default function ContactPage() {
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
          <h1 className="text-4xl md:text-5xl font-black mt-6 mb-4">تماس با ما</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            سوال، پیشنهاد یا نیاز به پشتیبانی دارید؟ ما اینجاییم.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {contactCards.map(({ icon: Icon, title, value, href, dotColor }) => (
              <div
                key={title}
                className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white p-6 border border-gray-100 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#1e3a5f]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                    <PulsingDot color={dotColor} size={6} />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm text-[#1e3a5f] hover:underline break-all font-medium"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-600">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">ارسال پیام</h2>
                <div className="section-underline !mx-0 mt-1" />
              </div>
              <div className="rounded-2xl shadow-md bg-white p-6 border border-gray-100">
                <ContactForm />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">موقعیت ما</h2>
                <div className="section-underline !mx-0 mt-1" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <MapPreview width={600} height={350} className="!w-full !h-full !rounded-2xl !border-0" />
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                تهران، ایران
              </p>
              <div className="text-center">
                <a
                  href="https://maps.google.com/?q=Tehran,Iran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  مشاهده در گوگل مپ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
