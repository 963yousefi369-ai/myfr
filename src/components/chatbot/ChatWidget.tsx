'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, ShoppingBag, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth'
import * as Dialog from '@radix-ui/react-dialog'

const API_BASE = '/api/chatbot'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('chatbot_session_id')
  if (!id) {
    id = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    localStorage.setItem('chatbot_session_id', id)
  }
  return id
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function renderMessageContent(content: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index))
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 underline underline-offset-2 font-medium transition-colors"
      >
        <ShoppingBag className="w-3 h-3 inline" />
        {match[1]}
      </a>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex))
  }

  return parts.length > 0 ? parts : content
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [isOnline, setIsOnline] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const token = useAuthStore(s => s.token)

  const scrollToBottom = useCallback((smooth = true) => {
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
    })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  useEffect(() => {
    fetch(`${API_BASE}/status`)
      .then(r => {
        if (!r.ok) throw new Error(`Status ${r.status}`)
        return r.json()
      })
      .then(data => {
        setIsOnline(data.is_active)
        setQuickReplies(data.quick_replies || [])
        if (messages.length === 0 && data.welcome_message) {
          setMessages([{ id: uid(), role: 'assistant', content: data.welcome_message }])
        }
      })
      .catch(() => setIsOnline(false))
  }, [])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollBtn(distFromBottom > 120)
  }, [])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    setMessages(prev => [...prev, { id: uid(), role: 'user', content: trimmed }])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          session_id: getSessionId(),
          auth_token: token || undefined,
        }),
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        console.error(`[ChatWidget] send failed: HTTP ${res.status}`, errText)
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()

      if (data.session_id) {
        localStorage.setItem('chatbot_session_id', data.session_id)
      }

      setMessages(prev => [...prev, { id: uid(), role: 'assistant', content: data.reply }])

      if (data.quick_replies?.length) {
        setQuickReplies(data.quick_replies)
      }
    } catch (err) {
      console.error('[ChatWidget] sendMessage error:', err)
      setMessages(prev => [...prev, {
        id: uid(),
        role: 'assistant',
        content: 'متأسفم، مشکلی پیش آمد. لطفاً دوباره تلاش کنید. 🙏',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        {/* Panel */}
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[301] bg-black/20 sm:bg-transparent" />
          <Dialog.Content
            className="fixed z-[302] flex flex-col outline-none
              top-[72px] bottom-[76px] right-3 left-3 rounded-2xl
              sm:inset-auto sm:bottom-[84px] sm:right-6 sm:left-auto sm:w-[400px] sm:h-[560px] sm:max-h-[calc(100vh-120px)] sm:rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
            }}
            dir="rtl"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Header */}
            <div
              className="relative px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 shrink-0"
              style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${isOnline ? 'bg-emerald-400' : 'bg-gray-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <Dialog.Title className="text-white font-bold text-sm">
                  دستیار هوشمند آتی فرزام
                </Dialog.Title>
                <p className={`text-xs mt-0.5 ${isOnline ? 'text-emerald-300' : 'text-gray-400'}`}>
                  {isOnline ? 'آنلاین — آماده کمک' : 'آفلاین'}
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="بستن چت"
                >
                  <X className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
                </button>
              </Dialog.Close>
              <div className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, #10b981, #059669, #f59e0b)' }}
              />
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4"
              style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 mt-0.5 flex items-center justify-center shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-3 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-2xl rounded-tr-md text-white'
                        : 'rounded-2xl rounded-tl-md text-gray-800'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #059669, #10b981)' }
                        : { background: '#f8fafc', border: '1px solid #e2e8f0' }
                    }
                  >
                    <div className="whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 shrink-0 mt-0.5 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
                    </div>
                  )}
                </motion.div>
              ))}

              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex gap-2 items-start"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
                    </div>
                    <div className="rounded-2xl rounded-tl-md px-4 py-3 flex gap-1.5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 rounded-full bg-emerald-400"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={endRef} />
            </div>

            {/* Scroll to bottom */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-[60px] sm:bottom-[76px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center z-10"
                >
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Quick Replies */}
            {quickReplies.length > 0 && !isLoading && (
              <div className="px-2 sm:px-3 pb-2 flex sm:flex-wrap gap-1.5 shrink-0 overflow-x-auto sm:overflow-visible scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
                {quickReplies.map((qr, i) => (
                  <motion.button
                    key={qr}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => sendMessage(qr)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
                    style={{
                      background: 'rgba(16,185,129,0.06)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      color: '#059669',
                    }}
                  >
                    {qr}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-3 py-3 flex items-center gap-2 shrink-0"
              style={{
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc',
                paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="پیام خود را بنویسید…"
                disabled={isLoading || !isOnline}
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white outline-none transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50"
                style={{
                  fontSize: '16px',
                  border: '1px solid #e2e8f0',
                  fontFamily: "'Vazirmatn', system-ui, sans-serif",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#10b981'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isLoading}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-opacity disabled:opacity-40 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 rotate-180" />
                )}
              </motion.button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>

        {/* Toggle Button */}
        <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[301] ${isOpen ? 'hidden sm:block' : ''}`} dir="rtl">
          <div className="relative">
            {!isOpen && (
              <>
                <span className="absolute inset-0 rounded-full animate-ping opacity-20"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }} />
                <span className="absolute -inset-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', opacity: 0.15, animation: 'breathe 2s ease-in-out infinite' }} />
              </>
            )}
            <Dialog.Trigger asChild>
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="relative w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer"
                style={{
                  background: isOpen ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #0f172a, #1e3a5f)',
                  boxShadow: isOpen ? '0 8px 32px rgba(239,68,68,0.35)' : '0 8px 32px rgba(30,58,95,0.35)',
                }}
                aria-label={isOpen ? 'بستن چت' : 'باز کردن چت'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <MessageCircle className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </Dialog.Trigger>
          </div>
        </div>
      </Dialog.Root>
    </>
  )
}
