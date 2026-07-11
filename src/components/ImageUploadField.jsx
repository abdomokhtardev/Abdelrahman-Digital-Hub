import { useRef, useState } from 'react'
import { uploadImage, deleteImage } from '../lib/storage'
import { inputClass, labelClass } from '../lib/ui'

export function ImageUploadField({ id, label, hint, value, onChange, folder, disabled }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [mode, setMode] = useState('upload') // 'upload' | 'url'

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)
    try {
      onChange(await uploadImage(file, folder))
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleRemove = async () => {
    if (value && value.includes('supabase.co')) {
      setUploading(true)
      await deleteImage(value)
      setUploading(false)
    }
    onChange('')
  }

  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {hint && <p className="mb-2 text-xs text-muted">{hint}</p>}

      {value && (
        <div className="relative mb-3 overflow-hidden rounded-xl border border-sand-200 dark:border-sand-700">
          <img src={value} alt="" className="h-36 w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || uploading}
            className="absolute left-2 top-2 rounded bg-ink/70 px-2 py-1 text-xs text-white hover:bg-ink disabled:opacity-50"
          >
            إزالة
          </button>
        </div>
      )}

      {!value && (
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${mode === 'upload' ? 'bg-sand-200 text-ink dark:bg-sand-800 dark:text-sand-100' : 'text-muted hover:bg-sand-100 dark:hover:bg-sand-900'}`}
          >
            رفع ملف
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${mode === 'url' ? 'bg-sand-200 text-ink dark:bg-sand-800 dark:text-sand-100' : 'text-muted hover:bg-sand-100 dark:hover:bg-sand-900'}`}
          >
            رابط مباشر
          </button>
        </div>
      )}

      {!value && mode === 'upload' && (
        <>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} disabled={disabled || uploading} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={disabled || uploading}
            className="w-full flex items-center justify-center border-2 border-dashed border-sand-300 rounded-xl py-6 text-sm text-muted hover:border-gold hover:bg-sand-50 transition-colors disabled:opacity-50 dark:border-sand-700 dark:hover:bg-sand-900/50"
          >
            {uploading ? 'جاري الرفع...' : 'اضغط لاختيار صورة من جهازك'}
          </button>
        </>
      )}

      {!value && mode === 'url' && (
        <input
          id={id}
          type="url"
          dir="ltr"
          placeholder="https://example.com/image.jpg"
          value={value}
          onChange={(e) => { setUploadError(null); onChange(e.target.value) }}
          disabled={disabled || uploading}
          className={inputClass}
        />
      )}

      {uploadError && <p className="mt-1.5 text-xs text-terracotta">{uploadError}</p>}
    </div>
  )
}
