import type { Metadata } from 'next'
import '@/styles/globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'آتی فرزام ایرانیان — سیستم‌های ردیابی GPS',
  description: 'فروش و پشتیبانی ردیاب‌های GPS برای خودرو، ناوگان و اشخاص',
  icons: {
    icon: '/icon',
    apple: '/icon',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
