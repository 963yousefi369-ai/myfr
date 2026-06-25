'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Star, ChevronDown, ChevronUp, Info, Settings, MessageSquare, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductDetailTabsProps {
  product: any
  features: string[]
  specs: Record<string, string>
  faqs: Array<{ q: string; a: string }>
}

export default function ProductDetailTabs({ product, features, specs, faqs }: ProductDetailTabsProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const reviews = product.reviews ?? []
  const productFeatures: string[] = product.features
    ? product.features.map((f: any) => typeof f === 'string' ? f : f.text)
    : features
  const productSpecs = product.specifications
    ? (Array.isArray(product.specifications)
        ? product.specifications
        : Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      )
    : (Array.isArray(specs) ? specs : Object.entries(specs).map(([key, value]) => ({ key, value })))
  const productFaqs = product.faqs
    ? product.faqs.map((f: any) => ({ q: f.question ?? f.q, a: f.answer ?? f.a }))
    : faqs

  const tabItems = [
    { value: 'faq', label: 'سوالات متداول', icon: HelpCircle },
    { value: 'reviews', label: 'نظرات', icon: MessageSquare },
    { value: 'specs', label: 'مشخصات فنی', icon: Settings },
    { value: 'features', label: 'ویژگی‌ها', icon: Info },
  ]

  return (
    <div className="mt-14" dir="rtl">
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="w-full justify-end gap-1 bg-white border-b-2 border-gray-100 rounded-none h-auto p-0 overflow-x-auto flex-nowrap">
          {tabItems.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                'rounded-none border-b-3 border-transparent px-5 py-3.5 text-sm font-medium transition-all',
                'data-[state=active]:border-[#1e3a5f] data-[state=active]:text-[#1e3a5f] data-[state=active]:bg-blue-50/50',
                'data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-600 data-[state=inactive]:hover:bg-gray-50'
              )}
            >
              <Icon className="w-4 h-4 ml-2" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="features" className="mt-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8" dir="rtl">
            <h3 className="text-lg font-bold text-gray-900 mb-6 text-right">ویژگی‌های محصول</h3>
            {productFeatures.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Info className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">ویژگی‌ای ثبت نشده است</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productFeatures.map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-green-50/50 border border-green-100 hover:shadow-xl transition-shadow">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-[#10b981]" />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed text-right">{f}</span>
                  </div>
                ))}
              </div>
            )}
            {product.description && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-3 text-right">توضیحات تکمیلی</h4>
                <p className="text-gray-600 leading-8 whitespace-pre-wrap text-sm text-right">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="specs" className="mt-6">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" dir="rtl">
            <h3 className="text-lg font-bold text-gray-900 p-6 pb-0 text-right">مشخصات فنی</h3>
            <div className="p-6">
              {productSpecs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Settings className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">مشخصات فنی ثبت نشده است</p>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                  {productSpecs.map((spec: { key: string; value: string }, i: number) => (
                    <div
                      key={spec.key}
                      className={cn(
                        'flex items-center px-5 py-3.5 text-sm text-right',
                        i % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'
                      )}
                    >
                      <span className="w-2/5 font-medium text-gray-500 text-right">{spec.key}</span>
                      <span className="w-3/5 font-semibold text-gray-800 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8" dir="rtl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 text-right">نظرات کاربران</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                <span className="font-bold text-amber-700 text-sm">{product.rating ?? 0}</span>
                <span className="text-amber-500 text-xs">از ۵</span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">هنوز نظری ثبت نشده است</p>
                </div>
              ) : (
                reviews.map((review: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl border border-gray-100 hover:border-teal-100 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-xs">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm text-right">{review.name}</p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'w-3.5 h-3.5',
                            star <= review.rating
                              ? 'text-[#f59e0b] fill-[#f59e0b]'
                              : 'text-gray-200 fill-gray-100'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed text-right">{review.text}</p>
                </div>
              ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8" dir="rtl">
            <h3 className="text-lg font-bold text-gray-900 mb-6 text-right">سوالات متداول</h3>
            <div className="space-y-3">
              {productFaqs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">سوالی ثبت نشده است</p>
                </div>
              ) : (
                productFaqs.map((faq: { q: string; a: string }, i: number) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-2xl border transition-all overflow-hidden',
                    openFaq === i ? 'border-[#1e3a5f]/30 bg-teal-50/30' : 'border-gray-100 hover:border-gray-200'
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-right"
                  >
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-[#1e3a5f] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <span
                      className={cn(
                        'font-medium text-sm transition-colors flex-1 text-right mr-3',
                        openFaq === i ? 'text-[#1e3a5f]' : 'text-gray-700'
                      )}
                    >
                      {faq.q}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-4 text-sm text-gray-600 leading-7 border-t border-blue-100 pt-3 text-right">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
