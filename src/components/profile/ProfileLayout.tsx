'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, ShoppingBag, MapPin, Lock, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store/auth'
import PulsingDot from '@/components/tracking/PulsingDot'

const NAV_ITEMS = [
  { href: '/profile',                 label: 'پروفایل',      icon: User       },
  { href: '/profile/orders',          label: 'سفارش‌ها',     icon: ShoppingBag },
  { href: '/profile/addresses',       label: 'آدرس‌ها',      icon: MapPin     },
  { href: '/profile/change-password', label: 'تغییر رمز',    icon: Lock       },
]

function initials(name?: string | null): string {
  if (!name) return 'کا'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0] ?? 'کا'
  return (parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">

          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden sticky top-24">

              <div className="p-5 bg-gradient-to-br from-[#1e3a5f]/5 to-[#10b981]/5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#1e3a5f]/80 text-white shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-[#1e3a5f] to-[#1e3a5f]/80 text-white font-bold text-sm">
                      {initials(user?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">
                      {user?.full_name || 'کاربر'}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5 dir-ltr text-right">
                      {user?.phone_number}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const active = href === '/profile'
                    ? pathname === '/profile'
                    : pathname.startsWith(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-[#1e3a5f]/5 text-[#1e3a5f] shadow-sm'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 active:scale-[0.98]'
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{label}</span>
                      {active && <PulsingDot color="green" size={5} />}
                    </Link>
                  )
                })}
              </nav>

              <div className="p-3 border-t border-gray-100">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm font-medium rounded-xl transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      خروج از حساب
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl" className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>خروج از حساب</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse gap-2">
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                      >
                        بله، خارج شو
                      </AlertDialogAction>
                      <AlertDialogCancel className="rounded-xl">انصراف</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
