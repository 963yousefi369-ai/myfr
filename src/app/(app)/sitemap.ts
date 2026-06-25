import type { MetadataRoute } from 'next'
import { getProducts, getDjangoBlogs } from '@/lib/api/django'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atifarzam.ir'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/software`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  let productPages: MetadataRoute.Sitemap = []
  try {
    const data = await getProducts({ page_size: 100 })
    const products = Array.isArray(data) ? data : (data.results ?? [])
    productPages = products.map((product: any) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: new Date(product.updated_at ?? product.created_at ?? Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {}

  let blogPages: MetadataRoute.Sitemap = []
  try {
    const blogs = await getDjangoBlogs()
    blogPages = blogs.map((post: any) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.published_at ?? post.created_at ?? Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {}

  return [...staticPages, ...productPages, ...blogPages]
}
