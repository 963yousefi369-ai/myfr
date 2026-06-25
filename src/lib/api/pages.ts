import pb from './pocketbase'

export interface PageRecord {
  id: string
  slug: string
  title: string
  puck_data: string
  created: string
  updated: string
}

export async function getPages(): Promise<PageRecord[]> {
  try {
    return await pb.collection('pages').getFullList({ sort: '-updated' })
  } catch {
    return []
  }
}

export async function getPageBySlug(slug: string): Promise<PageRecord | null> {
  try {
    return await pb.collection('pages').getFirstListItem(`slug="${slug}"`)
  } catch {
    return null
  }
}

export async function savePage(slug: string, title: string, puckData: any): Promise<PageRecord> {
  const data = {
    slug,
    title,
    puck_data: JSON.stringify(puckData),
  }

  try {
    const existing = await getPageBySlug(slug)
    if (existing) {
      return await pb.collection('pages').update(existing.id, data)
    }
  } catch {}

  return await pb.collection('pages').create(data)
}

export async function deletePage(slug: string): Promise<void> {
  try {
    const existing = await getPageBySlug(slug)
    if (existing) {
      await pb.collection('pages').delete(existing.id)
    }
  } catch {}
}

export function parsePuckData(record: PageRecord | null): any {
  if (!record?.puck_data) return null
  try {
    return JSON.parse(record.puck_data)
  } catch {
    return null
  }
}
