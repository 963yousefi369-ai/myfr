'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUserTrailStore } from '@/lib/store/user-trail';

const PATH_LABELS: Record<string, string> = {
  '/': 'خانه',
  '/products': 'محصولات',
  '/software': 'نرم‌افزار',
  '/blog': 'وبلاگ',
  '/about': 'درباره ما',
  '/contact': 'تماس',
  '/cart': 'سبد خرید',
  '/checkout': 'تسویه',
  '/profile': 'پروفایل',
};

export default function UserTrail() {
  const pathname = usePathname();
  const addVisit = useUserTrailStore((s) => s.addVisit);

  useEffect(() => {
    const base = '/' + (pathname.split('/')[1] || '');
    const label = PATH_LABELS[base] || PATH_LABELS[pathname] || pathname;
    addVisit(pathname, label);
  }, [pathname, addVisit]);

  return null;
}
