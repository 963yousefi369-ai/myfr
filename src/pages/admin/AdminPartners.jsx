import React, { useEffect, useState } from 'react'
import { pb, pbImageUrl } from '../../api/pocketbase.js'
import DataTable from '../../components/admin/DataTable.jsx'
import ImageUpload from '../../components/admin/ImageUpload.jsx'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'

const EMPTY = { name: '', order: 0 }

export default function AdminPartners() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const data = await pb.collection('partners').getFullList({ sort: 'order' })
      setPartners(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditing(null); setForm(EMPTY); setImageFile(null); setError(''); setModal(true)
  }
  function openEdit(row) {
    setEditing(row); setForm({ name: row.name || '', order: row.order ?? 0 }); setImageFile(null); setError(''); setModal(true)
  }

  function currentPreview() {
    if (imageFile) return URL.createObjectURL(imageFile)
    if (editing?.logo) return pbImageUrl(editing, editing.logo)
    return null
  }

  async function handleSave() {
    setError(''); setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('order', form.order)
      if (imageFile) fd.append('logo', imageFile)
      if (editing) {
        await pb.collection('partners').update(editing.id, fd)
      } else {
        await pb.collection('partners').create(fd)
      }
      setModal(false); load()
    } catch (e) { setError(e.message || 'خطا در ذخیره') }
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try { await pb.collection('partners').delete(deleteTarget.id); setDeleteTarget(null); load() }
    catch (e) { console.error(e) }
    setDeleting(false)
  }

  const columns = [
    {
      key: 'logo', label: 'لوگو',
      render: (v, row) => v
        ? <img src={pbImageUrl(row, v)} alt="" className="h-10 w-20 object-contain rounded-lg bg-gray-800 p-1"/>
        : <div className="h-10 w-20 bg-gray-800 rounded-lg"/>
    },
    { key: 'name',  label: 'نام' },
    { key: 'order', label: 'ترتیب' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">مدیریت شرکا</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          شریک جدید
        </button>
      </div>

      <DataTable columns={columns} data={partners} loading={loading} onEdit={openEdit} onDelete={setDeleteTarget}/>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/70" onClick={() => !saving && setModal(false)}/>
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-5">{editing ? 'ویرایش شریک' : 'شریک جدید'}</h2>
            {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>}
            <div className="space-y-4">
              <ImageUpload label="لوگوی شریک" value={currentPreview()} onChange={setImageFile}/>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">نام</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">ترتیب</label>
                <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" dir="ltr"/>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setModal(false)} disabled={saving}
                className="px-4 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">انصراف</button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60">
                {saving ? 'در حال ذخیره...' : 'ذخیره'}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="حذف شریک"
        message={`شریک "${deleteTarget?.name}" حذف شود؟`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
