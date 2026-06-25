import React, { useEffect, useState } from 'react'
import { pb, pbImageUrl } from '../../api/pocketbase.js'
import ImageUpload from '../../components/admin/ImageUpload.jsx'
import ConfirmModal from '../../components/admin/ConfirmModal.jsx'

export default function AdminProductsUI() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [productId, setProductId] = useState('')
  const [searchId, setSearchId] = useState('')

  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [featuresJson, setFeaturesJson] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteImg, setDeleteImg] = useState(null) // { record, filename }
  const [deletingImg, setDeletingImg] = useState(false)

  async function load(pid) {
    setLoading(true)
    try {
      let filter = ''
      if (pid) filter = `product_id = "${pid}"`
      const data = await pb.collection('products_ui').getFullList({
        filter,
        sort: 'product_id',
      })
      setRecords(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { load('') }, [])

  function handleSearch(e) {
    e.preventDefault()
    setSearchId(productId)
    load(productId)
  }

  function openAdd() {
    setEditing(null)
    setImageFiles([])
    setFeaturesJson('')
    setError('')
    setModal(true)
  }

  function openEdit(row) {
    setEditing(row)
    setImageFiles([])
    setFeaturesJson(row.features ? JSON.stringify(row.features, null, 2) : '')
    setError('')
    setModal(true)
  }

  async function handleSave() {
    setError('')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('product_id', editing ? editing.product_id : productId)
      if (featuresJson.trim()) {
        JSON.parse(featuresJson) // validate JSON
        fd.append('features', featuresJson)
      }
      for (const f of imageFiles) {
        fd.append('images', f)
      }
      if (editing) {
        await pb.collection('products_ui').update(editing.id, fd)
      } else {
        await pb.collection('products_ui').create(fd)
      }
      setModal(false)
      load(searchId)
    } catch (e) {
      setError(e.message || 'خطا در ذخیره — JSON را چک کنید')
    }
    setSaving(false)
  }

  async function handleDeleteImage() {
    if (!deleteImg) return
    setDeletingImg(true)
    try {
      const current = deleteImg.record.images || []
      const updated = current.filter(f => f !== deleteImg.filename)
      await pb.collection('products_ui').update(deleteImg.record.id, { images: updated })
      setDeleteImg(null)
      load(searchId)
    } catch (e) {
      console.error(e)
    }
    setDeletingImg(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">مدیریت تصاویر محصولات</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          افزودن
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="number"
          value={productId}
          onChange={e => setProductId(e.target.value)}
          placeholder="فیلتر بر اساس Product ID"
          className="flex-1 max-w-xs bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          dir="ltr"
        />
        <button type="submit" className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-xl transition-colors">
          فیلتر
        </button>
        <button type="button" onClick={() => { setProductId(''); setSearchId(''); load('') }}
          className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm rounded-xl transition-colors">
          همه
        </button>
      </form>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">هیچ رکوردی یافت نشد</div>
      ) : (
        <div className="space-y-4">
          {records.map(row => (
            <div key={row.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Product ID</span>
                  <p className="text-lg font-bold text-white" dir="ltr">{row.product_id}</p>
                </div>
                <button
                  onClick={() => openEdit(row)}
                  className="px-3 py-1.5 text-xs bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/40 transition-colors"
                >
                  ویرایش
                </button>
              </div>

              {/* Images */}
              <div className="flex flex-wrap gap-3 mb-4">
                {(row.images || []).map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={pbImageUrl(row, img)}
                      alt={`img-${i}`}
                      className="h-20 w-20 object-cover rounded-xl bg-gray-800"
                    />
                    <button
                      onClick={() => setDeleteImg({ record: row, filename: img })}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-red-500 rounded-full text-white
                                 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ))}
                {(!row.images || row.images.length === 0) && (
                  <span className="text-xs text-gray-600">بدون تصویر</span>
                )}
              </div>

              {/* Features */}
              {row.features && (
                <details className="text-xs">
                  <summary className="text-gray-500 cursor-pointer hover:text-gray-300">ویژگی‌ها (JSON)</summary>
                  <pre className="mt-2 bg-gray-800 rounded-lg p-3 text-gray-400 overflow-x-auto" dir="ltr">
                    {JSON.stringify(row.features, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/70" onClick={() => !saving && setModal(false)}/>
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-5">{editing ? `ویرایش محصول #${editing.product_id}` : 'افزودن محصول UI'}</h2>

            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <div className="space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Product ID (از Django)</label>
                  <input
                    type="number"
                    value={productId}
                    onChange={e => setProductId(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    dir="ltr"
                  />
                </div>
              )}

              <ImageUpload
                label="آپلود تصاویر (می‌توانید چند تصویر انتخاب کنید)"
                onChange={setImageFiles}
                multiple
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">ویژگی‌ها (JSON)</label>
                <textarea
                  value={featuresJson}
                  onChange={e => setFeaturesJson(e.target.value)}
                  rows={6}
                  placeholder='{"weight": "250g", "battery": "5000mAh"}'
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setModal(false)} disabled={saving}
                className="px-4 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                انصراف
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60">
                {saving ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteImg}
        title="حذف تصویر"
        message="این تصویر از محصول حذف شود؟"
        onConfirm={handleDeleteImage}
        onCancel={() => setDeleteImg(null)}
        loading={deletingImg}
      />
    </div>
  )
}
