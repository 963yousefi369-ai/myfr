'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, MapPin, User, LogOut, ShoppingCart, ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth'
import { useCartStore } from '@/lib/store/cart'
import { useLoginModal } from '@/lib/store/login-modal'
import { useCartDrawer } from '@/lib/store/cart-drawer'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

const NAV_LINKS = [
  { href: '/',          label: 'خانه' },
  { href: '/products',  label: 'محصولات' },
  { href: '/software',  label: 'نرم‌افزار' },
  { href: '/blog',      label: 'وبلاگ' },
  { href: '/about',     label: 'درباره ما' },
  { href: '/contact',   label: 'تماس با ما' },
]

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const { user, token, logout } = useAuthStore()
  const totalCount = useCartStore((s) => s.totalCount())
  const openLogin = useLoginModal((s) => s.openLogin)
  const openCartDrawer = useCartDrawer((s) => s.openDrawer)

  useEffect(() => {
    onClose()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleCartClick = () => {
    onClose()
    setTimeout(openCartDrawer, 200)
  }

  const handleLoginClick = () => {
    onClose()
    setTimeout(() => openLogin(), 200)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[500] w-[300px] bg-white shadow-2xl transition-transform duration-400 ease-out lg:hidden flex flex-col',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-default/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-deeper to-navy flex items-center justify-center shadow-md">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-text-primary text-sm block leading-tight">آتی فرزام ایرانیان</span>
              <span className="text-[10px] text-text-tertiary leading-tight">سیستم‌های ردیابی GPS</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-bg-secondary transition-all duration-200 text-text-secondary active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_LINKS.map((link, i) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-navy/10 text-navy font-semibold shadow-sm'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary active:scale-[0.98]'
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span>{link.label}</span>
                <ChevronLeft className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-navy' : 'text-text-tertiary'
                )} />
              </Link>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-border-default/50 space-y-2">
          <button
            onClick={handleCartClick}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-bg-secondary/70 hover:bg-bg-secondary transition-all duration-200 text-text-primary text-sm font-medium active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4.5 h-4.5 text-text-secondary" />
              سبد خرید
            </div>
            {totalCount > 0 && (
              <span className="min-w-[22px] h-5.5 bg-gradient-to-l from-navy to-navy-dark text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1.5 shadow-sm">
                {totalCount.toLocaleString('fa-IR')}
              </span>
            )}
          </button>

          {token && user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-bg-secondary/70 hover:bg-bg-secondary transition-all duration-200 text-text-primary text-sm font-medium active:scale-[0.98]"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-navy to-teal flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                {user.full_name || user.phone_number || 'پروفایل'}
              </Link>
              <button
                onClick={() => { logout(); onClose() }}
                className="w-full flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-error hover:bg-red-50 transition-all duration-200 text-sm font-medium active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-gradient-to-l from-navy to-navy-dark text-white text-sm font-medium hover:shadow-navy transition-all duration-300 active:scale-[0.98]"
            >
              <User className="w-4 h-4" />
              ورود به حساب
            </button>
          )}
        </div>
      </div>
    </>
  )
}
