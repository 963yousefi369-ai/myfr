import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** عدد را به فارسی با کاما تبدیل می‌کند */
export function toFa(n: number | string): string {
  return Number(n).toLocaleString('fa-IR')
}

/** قیمت را به تومان فارسی فرمت می‌کند */
export function formatPrice(price: number): string {
  return `${toFa(price)} تومان`
}

/** slug از عنوان فارسی/انگلیسی می‌سازد */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

/** تاریخ میلادی به شمسی (ساده) */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** نرمال‌سازی شماره موبایل ایرانی → 09XXXXXXXXX */
export function normalizePhone(value: string): string {
  let cleaned = value.replace(/[\s\-\(\)\.]+/g, '').trim()

  // Handle +98 prefix
  if (cleaned.startsWith('+98')) {
    cleaned = '0' + cleaned.slice(3)
  } else if (cleaned.startsWith('98') && cleaned.length === 12) {
    cleaned = '0' + cleaned.slice(2)
  }

  // If starts with 9 (missing leading 0)
  if (cleaned.startsWith('9') && cleaned.length === 10) {
    cleaned = '0' + cleaned
  }

  return cleaned
}

/** اعتبارسنجی شماره موبایل ایرانی */
export function isValidPhone(value: string): boolean {
  return /^09[0-9]{9}$/.test(normalizePhone(value))
}
