import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || process.env.INTERNAL_API_URL || 'https://farzam.runflare.run'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const res = await fetch(`${BACKEND}/api/chatbot/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[chatbot proxy] send error:', err)
    return NextResponse.json({ reply: 'خطا در اتصال به سرور', session_id: '', quick_replies: [] }, { status: 502 })
  }
}
