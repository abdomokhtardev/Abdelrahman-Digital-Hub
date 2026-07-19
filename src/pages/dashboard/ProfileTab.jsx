import { useEffect, useState } from 'react'
import { fetchProfile, saveProfile } from '../../lib/profile'
import { ImageUploadField } from '../../components/ImageUploadField'
import { btnPrimary, cardClass, inputClass, labelClass } from '../../lib/ui'
import { ErrorBanner } from './ErrorBanner'
import { ChangePasswordForm } from './ChangePasswordForm'

const emptyProfileForm = {
  name: '', bio: '', story: '',
  github: '', linkedin: '', instagram: '', youtube: '', facebook: '', telegram: '', whatsapp: '', instapay: '', vodafoneCash: '',
  avatarUrl: '',
}

export function ProfileTab() {
  const [profileId, setProfileId] = useState(null)
  const [form, setForm] = useState(emptyProfileForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        if (data) {
          setProfileId(data.id)
          setForm({
            name: data.name, bio: data.bio, story: data.story,
            github: data.github, linkedin: data.linkedin, instagram: data.instagram,
            youtube: data.youtube, facebook: data.facebook, telegram: data.telegram,
            whatsapp: data.whatsapp, instapay: data.instapay, vodafoneCash: data.vodafoneCash, avatarUrl: data.avatarUrl,
          })
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const upd = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError(null)
    try {
      const saved = await saveProfile({ id: profileId, ...form })
      setProfileId(saved.id)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-muted py-6 text-center animate-pulse">جاري تحميل البيانات...</p>

  const fieldRow = (id, label, props) => (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input id={id} {...props} className={inputClass} />
    </div>
  )

  return (
    <>
      <section className={`${cardClass} p-5 sm:p-6`}>
        <h2 className="arabic-divider mb-6 font-kufi text-sm font-semibold text-ink dark:text-sand-100">
          معلومات الملف الشخصي
        </h2>
        <ErrorBanner error={error} />
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Avatar */}
          <ImageUploadField
            id="profile-avatar"
            label="الصورة الشخصية"
            hint="تظهر في الصفحة الرئيسية وصفحة عنّي"
            value={form.avatarUrl}
            onChange={(url) => setForm((prev) => ({ ...prev, avatarUrl: url }))}
            folder="profile"
            disabled={saving}
          />

          {/* Name & Bio */}
          {fieldRow('profile-name', 'الاسم', { type: 'text', required: true, value: form.name, onChange: upd('name') })}
          <div>
            <label htmlFor="profile-bio" className={labelClass}>النبذة المختصرة</label>
            <input id="profile-bio" type="text" value={form.bio} onChange={upd('bio')} className={inputClass} placeholder="جملة تعريفية تظهر في الصفحة الرئيسية" />
          </div>

          {/* Story */}
          <div>
            <label htmlFor="profile-story" className={labelClass}>قصتي (تظهر في صفحة عنّي)</label>
            <textarea
              id="profile-story"
              rows={6}
              value={form.story}
              onChange={upd('story')}
              placeholder="اكتب قصتك وبدايتك وشغفك..."
              className={`${inputClass} resize-y`}
            />
          </div>

          {/* Divider */}
          <div className="arabic-divider pt-2">
            <span className="text-xs font-semibold text-muted">روابط التواصل الاجتماعي</span>
          </div>

          {/* Social Fields Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {fieldRow('profile-github', 'GitHub', { type: 'url', dir: 'ltr', placeholder: 'https://github.com/...', value: form.github, onChange: upd('github') })}
            {fieldRow('profile-linkedin', 'LinkedIn', { type: 'url', dir: 'ltr', placeholder: 'https://linkedin.com/in/...', value: form.linkedin, onChange: upd('linkedin') })}
            {fieldRow('profile-instagram', 'Instagram', { type: 'url', dir: 'ltr', placeholder: 'https://instagram.com/...', value: form.instagram, onChange: upd('instagram') })}
            {fieldRow('profile-youtube', 'YouTube', { type: 'url', dir: 'ltr', placeholder: 'https://youtube.com/...', value: form.youtube, onChange: upd('youtube') })}
            {fieldRow('profile-facebook', 'Facebook', { type: 'url', dir: 'ltr', placeholder: 'https://facebook.com/...', value: form.facebook, onChange: upd('facebook') })}
            {fieldRow('profile-telegram', 'Telegram', { type: 'url', dir: 'ltr', placeholder: 'https://t.me/...', value: form.telegram, onChange: upd('telegram') })}
            {fieldRow('profile-whatsapp', 'WhatsApp', { type: 'text', dir: 'ltr', placeholder: '+201234567890', value: form.whatsapp, onChange: upd('whatsapp') })}
          </div>

          {/* Divider */}
          <div className="arabic-divider pt-2">
            <span className="text-xs font-semibold text-muted">بيانات الدعم</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {fieldRow('profile-instapay', 'انستاباي (يوزر او رابط)', { type: 'text', dir: 'ltr', placeholder: 'user@instapay', value: form.instapay, onChange: upd('instapay') })}
            {fieldRow('profile-vodafone', 'فودافون كاش (رقم)', { type: 'text', dir: 'ltr', placeholder: '01xxxxxxxxx', value: form.vodafoneCash, onChange: upd('vodafoneCash') })}
          </div>

          {success && (
            <p className="text-sm text-teal dark:text-gold-light">✓ تم حفظ الملف الشخصي بنجاح</p>
          )}

          <button type="submit" disabled={saving} className={`${btnPrimary} disabled:opacity-50`}>
            {saving ? 'جاري الحفظ...' : 'حفظ الملف الشخصي'}
          </button>
        </form>
      </section>

      <ChangePasswordForm />
    </>
  )
}
