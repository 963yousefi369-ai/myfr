import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import PuckRenderer from "@/components/editor/PuckRenderer";

const PAGES_DIR = path.join(process.cwd(), "data", "pages");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(PAGES_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return { title: "صفحه یافت نشد" };
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const page = JSON.parse(content);

  return {
    title: `${page.title || slug} | آتی فرزام ایرانیان`,
  };
}

export default async function PuckPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(PAGES_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const page = JSON.parse(content);

  return (
    <div dir="rtl">
      <PuckRenderer data={page.data} />
    </div>
  );
}
