import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PAGES_DIR = path.join(process.cwd(), "data", "pages");

function ensureDir() {
  if (!fs.existsSync(PAGES_DIR)) {
    fs.mkdirSync(PAGES_DIR, { recursive: true });
  }
}

export async function GET() {
  ensureDir();
  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".json"));
  const pages = files.map((f) => {
    const content = fs.readFileSync(path.join(PAGES_DIR, f), "utf-8");
    const data = JSON.parse(content);
    return {
      slug: f.replace(".json", ""),
      title: data.title || f.replace(".json", ""),
      updatedAt: data.updatedAt || null,
    };
  });
  return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
  ensureDir();
  const body = await req.json();
  const { slug, title, data } = body;

  if (!slug || !data) {
    return NextResponse.json({ error: "slug and data required" }, { status: 400 });
  }

  const filePath = path.join(PAGES_DIR, `${slug}.json`);
  const pageData = {
    slug,
    title: title || slug,
    data,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(pageData, null, 2), "utf-8");
  return NextResponse.json({ success: true, slug });
}
