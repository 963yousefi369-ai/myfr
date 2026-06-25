import React, { useRef, useState } from 'react'

export default function ImageUpload({ label = 'آپلود تصویر', value, onChange, accept = 'image/*', multiple = false }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)

  function handleFile(e) {
    const files = e.target.files
    if (!files || files.length === 0) return
    if (multiple) {
      onChange(Array.from(files))
      const urls = Array.from(files).map(f => URL.createObjectURL(f))
      setPreview(urls)
    } else {
      const file = files[0]
      onChange(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const currentPreview = preview || (value && typeof value === 'string' ? value : null)

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors group"
      >
        {currentPreview ? (
          multiple && Array.isArray(currentPreview) ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {currentPreview.map((url, i) => (
                <img key={i} src={url} alt="" className="h-20 w-20 object-cover rounded-lg"/>
              ))}
            </div>
          ) : (
            <img src={currentPreview} alt="preview" className="h-32 object-contain mx-auto rounded-lg"/>
          )
        ) : (
          <div className="py-6 text-gray-500 group-hover:text-indigo-400 transition-colors">
            <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p className="text-sm">کلیک کنید یا تصویر را بکشید</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
