'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getProducts } from '@/lib/api/django'

interface SearchResult {
  id: string
  name: string
  price?: number
}

export default function CmdKSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('afi_recent_searches')
    if (saved) setRecent(JSON.parse(saved))
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [open])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const data = await getProducts({ q, page_size: 5 })
      const items = (data?.results ?? data ?? []).map((p: any) => ({
        id: String(p.id),
        name: p.name,
        price: p.price,
      }))
      setResults(items)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  const saveRecent = (q: string) => {
    const updated = [q, ...recent.filter((r) => r !== q)].slice(0, 5)
    setRecent(updated)
    localStorage.setItem('afi_recent_searches', JSON.stringify(updated))
  }

  const handleSelect = (name: string) => {
    saveRecent(name)
    setOpen(false)
    router.push(`/products?q=${encodeURIComponent(name)}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecent(query.trim())
      setOpen(false)
      router.push(`/products?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[800] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-[900] w-full max-w-lg"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-border-default/30 overflow-hidden mx-4">
              {/* Search input */}
              <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 border-b border-border-default/30">
                {loading ? (
                  <Loader2 className="w-5 h-5 text-navy animate-spin shrink-0" />
                ) : (
                  <Search className="w-5 h-5 text-text-tertiary shrink-0" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی محصولات..."
                  className="flex-1 text-base text-text-primary placeholder:text-text-tertiary outline-none bg-transparent"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-bg-secondary rounded-md text-[11px] text-text-tertiary font-mono border border-border-default/30">
                  ESC
                </kbd>
              </form>

              {/* Results */}
              <div className="max-h-[300px] overflow-y-auto">
                {query.length < 2 && recent.length > 0 && (
                  <div className="p-3">
                    <p className="text-xs text-text-tertiary font-medium px-2 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      جستجوهای اخیر
                    </p>
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleSelect(r)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
                      >
                        <span>{r}</span>
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180 opacity-40" />
                      </button>
                    ))}
                  </div>
                )}

                {results.length > 0 && (
                  <div className="p-3">
                    <p className="text-xs text-text-tertiary font-medium px-2 mb-2">محصولات</p>
                    {results.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleSelect(r.name)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm hover:bg-bg-secondary transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Search className="w-4 h-4 text-text-tertiary group-hover:text-navy transition-colors" />
                          <span className="text-text-primary">{r.name}</span>
                        </div>
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180 opacity-0 group-hover:opacity-40 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}

                {query.length >= 2 && results.length === 0 && !loading && (
                  <div className="p-6 text-center">
                    <p className="text-sm text-text-tertiary">نتیجه‌ای یافت نشد</p>
                  </div>
                )}

                {query.length < 2 && recent.length === 0 && (
                  <div className="p-6 text-center">
                    <Search className="w-8 h-8 text-text-tertiary/30 mx-auto mb-2" />
                    <p className="text-sm text-text-tertiary">نام محصول را تایپ کنید</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
