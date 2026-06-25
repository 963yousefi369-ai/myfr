const isServer = typeof window === 'undefined'

function getBaseUrl(): string {
  if (!isServer) return ''
  return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
}

const API_ORIGIN = getBaseUrl()

const INTERNAL_RE = /http:\/\/(localhost|127\.0\.0\.1|backend)(:\d+)?/g

export function djangoImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('/')) return url
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://farzam.runflare.run'
  if (url.startsWith(backendUrl)) return url.replace(backendUrl, '')
  return url.replace(INTERNAL_RE, '')
}

export function publicImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('/')) return url
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://farzam.runflare.run'
  if (url.startsWith(backendUrl)) return url.replace(backendUrl, '')
  return url.replace(INTERNAL_RE, '')
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_ORIGIN}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

// ─── Products ────────────────────────────────────────────────
export const getProducts = (params?: Record<string, string | number>) =>
  request<any>(`/api/products?${new URLSearchParams(params as any)}`)

export const getProduct = (id: string | number) =>
  request<any>(`/api/products/${id}`)

export const getCategories = () =>
  request<any[]>('/api/categories')

// ─── Settings ───────────────────────────────────────────────
export const getSettings = () =>
  request<any>('/api/settings')

// ─── Contact ────────────────────────────────────────────────
export const submitContact = (data: { name: string; phone: string; message: string }) =>
  request<{ detail: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// ─── Auth ───────────────────────────────────────────────────
// بک‌اند فیلد phone_number می‌خواد (نه phone)
export const sendOtp = (phone: string) =>
  request<{ detail: string; otp_code?: string; test_mode?: boolean }>('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone }),
  })

// response: { access: string, refresh: string }
export const verifyOtp = (phone: string, code: string) =>
  request<{ access: string; refresh: string }>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone, code }),
  })

// response: { access: string, refresh: string }
export const login = (phone: string, password: string) =>
  request<{ access: string; refresh: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone, password }),
  })

// profile: { id, phone_number, full_name, email, national_id, date_joined }
export const getProfile = (token: string) =>
  request<any>('/api/auth/profile', { headers: authHeaders(token) })

export const updateProfile = (token: string, data: any) =>
  request<any>('/api/auth/profile', {
    method: 'PATCH', body: JSON.stringify(data), headers: authHeaders(token),
  })

export const changePassword = (token: string, data: any) =>
  request<any>('/api/auth/change-password', {
    method: 'POST', body: JSON.stringify(data), headers: authHeaders(token),
  })

export const forgotPassword = (phone: string) =>
  request<{ detail: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone }),
  })

// new_password (نه password)
export const resetPassword = (phone: string, code: string, newPassword: string) =>
  request<{ access: string; refresh: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone, code, new_password: newPassword }),
  })

// ─── Addresses ──────────────────────────────────────────────
export const getAddresses = (token: string) =>
  request<any[]>('/api/auth/addresses', { headers: authHeaders(token) })

export const addAddress = (token: string, data: any) =>
  request<any>('/api/auth/addresses', {
    method: 'POST', body: JSON.stringify(data), headers: authHeaders(token),
  })

export const deleteAddress = (token: string, addressId: number) =>
  request<any>(`/api/auth/addresses/${addressId}`, {
    method: 'DELETE', headers: authHeaders(token),
  })

// ─── Shipping ───────────────────────────────────────────────
export const getProvinces = () =>
  request<any[]>('/api/shipping/provinces')

export const getCities = (provinceId: number) =>
  request<any[]>(`/api/shipping/provinces/${provinceId}/cities`)

export const calculateShipping = (data: any) =>
  request<any>('/api/shipping/calculate', { method: 'POST', body: JSON.stringify(data) })

// ─── Orders ─────────────────────────────────────────────────
export const createOrder = (token: string, data: any) =>
  request<any>('/api/orders', {
    method: 'POST', body: JSON.stringify(data), headers: authHeaders(token),
  })

export const getOrders = (token: string) =>
  request<any[]>('/api/auth/orders', { headers: authHeaders(token) })

export const getOrder = (token: string, id: string, signal?: AbortSignal) =>
  request<any>(`/api/auth/orders/${id}`, { headers: authHeaders(token), signal })

export const cancelOrder = (token: string, id: string) =>
  request<any>(`/api/auth/orders/${id}`, {
    method: 'DELETE', headers: authHeaders(token),
  })

// ─── Payment ─────────────────────────────────────────────────
export const initiatePayment = (token: string, orderId: string) =>
  request<any>('/api/payment/initiate', {
    method: 'POST', body: JSON.stringify({ order_id: orderId }), headers: authHeaders(token),
  })

// ─── Blog ───────────────────────────────────────────────────
export interface DjangoBlogPost {
  id: number
  title: string
  slug: string
  content: string
  summary?: string
  featured_image: string | null
  published_at: string | null
  created_at: string
}

export const getDjangoBlogs = () =>
  request<DjangoBlogPost[]>('/api/blog/posts')

export const getDjangoBlog = (slug: string) =>
  request<DjangoBlogPost>(`/api/blog/posts/${slug}`)

// ─── CMS ────────────────────────────────────────────────────
export interface Banner {
  id: number
  title: string
  subtitle: string
  image: string | null
  link: string
  cta_text: string
  cta_link: string
  cta2_text: string
  cta2_link: string
}

export interface Partner {
  id: number
  name: string
  logo: string | null
  website: string
}

export interface Page {
  id: number
  title: string
  slug: string
  content: string
}

export const getBanners = () =>
  request<Banner[]>('/api/banners')

export const getPartners = () =>
  request<Partner[]>('/api/partners')

export const getPage = (slug: string) =>
  request<Page>(`/api/pages/${slug}`)
