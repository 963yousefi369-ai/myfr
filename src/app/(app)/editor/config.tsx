import type { Config, Data } from "@puckeditor/core";
import { getProducts, getBanners, getPartners, getSettings, getDjangoBlogs, publicImageUrl, djangoImageUrl } from "@/lib/api/django";
import React from "react";

const SectionWrapper = ({ children, bg = "white" }: { children: React.ReactNode; bg?: string }) => (
  <section className={`py-14 md:py-20 bg-${bg}`}>
    <div className="max-w-7xl mx-auto px-4">{children}</div>
  </section>
);

const SectionTitleBlock = ({ eyebrow, title, subtitle, align = "center" }: { eyebrow?: string; title: string; subtitle?: string; align?: "center" | "right" }) => (
  <div className={`mb-10 ${align === "center" ? "text-center" : ""}`}>
    {eyebrow && (
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest mb-3 text-teal-600">
        <span className="w-1 h-1 rounded-full bg-teal-500" />
        {eyebrow}
      </div>
    )}
    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>
    {subtitle && <p className="text-base mt-2 leading-relaxed max-w-2xl text-slate-500 mx-auto">{subtitle}</p>}
  </div>
);

// ─── Components ─────────────────────────────────────────────

const HeroSection = ({ title, subtitle, ctaText, ctaLink, cta2Text, cta2Link }: {
  title: string; subtitle?: string; ctaText?: string; ctaLink?: string; cta2Text?: string; cta2Link?: string;
}) => (
  <section className="relative overflow-hidden min-h-[500px] flex items-center bg-gradient-to-br from-[#1e3a5f] to-[#10b981]">
    <div className="container mx-auto px-6 py-20 text-white text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{title || "عنوان اصلی"}</h1>
      {subtitle && <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">{subtitle}</p>}
      <div className="flex gap-4 justify-center flex-wrap">
        {ctaText && (
          <a href={ctaLink || "#"} className="bg-white text-[#1e3a5f] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition">
            {ctaText}
          </a>
        )}
        {cta2Text && (
          <a href={cta2Link || "#"} className="border border-white/40 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition">
            {cta2Text}
          </a>
        )}
      </div>
    </div>
  </section>
);

const HeadingBlock = ({ text, level = "h2" }: { text: string; level?: "h1" | "h2" | "h3" }) => {
  const Tag = level;
  const sizes = { h1: "text-4xl md:text-5xl font-black", h2: "text-2xl md:text-3xl font-bold", h3: "text-xl font-bold" };
  return <Tag className={`${sizes[level]} text-slate-900`}>{text || "عنوان"}</Tag>;
};

const ParagraphBlock = ({ text }: { text: string }) => (
  <p className="text-gray-700 leading-8 text-base">{text || "متن جدید..."}</p>
);

const RichTextBlock = ({ content }: { content: string }) => (
  <div className="prose prose-lg max-w-none text-gray-700 leading-8 prose-headings:text-gray-900 prose-a:text-[#1e3a5f]" dangerouslySetInnerHTML={{ __html: content || "" }} />
);

const ButtonBlock = ({ label, url, variant = "primary" }: { label: string; url: string; variant?: "primary" | "outline" }) => (
  <a
    href={url || "#"}
    className={
      variant === "primary"
        ? "bg-[#10b981] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0ea572] transition inline-block"
        : "border border-[#1e3a5f] text-[#1e3a5f] px-6 py-3 rounded-xl font-medium hover:bg-[#1e3a5f] hover:text-white transition inline-block"
    }
  >
    {label || "کلیک کنید"}
  </a>
);

const ImageBlock = ({ src, alt, aspectRatio = "16/9" }: { src: string; alt?: string; aspectRatio?: string }) => (
  <div className="relative w-full rounded-2xl overflow-hidden shadow-md" style={{ aspectRatio }}>
    {src ? (
      <img src={src} alt={alt || ""} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">تصویر</div>
    )}
  </div>
);

const SpacerBlock = ({ height = "80px" }: { height?: string }) => (
  <div style={{ height }} />
);

const DividerBlock = () => (
  <hr className="border-slate-200 my-8" />
);

const StatsBlock = ({ stats }: { stats: { label: string; value: number; suffix?: string }[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {(stats || []).map((stat, i) => (
      <div key={i} className="text-center bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="text-3xl md:text-4xl font-black text-[#1e3a5f] mb-2">
          {stat.value}{stat.suffix || ""}
        </div>
        <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
      </div>
    ))}
  </div>
);

const FeatureCard = ({ icon, title, desc }: { icon?: string; title: string; desc: string }) => (
  <div className="rounded-2xl shadow-md bg-white p-6 md:p-8 text-center hover:shadow-xl transition-shadow">
    <div className="w-16 h-16 rounded-2xl bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
      <span className="text-2xl">{icon || "⭐"}</span>
    </div>
    <h3 className="text-lg font-bold text-[#0f172a] mb-2">{title}</h3>
    <p className="text-base text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

const FeaturesGridBlock = ({ items }: { items: { icon?: string; title: string; desc: string }[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {(items || []).map((item, i) => (
      <FeatureCard key={i} {...item} />
    ))}
  </div>
);

const ContactCardBlock = ({ icon, title, value, href }: { icon?: string; title: string; value: string; href?: string }) => (
  <div className="rounded-2xl shadow-md bg-white p-6 border border-gray-100 flex items-start gap-4">
    <div className="w-12 h-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center shrink-0">
      <span className="text-xl">{icon || "📞"}</span>
    </div>
    <div>
      <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
      {href ? (
        <a href={href} className="text-sm text-[#1e3a5f] hover:underline font-medium">{value}</a>
      ) : (
        <p className="text-sm text-gray-600">{value}</p>
      )}
    </div>
  </div>
);

const ContactCardsGridBlock = ({ cards }: { cards: { icon?: string; title: string; value: string; href?: string }[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    {(cards || []).map((card, i) => (
      <ContactCardBlock key={i} {...card} />
    ))}
  </div>
);

const TwoColumnBlock = ({ left, right, ratio = "1/1" }: { left: string; right: string; ratio?: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
    <div className="prose prose-lg max-w-none text-gray-700 leading-8" dangerouslySetInnerHTML={{ __html: left }} />
    <div className="prose prose-lg max-w-none text-gray-700 leading-8" dangerouslySetInnerHTML={{ __html: right }} />
  </div>
);

const CtaBannerBlock = ({ title, subtitle, ctaText, ctaLink, bg = "dark" }: {
  title: string; subtitle?: string; ctaText?: string; ctaLink?: string; bg?: "dark" | "teal";
}) => (
  <section
    className="py-16 md:py-20 rounded-2xl"
    style={{
      background: bg === "dark"
        ? "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(16,185,129,0.12) 0%, transparent 65%), #1e3a5f"
        : "linear-gradient(135deg, #10b981 0%, #0ea572 100%)",
    }}
  >
    <div className="max-w-xl mx-auto px-4 text-center">
      <h2 className="text-white font-bold text-2xl md:text-3xl">{title}</h2>
      {subtitle && <p className="text-white/60 text-base mt-2 mb-8">{subtitle}</p>}
      {ctaText && (
        <a href={ctaLink || "#"} className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl transition inline-block">
          {ctaText}
        </a>
      )}
    </div>
  </section>
);

const MapBlock = ({ address, lat, lng }: { address?: string; lat?: number; lng?: number }) => (
  <div className="rounded-2xl overflow-hidden shadow-md">
    <iframe
      src={`https://maps.google.com/maps?q=${lat || 35.6892},${lng || 51.3890}&z=14&output=embed`}
      width="100%"
      height="350"
      style={{ border: 0 }}
      loading="lazy"
    />
    {address && <p className="text-sm text-gray-500 mt-4 text-center p-4">{address}</p>}
  </div>
);

const VideoBlock = ({ url, title }: { url: string; title?: string }) => (
  <div className="rounded-2xl overflow-hidden shadow-md">
    {title && <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>}
    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
      <iframe src={url} className="absolute inset-0 w-full h-full" allowFullScreen />
    </div>
  </div>
);

const FaqBlock = ({ items }: { items: { question: string; answer: string }[] }) => (
  <div className="space-y-4 max-w-3xl mx-auto">
    {(items || []).map((item, i) => (
      <details key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 group">
        <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
          {item.question}
          <span className="text-teal-500 group-open:rotate-45 transition-transform text-xl">+</span>
        </summary>
        <p className="text-gray-600 mt-4 leading-relaxed">{item.answer}</p>
      </details>
    ))}
  </div>
);

// ─── Config ─────────────────────────────────────────────────

export const config: Config = {
  components: {
    HeroSection: {
      fields: {
        title: { type: "text", label: "عنوان اصلی" },
        subtitle: { type: "text", label: "زیرعنوان" },
        ctaText: { type: "text", label: "دکمه اول - متن" },
        ctaLink: { type: "text", label: "دکمه اول - لینک" },
        cta2Text: { type: "text", label: "دکمه دوم - متن" },
        cta2Link: { type: "text", label: "دکمه دوم - لینک" },
      },
      render: ({ title, subtitle, ctaText, ctaLink, cta2Text, cta2Link }) => (
        <HeroSection title={title} subtitle={subtitle} ctaText={ctaText} ctaLink={ctaLink} cta2Text={cta2Text} cta2Link={cta2Link} />
      ),
    },
    Heading: {
      fields: {
        text: { type: "text", label: "متن عنوان" },
        level: {
          type: "select",
          label: "سطح عنوان",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
          ],
        },
      },
      render: ({ text, level }) => <HeadingBlock text={text} level={level} />,
    },
    Paragraph: {
      fields: {
        text: { type: "textarea", label: "متن" },
      },
      render: ({ text }) => <ParagraphBlock text={text} />,
    },
    RichText: {
      fields: {
        content: { type: "textarea", label: "محتوای HTML" },
      },
      render: ({ content }) => <RichTextBlock content={content} />,
    },
    Button: {
      fields: {
        label: { type: "text", label: "متن دکمه" },
        url: { type: "text", label: "لینک" },
        variant: {
          type: "select",
          label: "نوع",
          options: [
            { label: "اصلی", value: "primary" },
            { label: "_outline", value: "outline" },
          ],
        },
      },
      render: ({ label, url, variant }) => <ButtonBlock label={label} url={url} variant={variant} />,
    },
    Image: {
      fields: {
        src: { type: "text", label: "آدرس تصویر" },
        alt: { type: "text", label: "متن جایگزین" },
        aspectRatio: {
          type: "select",
          label: "نسبت تصویر",
          options: [
            { label: "16:9", value: "16/9" },
            { label: "4:3", value: "4/3" },
            { label: "1:1", value: "1/1" },
            { label: "3:2", value: "3/2" },
          ],
        },
      },
      render: ({ src, alt, aspectRatio }) => <ImageBlock src={src} alt={alt} aspectRatio={aspectRatio} />,
    },
    Spacer: {
      fields: {
        height: {
          type: "select",
          label: "ارتفاع",
          options: [
            { label: "40px", value: "40px" },
            { label: "80px", value: "80px" },
            { label: "120px", value: "120px" },
            { label: "160px", value: "160px" },
          ],
        },
      },
      render: ({ height }) => <SpacerBlock height={height} />,
    },
    Divider: {
      fields: {},
      render: () => <DividerBlock />,
    },
    Stats: {
      fields: {
        stats: {
          type: "array",
          label: "آمار",
          getItemSummary: (item: any) => `${item.label}: ${item.value}`,
          defaultItemProps: { label: "عنوان", value: 0, suffix: "+" },
          arrayFields: {
            label: { type: "text", label: "عنوان" },
            value: { type: "number", label: "مقدار" },
            suffix: { type: "text", label: "پسوند" },
          },
        },
      },
      render: ({ stats }) => <StatsBlock stats={stats || []} />,
    },
    FeaturesGrid: {
      fields: {
        items: {
          type: "array",
          label: "ویژگی‌ها",
          getItemSummary: (item: any) => item.title,
          defaultItemProps: { icon: "⭐", title: "ویژگی", desc: "توضیحات" },
          arrayFields: {
            icon: { type: "text", label: "آیکون (emoji)" },
            title: { type: "text", label: "عنوان" },
            desc: { type: "textarea", label: "توضیحات" },
          },
        },
      },
      render: ({ items }) => <FeaturesGridBlock items={items || []} />,
    },
    ContactCards: {
      fields: {
        cards: {
          type: "array",
          label: "اطلاعات تماس",
          getItemSummary: (item: any) => item.title,
          defaultItemProps: { icon: "📞", title: "تلفن", value: "021-12345678" },
          arrayFields: {
            icon: { type: "text", label: "آیکون (emoji)" },
            title: { type: "text", label: "عنوان" },
            value: { type: "text", label: "مقدار" },
            href: { type: "text", label: "لینک" },
          },
        },
      },
      render: ({ cards }) => <ContactCardsGridBlock cards={cards || []} />,
    },
    TwoColumn: {
      fields: {
        left: { type: "textarea", label: "ستون چپ (HTML)" },
        right: { type: "textarea", label: "ستون راست (HTML)" },
      },
      render: ({ left, right }) => <TwoColumnBlock left={left} right={right} />,
    },
    CtaBanner: {
      fields: {
        title: { type: "text", label: "عنوان" },
        subtitle: { type: "text", label: "زیرعنوان" },
        ctaText: { type: "text", label: "متن دکمه" },
        ctaLink: { type: "text", label: "لینک دکمه" },
        bg: {
          type: "select",
          label: "پس‌زمینه",
          options: [
            { label: "تیره", value: "dark" },
            { label: "سبز", value: "teal" },
          ],
        },
      },
      render: ({ title, subtitle, ctaText, ctaLink, bg }) => (
        <CtaBannerBlock title={title} subtitle={subtitle} ctaText={ctaText} ctaLink={ctaLink} bg={bg} />
      ),
    },
    Map: {
      fields: {
        address: { type: "text", label: "آدرس" },
        lat: { type: "number", label: "عرض جغرافیایی" },
        lng: { type: "number", label: "طول جغرافیایی" },
      },
      render: ({ address, lat, lng }) => <MapBlock address={address} lat={lat} lng={lng} />,
    },
    Faq: {
      fields: {
        items: {
          type: "array",
          label: "سوالات",
          getItemSummary: (item: any) => item.question,
          defaultItemProps: { question: "سوال؟", answer: "پاسخ" },
          arrayFields: {
            question: { type: "text", label: "سوال" },
            answer: { type: "textarea", label: "پاسخ" },
          },
        },
      },
      render: ({ items }) => <FaqBlock items={items || []} />,
    },
  },
};

// ─── Default data templates per page ────────────────────────

export const PAGE_TEMPLATES: Record<string, Data> = {
  home: {
    content: [
      { type: "HeroSection", props: { id: "hero-1", title: "ردیاب‌های GPS پیشرفته", subtitle: "راهکارهای حرفه‌ای مدیریت ناوگان با دقت بالا و پوشش سراسری ایران", ctaText: "مشاهده محصولات", ctaLink: "/products", cta2Text: "مشاوره رایگان", cta2Link: "/contact" } },
      { type: "Spacer", props: { id: "spacer-1", height: "80px" } },
      { type: "Heading", props: { id: "h-why", text: "چرا ما را انتخاب کنید؟", level: "h2" } },
      { type: "FeaturesGrid", props: { id: "why-1", items: [
        { icon: "🛡️", title: "کیفیت ساخت بالا", desc: "استفاده از بهترین قطعات و تکنولوژی روز دنیا" },
        { icon: "⚡", title: "قیمت مناسب و رقابتی", desc: "قیمت‌های رقابتی بدون کاهش کیفیت" },
        { icon: "🎧", title: "پشتیبانی در کنار شما", desc: "پشتیبانی فنی در کنار خرید و نصب ردیاب" },
      ] } },
      { type: "Spacer", props: { id: "spacer-2", height: "80px" } },
      { type: "Heading", props: { id: "h-about", text: "درباره آتی فرزام ایرانیان", level: "h2" } },
      { type: "Paragraph", props: { id: "p-about", text: "شرکت آتی فرزام ایرانیان با بیش از یک دهه تجربه در حوزه ردیابی GPS، راهکارهای جامع مدیریت ناوگان و امنیت خودرو را به سازمان‌ها و افراد ارائه می‌دهد." } },
      { type: "Spacer", props: { id: "spacer-3", height: "80px" } },
      { type: "CtaBanner", props: { id: "cta-1", title: "عضویت در خبرنامه", subtitle: "آخرین اخبار محصولات و تخفیف‌های ویژه GPS را دریافت کنید", ctaText: "عضویت", ctaLink: "#", bg: "dark" } },
    ],
    root: { title: "صفحه اصلی" },
  },
  about: {
    content: [
      { type: "HeroSection", props: { id: "hero-about", title: "درباره ما", subtitle: "آتی فرزام ایرانیان — پیشگام در راهکارهای هوشمند مدیریت ناوگان" } },
      { type: "Spacer", props: { id: "sp-1", height: "80px" } },
      { type: "Heading", props: { id: "h-1", text: "شرکت آتی فرزام ایرانیان", level: "h2" } },
      { type: "Paragraph", props: { id: "p-1", text: "شرکت آتی فرزام ایرانیان با بیش از یک دهه سابقه در حوزه ردیابی خودرو و مدیریت هوشمند ناوگان، یکی از پیشروان این صنعت در ایران است." } },
      { type: "Spacer", props: { id: "sp-2", height: "80px" } },
      { type: "Stats", props: { id: "stats-1", stats: [
        { label: "مشتری فعال", value: 5000, suffix: "+" },
        { label: "دستگاه نصب‌شده", value: 25000, suffix: "+" },
        { label: "سال تجربه", value: 12, suffix: "" },
        { label: "شهر تحت پوشش", value: 31, suffix: "" },
      ] } },
      { type: "Spacer", props: { id: "sp-3", height: "80px" } },
      { type: "Heading", props: { id: "h-2", text: "چرا ما را انتخاب کنید؟", level: "h2" } },
      { type: "FeaturesGrid", props: { id: "fg-1", items: [
        { icon: "🛡️", title: "ضمانت کیفیت", desc: "تمام محصولات با گارانتی معتبر و استانداردهای بین‌المللی عرضه می‌شوند." },
        { icon: "🎧", title: "پشتیبانی ۲۴ ساعته", desc: "تیم پشتیبانی ما در تمام ساعات شبانه‌روز آماده کمک به شماست." },
        { icon: "🔧", title: "نصب حرفه‌ای", desc: "نصب و راه‌اندازی توسط تکنسین‌های مجرب در سراسر کشور." },
        { icon: "🎯", title: "دقت بالا", desc: "ردیابی با دقت بالا و به‌روزرسانی لحظه‌ای موقعیت خودرو." },
      ] } },
    ],
    root: { title: "درباره ما" },
  },
  contact: {
    content: [
      { type: "HeroSection", props: { id: "hero-contact", title: "تماس با ما", subtitle: "سوال، پیشنهاد یا نیاز به پشتیبانی دارید؟ ما اینجاییم." } },
      { type: "Spacer", props: { id: "sp-1", height: "80px" } },
      { type: "ContactCards", props: { id: "cc-1", cards: [
        { icon: "📞", title: "تلفن پشتیبانی", value: "۰۲۱-۱۲۳۴۵۶۷۸", href: "tel:02112345678" },
        { icon: "✉️", title: "ایمیل", value: "info@atifarzam.ir", href: "mailto:info@atifarzam.ir" },
        { icon: "📍", title: "آدرس دفتر", value: "تهران، ایران" },
      ] } },
      { type: "Spacer", props: { id: "sp-2", height: "80px" } },
      { type: "Map", props: { id: "map-1", address: "تهران، ایران", lat: 35.6892, lng: 51.389 } },
    ],
    root: { title: "تماس با ما" },
  },
};

// ─── Helper: fetch dynamic data for preview ─────────────────

export async function fetchDynamicData() {
  try {
    const [products, banners, partners, settings, blogs] = await Promise.allSettled([
      getProducts({ page_size: 8 }),
      getBanners(),
      getPartners(),
      getSettings(),
      getDjangoBlogs(),
    ]);
    return {
      products: products.status === "fulfilled" ? (products.value?.results ?? products.value ?? []) : [],
      banners: banners.status === "fulfilled" ? banners.value : [],
      partners: partners.status === "fulfilled" ? partners.value : [],
      settings: settings.status === "fulfilled" ? settings.value : null,
      blogs: blogs.status === "fulfilled" ? (blogs.value ?? []) : [],
    };
  } catch {
    return { products: [], banners: [], partners: [], settings: null, blogs: [] };
  }
}
