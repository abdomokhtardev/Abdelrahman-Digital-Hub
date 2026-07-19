import { useRef, useState } from 'react'
import { inputClass, labelClass } from '../lib/ui'

// دالة مساعدة لضغط الصورة وتحويلها إلى Base64
const compressAndConvertToBase64 = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.onerror = (error) => reject(error)
    }
    reader.onerror = (error) => reject(error)
  })
}

export function ImageUploadField({ id, label, hint, value, onChange, disabled }) {
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
      // ضغط الصورة وتحويلها إلى Base64
      const base64String = await compressAndConvertToBase64(file, 800, 0.7)
      // التحقق من أن حجم النص لا يتجاوز حد معين (مثلاً 700 كيلوبايت)
      // Firestore Document حدها الأقصى 1 ميجابايت (1048576 بايت)
      const sizeInBytes = new Blob([base64String]).size
      if (sizeInBytes > 800000) {
        throw new Error('حجم الصورة بعد الضغط لا يزال كبيراً جداً. يرجى اختيار صورة أصغر.')
      }
      
      onChange(base64String)
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleRemove = () => {
    // لم نعد نحتاج لحذف الصورة من الخادم لأنها مجرد نص
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
