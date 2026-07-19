import { useState } from 'react'
import { auth } from '../../firebaseClient'
import { updatePassword } from 'firebase/auth'
import { btnSecondary, cardClass, inputClass, labelClass } from '../../lib/ui'

function ErrorBanner({ error }) {
  if (!error) return null
  return (
    <div className="mb-4 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
      {error}
    </div>
  )
}

export function ChangePasswordForm() {
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(false)
    
    try {
      if (!auth.currentUser) throw new Error('يرجى تسجيل الدخول أولاً')
      await updatePassword(auth.currentUser, password)
      setSuccess(true)
      setPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className={`${cardClass} p-5 sm:p-6 mt-6`}>
      <h2 className="arabic-divider mb-6 font-kufi text-sm font-semibold text-ink dark:text-sand-100">
        تغيير كلمة المرور
      </h2>
      <ErrorBanner error={error} />
      <form method="post" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="new-password" className={labelClass}>كلمة المرور الجديدة</label>
          <div className="relative">
            <input
              id="new-password"
              name="new-password"
              autoComplete="new-password"
              minLength={6}
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-sand-100 text-xs font-semibold px-2 py-1 transition-colors bg-white/50 dark:bg-sand-900/50 rounded"
              tabIndex="-1"
            >
              {showPassword ? 'إخفاء' : 'إظهار'}
            </button>
          </div>
        </div>
        {success && <p className="text-sm text-teal dark:text-gold-light">✓ تم تحديث كلمة المرور بنجاح</p>}
        <button type="submit" disabled={saving} className={`${btnSecondary} disabled:opacity-50`}>
          {saving ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
        </button>
      </form>
    </section>
  )
}
