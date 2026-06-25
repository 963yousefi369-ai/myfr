import React, { useEffect, useState } from 'react'
import { pb, pbImageUrl } from '../../api/pocketbase.js'
import DataTable from '../../components/admin/DataTable.jsx'
import ImageUpload from '../../components/admin/ImageUpload.jsx'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'

const EMPTY = { title: '', subtitle: '', btn_text: '', btn_link: '', order: 0, active: true, image: null }

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null) // null = new
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const data = await pb.collection('banners').getFullList({ sort: 'order' })
      setBanners(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setImageFile(null)
    setError('')
    setModal(true)
  }

  function openEdit(row) {
    setEditing(row)
    setForm({
      title: row.title || '',
      subtitle: row.subtitle || '',
      btn_text: row.btn_text || '',
      btn_link: row.btn_link || '',
      order: row.order ?? 0,
      active: row.active ?? true,
    })
    setImageFile(null)
    setError('')
    setModal(true)
  }

  function currentPreview() {
    if (imageFile) return URL.createObjectURL(imageFile)
    if (editing && editing.image) return pbImageUrl(editing, editing.image)
    return null
  }

  async function handleSave() {
    setError('')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('subtitle', form.subtitle)
      fd.append('btn_text', form.btn_text)
      fd.append('btn_link', form.btn_link)
      fd.append('order', form.order)
      fd.append('active', form.active)
      if (imageFile) fd.append('image', imageFile)

      if (editing) {
        await pb.collection('banners').update(editing.id, fd)
      } else {
        await pb.collection('banners').create(fd)
      }
      setModal(false)
      load()
    } catch (e) {
      setError(e.message || 'خطا در ذخیره')
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await pb.collection('banners').delete(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (e) {
      console.error(e)
    }
    setDeleting(false)
  }

  const columns = [
    {
      key: 'image', label: 'تصویر',
      render: (val, row) => val
        ? <img src={pbImageUrl(row, val)} alt="" className="h-12 w-20 object-cover rounded-lg bg-gray-800"/>
        : <div className="h-12 w-20 rounded-lg bg-gray-800 flex items-center justify-center text-gray-600 text-xs">بدون تصویر</div>
    },
    { key: 'title',    label: 'عنوان' },
    { key: 'order',    label: 'ترتیب' },
    {
      key: 'active', label: 'وضعیت',
      render: v => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
          {v ? 'فعال' : 'غیرفعال'}
        </span>
      )
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">مدیریت بنرها</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          بنر جدید
        </button>
      </div>

      <DataTable columns={columns} data={banners} loading={loading} onEdit={openEdit} onDelete={setDeleteTarget}/>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/70" onClick={() => !saving && setModal(false)}/>
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-5">{editing ? 'ویرایش بنر' : 'بنر جدید'}</h2>

            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <div className="space-y-4">
              <ImageUpload
                label="تصویر بنر"
                value={currentPreview()}
                onChange={setImageFile}
              />

              {[
                { key: 'title',    label: 'عنوان' },
                { key: 'subtitle', label: 'زیرعنوان' },
                { key: 'btn_text', label: 'متن دکمه' },
                { key: 'btn_link', label: 'لینک دکمه', dir: 'ltr' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
                  <input
                    type="text"
                    value={form[f.key]}
                    dir={f.dir || 'rtl'}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">ترتیب نمایش</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, active: !p.active }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? 'bg-indigo-600' : 'bg-gray-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.active ? 'right-1' : 'left-1'}`}/>
                </button>
                <span className="text-sm text-gray-300">{form.active ? 'فعال' : 'غیرفعال'}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setModal(false)}
                disabled={saving}
                className="px-4 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {saving ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="حذف بنر"
        message={`بنر "${deleteTarget?.title}" حذف شود؟`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
