"use client";

import dynamic from "next/dynamic";
import { config } from "@/app/editor/config";

const PuckRender = dynamic(
  () => import("@puckeditor/core").then((mod) => mod.Render),
  { ssr: false }
);

interface PuckRendererProps {
  data: any;
}

export default function PuckRenderer({ data }: PuckRendererProps) {
  if (!data || !data.content || data.content.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-lg">این صفحه هنوز محتوایی ندارد</p>
        <a
          href="/editor"
          className="text-[#10b981] hover:underline text-sm mt-2 inline-block"
        >
          ویرایش صفحه
        </a>
      </div>
    );
  }

  return <PuckRender config={config} data={data} />;
}
