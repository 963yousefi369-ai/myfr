"use client";

import dynamic from "next/dynamic";
import "@puckeditor/core/puck.css";
import { config } from "../config";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const PuckEditor = dynamic(
  () => import("@puckeditor/core").then((mod) => mod.Puck),
  { ssr: false }
);

const PAGE_TITLES: Record<string, string> = {
  home: "صفحه اصلی",
  about: "درباره ما",
  contact: "تماس با ما",
  services: "خدمات",
  "products-landing": "لندینگ محصولات",
};

export default function EditorSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [data, setData] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPage = useCallback(async () => {
    try {
      const res = await fetch(`/api/editor/pages/${slug}`);
      if (res.ok) {
        const pageData = await res.json();
        setData(pageData.data);
        setPageTitle(pageData.title || PAGE_TITLES[slug] || slug);
      } else {
        setData({ content: [] });
        setPageTitle(PAGE_TITLES[slug] || slug);
      }
    } catch {
      setData({ content: [] });
      setPageTitle(PAGE_TITLES[slug] || slug);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handlePublish = async (newData: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/editor/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: pageTitle,
          data: newData,
        }),
      });
      if (res.ok) {
        setData(newData);
        alert("✅ صفحه با موفقیت ذخیره شد!");
      } else {
        alert("❌ خطا در ذخیره صفحه");
      }
    } catch {
      alert("❌ خطا در اتصال به سرور");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">در حال بارگذاری ادیتور...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-[#0f172a] text-white px-4 py-2 flex items-center justify-between text-sm shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/editor"
            className="text-white/60 hover:text-white transition-colors"
          >
            ← داشبورد
          </Link>
          <span className="text-white/30">|</span>
          <span className="font-medium">{pageTitle}</span>
          <span className="text-white/40 text-xs" dir="ltr">
            /{slug}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/page/${slug}`}
            target="_blank"
            className="text-white/60 hover:text-white transition-colors text-xs"
          >
            مشاهده صفحه ↗
          </a>
          {saving && (
            <span className="text-[#10b981] text-xs">در حال ذخیره...</span>
          )}
        </div>
      </div>

      {/* Puck Editor */}
      <div className="flex-1">
        <PuckEditor
          config={config}
          data={data || { content: [] }}
          onPublish={handlePublish}
          headerTitle={pageTitle}
        />
      </div>
    </div>
  );
}
