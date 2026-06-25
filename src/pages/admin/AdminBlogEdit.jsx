import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { pb, pbImageUrl } from '../../api/pocketbase.js'
import ImageUpload from '../../components/admin/ImageUpload.jsx'

function slugify(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
    .replace(/-+/g, '-')
}

const EMPTY = { title: '', slug: '', summary: '', content: '', published: false }

export default function AdminBlogEdit() {
  const { id } = useParams() // 'new' یا record id
  const isNew = id === 'new'
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [coverFile, setCoverFile] = useState(null)
  const [existingCover, setExistingCover] = useState(null)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    pb.collection('blogs').getOne(id)
      .then(record => {
        setForm({
          title: record.title || '',
          slug: record.slug || '',
          summary: record.summary || '',
          content: record.content || '',
          published: record.published ?? false,
        })
        if (record.cover) {
          setExistingCover(pbImageUrl(record, record.cover))
        }
        setLoading(false)
      })
      .catch(() => { setError('خطا در بارگذاری پست'); setLoading(false) })
  }, [id, isNew])

  function handleTitleChange(val) {
    setForm(p => ({ ...p, title: val, slug: isNew ? slugify(val) : p.slug }))
  }

  async function handleSave() {
    setError(''); setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('slug', form.slug)
      fd.append('summary', form.summary)
      fd.append('content', form.content)
      fd.append('published', form.published)
      if (coverFile) fd.append('cover', coverFile)

      if (isNew) {
        await pb.collection('blogs').create(fd)
      } else {
        await pb.collection('blogs').update(id, fd)
      }
      navigate('/admin/blog')
    } catch (e) {
      setError(e.message || 'خطا در ذخیره')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/blog')} className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white">{isNew ? 'پست جدید' : 'ویرایش پست'}</h1>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">عنوان</label>
          <input
            type="text"
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">خلاصه</label>
          <textarea
            value={form.summary}
            onChange={e => setForm(p => ({ ...p, summary: e.target.value }))}
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">محتوا (HTML)</label>
          <textarea
            value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            rows={14}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y font-mono"
            dir="rtl"
          />
        </div>

        <ImageUpload
          label="تصویر کاور"
          value={coverFile ? URL.createObjectURL(coverFile) : existingCover}
          onChange={setCoverFile}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm(p => ({ ...p, published: !p.published }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.published ? 'right-1' : 'left-1'}`}/>
          </button>
          <span className="text-sm text-gray-300">{form.published ? 'منتشرشده' : 'پیش‌نویس'}</span>
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-8">
        <button
          onClick={() => navigate('/admin/blog')}
          disabled={saving}
          className="px-5 py-2.5 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
        >
          انصراف
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره...' : 'ذخیره پست'}
        </button>
      </div>
    </div>
  )
}
