import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pb } from '../../api/pocketbase.js'
import DataTable from '../../components/admin/DataTable.jsx'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const data = await pb.collection('blogs').getFullList({ sort: '-created' })
      setPosts(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try { await pb.collection('blogs').delete(deleteTarget.id); setDeleteTarget(null); load() }
    catch (e) { console.error(e) }
    setDeleting(false)
  }

  const columns = [
    { key: 'title',     label: 'عنوان' },
    { key: 'slug',      label: 'Slug',
      render: v => <span className="font-mono text-xs text-gray-400" dir="ltr">{v}</span>
    },
    { key: 'published', label: 'وضعیت',
      render: v => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
          {v ? 'منتشرشده' : 'پیش‌نویس'}
        </span>
      )
    },
    { key: 'created',   label: 'تاریخ',
      render: v => v ? new Date(v).toLocaleDateString('fa-IR') : '—'
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">مدیریت بلاگ</h1>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          پست جدید
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        onEdit={row => window.location.href = `/admin/blog/${row.id}`}
        onDelete={setDeleteTarget}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="حذف پست"
        message={`پست "${deleteTarget?.title}" حذف شود؟`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
