import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getDjangoBlog, getDjangoBlogs, publicImageUrl } from '@/lib/api/django'
import BlogCard from '@/components/blog/BlogCard'
import BreadcrumbTrail from '@/components/trail/BreadcrumbTrail'
import SignalStrength from '@/components/tracking/SignalStrength'
import { Calendar, User, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

export async function generateStaticParams() {
  try {
    const posts = await getDjangoBlogs()
    return posts.map((post: any) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getDjangoBlog(slug)
    return {
      title: `${post.title} | وبلاگ آتی فرزام`,
      description: post.content?.slice(0, 155) ?? post.title,
      openGraph: {
        title: post.title,
        description: post.content?.slice(0, 155) ?? '',
        locale: 'fa_IR',
        type: 'article',
      },
    }
  } catch {
    return { title: 'مقاله | وبلاگ آتی فرزام' }
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params

  let post: any
  try {
    post = await getDjangoBlog(slug)
  } catch {
    notFound()
  }

  let relatedPosts: any[] = []
  try {
    const allPosts = await getDjangoBlogs()
    relatedPosts = allPosts.filter((p: any) => p.slug !== slug).slice(0, 3)
  } catch {}

  const coverSrc = post.featured_image ? publicImageUrl(post.featured_image) : null

  return (
    <div className="bg-white min-h-screen">
      <section
        className="text-white py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #10b981 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <BreadcrumbTrail />
          <h1 className="text-3xl md:text-4xl font-black mt-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at ?? post.created_at)}
            </span>
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            )}
          </div>
          <div className="mt-4">
            <SignalStrength bars={4} activeColor="#ffffff" />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <article className="lg:col-span-3">
              {coverSrc && (
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-md">
                  <img
                    src={coverSrc}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none text-gray-800 leading-8
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-a:text-[#1e3a5f] prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-2xl prose-img:shadow-md
                  prose-blockquote:border-r-4 prose-blockquote:border-[#1e3a5f] prose-blockquote:pr-4 prose-blockquote:not-italic"
                dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
              />
            </article>

            <aside className="space-y-6">
              <div className="rounded-2xl shadow-md bg-white p-5 border border-gray-100 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-[#10b981]" />
                  <h3 className="font-bold text-gray-900 text-sm">مقالات اخیر</h3>
                </div>
                <div className="space-y-3">
                  {relatedPosts.length > 0 ? (
                    relatedPosts.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.slug}`}
                        className="block p-3 rounded-xl hover:bg-[#f1f5f9] transition-colors group"
                      >
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#1e3a5f] transition-colors">
                          {p.title}
                        </h4>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {formatDate(p.published_at ?? p.created_at)}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">مقاله‌ای یافت نشد.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">مقالات مرتبط</h2>
                <div className="section-underline !mx-0 mt-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((p: any) => (
                  <BlogCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
