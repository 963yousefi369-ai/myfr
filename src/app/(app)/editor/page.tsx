"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPages, type PageRecord } from "@/lib/api/pages";
import { config, PAGE_TEMPLATES } from "./config";
import { Plus, FileText, Edit3, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const AVAILABLE_PAGES = [
  { slug: "home", title: "صفحه اصلی", icon: "🏠" },
  { slug: "about", title: "درباره ما", icon: "ℹ️" },
  { slug: "contact", title: "تماس با ما", icon: "📞" },
  { slug: "software", title: "نرم‌افزار", icon: "💻" },
  { slug: "custom", title: "صفحه سفارشی", icon: "📄" },
];

export default function EditorDashboard() {
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    setLoading(true);
    const data = await getPages();
    setPages(data);
    setLoading(false);
  }

  async function handleCreatePage() {
    if (!newSlug || !newTitle) return;
    window.location.href = `/editor/${newSlug}?title=${encodeURIComponent(newTitle)}`;
  }

  const existingSlugs = pages.map((p) => p.slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#10b981] flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">ویرایشگر صفحات</h1>
              <p className="text-sm text-slate-500">صفحات سایت خود را ویرایش کنید</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors"
          >
            مشاهده سایت ←
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Quick Access Pages */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            صفحات اصلی سایت
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_PAGES.filter((p) => p.slug !== "custom").map((page) => {
              const saved = pages.find((p) => p.slug === page.slug);
              return (
                <motion.div
                  key={page.slug}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-[#10b981]/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{page.icon}</span>
                      <div>
                        <h3 className="font-bold text-slate-900">{page.title}</h3>
                        <p className="text-xs text-slate-400 font-mono direction-ltr">/{page.slug}</p>
                      </div>
                    </div>
                    {saved && (
                      <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                        ذخیره شده
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/editor/${page.slug}?title=${encodeURIComponent(page.title)}`}
                    className="w-full block text-center bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                  >
                    {saved ? "ویرایش صفحه" : "ایجاد صفحه"}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Saved Pages */}
        {pages.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]" />
              صفحات ذخیره شده
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {pages.map((page, i) => (
                <div
                  key={page.id}
                  className={`flex items-center justify-between p-5 ${
                    i > 0 ? "border-t border-slate-100" : ""
                  } hover:bg-slate-50 transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <h3 className="font-semibold text-slate-900">{page.title}</h3>
                      <p className="text-xs text-slate-400 font-mono direction-ltr">/{page.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {new Date(page.updated).toLocaleDateString("fa-IR")}
                    </span>
                    <Link
                      href={`/editor/${page.slug}?title=${encodeURIComponent(page.title)}`}
                      className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      ویرایش
                    </Link>
                    <Link
                      href={`/${page.slug === "home" ? "" : page.slug}`}
                      target="_blank"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      مشاهده
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Create Custom Page */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            ایجاد صفحه جدید
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            {!showCreate ? (
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-3 text-slate-600 hover:text-[#1e3a5f] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-medium">ایجاد صفحه سفارشی جدید</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">عنوان صفحه</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: خدمات ما"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">آدرس صفحه (انگلیسی)</label>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.replace(/[^a-z0-9-]/g, "-").toLowerCase())}
                    placeholder="مثال: services"
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  />
                  {newSlug && (
                    <p className="text-xs text-slate-400 mt-1 font-mono">/{newSlug}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreatePage}
                    disabled={!newSlug || !newTitle}
                    className="bg-[#10b981] hover:bg-[#0ea572] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ایجاد و ویرایش
                  </button>
                  <button
                    onClick={() => {
                      setShowCreate(false);
                      setNewSlug("");
                      setNewTitle("");
                    }}
                    className="text-slate-500 hover:text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info */}
        <div className="mt-10 bg-teal-50 border border-teal-200 rounded-2xl p-6">
          <h3 className="font-bold text-teal-800 mb-2">راهنما</h3>
          <ul className="text-sm text-teal-700 space-y-1.5">
            <li>• از بخش «صفحات اصلی» صفحات پیش‌فرض سایت را ویرایش کنید</li>
            <li>• تغییرات پس از ذخیره در صفحه واقعی سایت نمایش داده می‌شوند</li>
            <li>• می‌توانید صفحات سفارشی جدید با آدرس دلخواه ایجاد کنید</li>
            <li>• برای مشاهده تغییرات، روی «مشاهده» کلیک کنید</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
