import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pb } from '../../api/pocketbase.js'

const SECTIONS = [
  { label: 'بنرهای Hero',      collection: 'banners',     to: '/admin/banners',     color: 'bg-indigo-500/10 text-indigo-400', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'پست‌های بلاگ',    collection: 'blogs',       to: '/admin/blog',        color: 'bg-amber-500/10 text-amber-400',   icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { label: 'شرکا',             collection: 'partners',    to: '/admin/partners',    color: 'bg-green-500/10 text-green-400',   icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'محصولات UI',       collection: 'products_ui', to: '/admin/products-ui', color: 'bg-purple-500/10 text-purple-400', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCounts() {
      const results = {}
      await Promise.all(
        SECTIONS.map(async s => {
          try {
            const res = await pb.collection(s.collection).getList(1, 1)
            results[s.collection] = res.totalItems
          } catch {
            results[s.collection] = '—'
          }
        })
      )
      setCounts(results)
      setLoading(false)
    }
    fetchCounts()
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">داشبورد</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {SECTIONS.map(s => (
          <Link
            key={s.collection}
            to={s.to}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon}/>
              </svg>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {loading ? '...' : counts[s.collection] ?? '—'}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SECTIONS.map(s => (
            <Link
              key={s.to}
              to={s.to}
              className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl
                         text-sm text-gray-300 hover:text-white transition-colors"
            >
              <svg className={`w-4 h-4 ${s.color.split(' ')[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon}/>
              </svg>
              مدیریت {s.label}
            </Link>
          ))}
          <Link
            to="/admin/site-config"
            className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl
                       text-sm text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            تنظیمات سایت
          </Link>
        </div>
      </div>
    </div>
  )
}
