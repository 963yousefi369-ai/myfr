import PocketBase from 'pocketbase'

const PB_URL = process.env.NEXT_PUBLIC_PB_URL ?? 'http://127.0.0.1:8090'

const pb = new PocketBase(PB_URL)
pb.autoCancellation(false)

export default pb

export const getBanners = () =>
  pb.collection('banners').getFullList({ sort: 'order' })

export const getPartners = () =>
  pb.collection('partners').getFullList({ sort: 'order' })

export const getBlogs = (page = 1, perPage = 9) =>
  pb.collection('blogs').getList(page, perPage, {
    sort: '-created', filter: 'is_published=true',
  })

export const getBlog = (slug: string) =>
  pb.collection('blogs').getFirstListItem(`slug="${slug}"`)

export const getSiteConfig = () =>
  pb.collection('site_config').getFirstListItem('')

export const getPage = (slug: string) =>
  pb.collection('pages').getFirstListItem(`slug="${slug}"`)

// ─── pbImageUrl ───────────────────────────────────────────────────────────────
export function pbImageUrl(record: any, filename: string): string {
  if (!record || !filename) return ''
  return pb.files.getUrl(record, filename)
}

// ─── extractImages ────────────────────────────────────────────────────────────
// فیلد images میتونه string یا آرایه باشه
function extractImages(records: any[]): string[] {
  return records.flatMap((r) => {
    // آرایه
    if (Array.isArray(r.images) && r.images.length > 0) {
      return r.images.filter(Boolean).map((img: string) => pbImageUrl(r, img))
    }
    // string
    if (typeof r.images === 'string' && r.images.trim()) {
      return [pbImageUrl(r, r.images.trim())]
    }
    // fallback فیلد image تکی
    if (typeof r.image === 'string' && r.image.trim()) {
      return [pbImageUrl(r, r.image.trim())]
    }
    return []
  }).filter(Boolean)
}

// ─── getProductImages ─────────────────────────────────────────────────────────
export async function getProductImages(productId: string | number): Promise<string[]> {
  if (!productId) return []
  try {
    const records = await pb.collection('products_ui').getFullList({
      filter: `product_id = ${Number(productId)}`,
    })
    return extractImages(records)
  } catch (err: any) {
    console.warn(`[PB] getProductImages(${productId}):`, err.message)
    return []
  }
}

// ─── getProductImagesBatch ────────────────────────────────────────────────────
export async function getProductImagesBatch(
  productIds: (string | number)[]
): Promise<Record<string, string[]>> {
  if (!productIds || productIds.length === 0) return {}
  try {
    const filter = productIds.map((id) => `product_id = ${Number(id)}`).join(' || ')
    const records = await pb.collection('products_ui').getFullList({ filter })

    const grouped: Record<string, any[]> = {}
    for (const r of records) {
      const pid = String(r.product_id)
      if (!grouped[pid]) grouped[pid] = []
      grouped[pid].push(r)
    }

    const result: Record<string, string[]> = {}
    for (const [pid, recs] of Object.entries(grouped)) {
      result[pid] = extractImages(recs)
    }
    return result
  } catch (err: any) {
    console.warn('[PB] getProductImagesBatch:', err.message)
    return {}
  }
}
