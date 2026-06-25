import { ImageResponse } from 'next/og'
import { getSettings } from '@/lib/api/django'

export const dynamic = 'force-dynamic'
export const contentType = 'image/png'
export const size = { width: 32, height: 32 }

export default async function Icon() {
  try {
    const settings = await getSettings()
    const logoUrl = settings?.logo ?? null

    if (logoUrl) {
      const res = await fetch(logoUrl)
      if (res.ok) {
        const buffer = await res.arrayBuffer()
        return new Response(buffer, {
          headers: {
            'Content-Type': res.headers.get('Content-Type') ?? 'image/png',
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
          },
        })
      }
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a2744, #2d4a7a)',
          borderRadius: '8px',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
