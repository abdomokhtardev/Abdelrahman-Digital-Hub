import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '../lib/articles'
import { fetchProfile, saveProfile } from '../lib/profile'
import { fetchCuratedContent, createCuratedItem, updateCuratedItem, deleteCuratedItem } from '../lib/curated'
import { fetchSkillCategories, createSkillCategory, updateSkillCategory, deleteSkillCategory, createSkill, updateSkill, deleteSkill, updateSkillsBulk } from '../lib/skills'
import { ImageUploadField } from '../components/ImageUploadField'
import { btnPrimary, btnSecondary, cardClass, inputClass, labelClass } from '../lib/ui'

// ─── Tab definitions ───
const TABS = [
  { id: 'profile', label: '👤 الملف الشخصي' },
  { id: 'articles', label: '📝 المقالات' },
  { id: 'curated', label: '🎯 المحتوى المختار' },
  { id: 'skills', label: '⚙️ المهارات' },
]

// ─── Empty forms ───
const emptyProfileForm = {
  name: '', bio: '', story: '',
  github: '', linkedin: '', instagram: '', youtube: '', facebook: '', telegram: '', whatsapp: '', instapay: '', vodafoneCash: '',
  avatarUrl: '',
}

const emptyArticleForm = {
  title: '', category: '', readTime: '', excerpt: '', content: '', coverImage: '',
}

const emptyCuratedForm = {
  title: '', url: '', type: 'video', comment: '', sortOrder: 0,
}

const emptySkillCategoryForm = {
  name: '', icon: '⚙️', sortOrder: 0,
}

// ─── Helper ───
function ErrorBanner({ error }) {
  if (!error) return null
  return (
    <div className="mb-4 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
      {error}
    </div>
  )
}

function ChangePasswordForm() {
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
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setError(err.message)
    } else {
      setSuccess(true)
      setPassword('')
    }
    setSaving(false)
  }

  return (
    <section className={`${cardClass} p-5 sm:p-6 mt-6`}>
      <h2 className="arabic-divider mb-6 font-kufi text-sm font-semibold text-ink dark:text-sand-100">
        تغيير كلمة المرور
      </h2>
      <ErrorBanner error={error} />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="new-password" className={labelClass}>كلمة المرور الجديدة</label>
          <div className="relative">
            <input
              id="new-password"
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

// ═══════════════════════════════════════
// TAB: Profile
// ═══════════════════════════════════════
function ProfileTab() {
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

// ═══════════════════════════════════════
// TAB: Articles
// ═══════════════════════════════════════
function ArticlesTab() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyArticleForm)

  const load = async () => {
    try { setArticles(await fetchArticles()) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const upd = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const openNew = () => { setEditingId(null); setForm(emptyArticleForm); setShowForm(true) }
  const openEdit = (a) => {
    setEditingId(a.id)
    setForm({ title: a.title, category: a.category, readTime: a.readTime, excerpt: a.excerpt, content: a.content, coverImage: a.coverImage })
    setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyArticleForm) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      if (editingId) await updateArticle(editingId, form)
      else await createArticle(form)
      await load(); closeForm()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return
    try { await deleteArticle(id); await load() } catch (err) { setError(err.message) }
  }

  return (
    <section className="space-y-4">
      <ErrorBanner error={error} />
      {!showForm && (
        <div className="flex justify-end">
          <button type="button" onClick={openNew} className={btnPrimary}>+ مقال جديد</button>
        </div>
      )}

      {showForm && (
        <div className={`${cardClass} p-5 sm:p-6`}>
          <h2 className="mb-4 font-kufi text-sm font-semibold text-ink dark:text-sand-100">
            {editingId ? 'تعديل مقال' : 'مقال جديد'}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="art-title" className={labelClass}>العنوان</label>
              <input id="art-title" type="text" required value={form.title} onChange={upd('title')} className={inputClass} />
            </div>
            <ImageUploadField id="art-cover" label="صورة الغلاف" hint="تظهر في قائمة المقالات وأعلى الصفحة" value={form.coverImage}
              onChange={(url) => setForm((p) => ({ ...p, coverImage: url }))} folder="articles" disabled={saving} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="art-cat" className={labelClass}>التصنيف</label>
                <input id="art-cat" type="text" value={form.category} onChange={upd('category')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="art-time" className={labelClass}>وقت القراءة</label>
                <input id="art-time" type="text" placeholder="5 دقائق" value={form.readTime} onChange={upd('readTime')} className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="art-excerpt" className={labelClass}>المقتطف</label>
              <textarea id="art-excerpt" rows={2} value={form.excerpt} onChange={upd('excerpt')} className={`${inputClass} resize-y`} />
            </div>
            <div>
              <label htmlFor="art-content" className={labelClass}>المحتوى</label>
              <textarea id="art-content" rows={8} value={form.content} onChange={upd('content')} placeholder="فقرة في كل سطر فارغ. للقوائم استخدم - عنصر" className={`${inputClass} resize-y font-mono text-xs`} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={`${btnPrimary} disabled:opacity-50`}>
                {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديل' : 'نشر المقال'}
              </button>
              <button type="button" onClick={closeForm} className={btnSecondary}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-sand-200 dark:border-sand-800">
        {loading ? (
          <p className="p-6 text-center text-sm text-muted animate-pulse">جاري التحميل...</p>
        ) : articles.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted">لا توجد مقالات بعد.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-sand-100 text-muted dark:border-sand-800 dark:bg-sand-900">
                <th className="hidden w-16 px-4 py-3 sm:table-cell">صورة</th>
                <th className="px-4 py-3 text-right font-medium">العنوان</th>
                <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">التصنيف</th>
                <th className="px-4 py-3 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-sand-100 bg-white last:border-0 dark:border-sand-800/50 dark:bg-sand-950">
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {a.coverImage ? <img src={a.coverImage} alt="" className="h-10 w-14 rounded object-cover" /> : <span className="text-xs text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3 text-ink dark:text-sand-200">{a.title}</td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">{a.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEdit(a)} className="rounded px-2 py-1 text-xs text-teal hover:bg-sand-100 dark:text-gold-light dark:hover:bg-sand-800">تعديل</button>
                      <button type="button" onClick={() => handleDelete(a.id)} className="rounded px-2 py-1 text-xs text-terracotta hover:bg-terracotta/10">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════
// TAB: Curated Content
// ═══════════════════════════════════════
function CuratedTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyCuratedForm)

  const load = async () => {
    try { setItems(await fetchCuratedContent()) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const upd = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const openNew = () => { setEditingId(null); setForm(emptyCuratedForm); setShowForm(true) }
  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({ title: item.title, url: item.url, type: item.type, comment: item.comment, sortOrder: item.sortOrder })
    setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyCuratedForm) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      if (editingId) await updateCuratedItem(editingId, form)
      else await createCuratedItem(form)
      await load(); closeForm()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('حذف هذا المحتوى؟')) return
    try { await deleteCuratedItem(id); await load() } catch (err) { setError(err.message) }
  }

  return (
    <section className="space-y-4">
      <ErrorBanner error={error} />
      {!showForm && (
        <div className="flex justify-end">
          <button type="button" onClick={openNew} className={btnPrimary}>+ إضافة محتوى</button>
        </div>
      )}

      {showForm && (
        <div className={`${cardClass} p-5 sm:p-6`}>
          <h2 className="mb-4 font-kufi text-sm font-semibold text-ink dark:text-sand-100">
            {editingId ? 'تعديل المحتوى' : 'محتوى جديد'}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="cur-title" className={labelClass}>العنوان</label>
              <input id="cur-title" type="text" required value={form.title} onChange={upd('title')} className={inputClass} />
            </div>
            <div>
              <label htmlFor="cur-url" className={labelClass}>الرابط</label>
              <input id="cur-url" type="url" dir="ltr" required placeholder="https://..." value={form.url} onChange={upd('url')} className={inputClass} />
            </div>
            <div>
              <label htmlFor="cur-type" className={labelClass}>النوع</label>
              <select id="cur-type" value={form.type} onChange={upd('type')} className={inputClass}>
                <option value="video">🎥 فيديو</option>
                <option value="article">📄 مقالة</option>
              </select>
            </div>
            <div>
              <label htmlFor="cur-comment" className={labelClass}>رأيي (لماذا أنصح به؟)</label>
              <textarea id="cur-comment" rows={3} value={form.comment} onChange={upd('comment')} placeholder="اكتب ما أثّر فيك هذا المحتوى..." className={`${inputClass} resize-y`} />
            </div>
            <div>
              <label htmlFor="cur-order" className={labelClass}>ترتيب العرض</label>
              <input id="cur-order" type="number" min="0" value={form.sortOrder} onChange={upd('sortOrder')} className={inputClass} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={`${btnPrimary} disabled:opacity-50`}>
                {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديل' : 'إضافة'}
              </button>
              <button type="button" onClick={closeForm} className={btnSecondary}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-sand-200 dark:border-sand-800">
        {loading ? (
          <p className="p-6 text-center text-sm text-muted animate-pulse">جاري التحميل...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted">لا يوجد محتوى مختار بعد.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-sand-100 text-muted dark:border-sand-800 dark:bg-sand-900">
                <th className="px-4 py-3 text-right font-medium">العنوان</th>
                <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">النوع</th>
                <th className="px-4 py-3 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-sand-100 bg-white last:border-0 dark:border-sand-800/50 dark:bg-sand-950">
                  <td className="px-4 py-3">
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-ink hover:text-terracotta dark:text-sand-200 dark:hover:text-gold transition-colors">
                      {item.title}
                    </a>
                    {item.comment && <p className="mt-0.5 text-xs text-muted line-clamp-1 font-serif italic">{item.comment}</p>}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.type === 'video' ? 'text-terracotta bg-terracotta/10' : 'text-teal bg-teal/10'}`}>
                      {item.type === 'video' ? '🎥 فيديو' : '📄 مقالة'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEdit(item)} className="rounded px-2 py-1 text-xs text-teal hover:bg-sand-100 dark:text-gold-light dark:hover:bg-sand-800">تعديل</button>
                      <button type="button" onClick={() => handleDelete(item.id)} className="rounded px-2 py-1 text-xs text-terracotta hover:bg-terracotta/10">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════
// TAB: Skills
// ═══════════════════════════════════════
const COMMON_ICONS = ['⚙️', '💻', '🎨', '🛠️', '📱', '🌐', '🗄️', '🧪', '🎬', '✏️', '🔧', '📦', '🚀', '🧠', '🔐']

function SkillsTab() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCatForm, setShowCatForm] = useState(false)
  const [editingCatId, setEditingCatId] = useState(null)
  const [catForm, setCatForm] = useState(emptySkillCategoryForm)
  const [catSaving, setCatSaving] = useState(false)
  // skill adding state: { categoryId, value }
  const [addingSkill, setAddingSkill] = useState(null)
  const [skillName, setSkillName] = useState('')
  const [skillLevel, setSkillLevel] = useState('مبتدئ')
  const [skillSaving, setSkillSaving] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [editSkillName, setEditSkillName] = useState('')
  const [editSkillLevel, setEditSkillLevel] = useState('مبتدئ')
  // DnD state
  const [draggedSkillId, setDraggedSkillId] = useState(null)
  const [dragOverSkillId, setDragOverSkillId] = useState(null)

  const load = async () => {
    try { setCategories(await fetchSkillCategories()) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // Category CRUD
  const openNewCat = () => { setEditingCatId(null); setCatForm(emptySkillCategoryForm); setShowCatForm(true) }
  const openEditCat = (cat) => { setEditingCatId(cat.id); setCatForm({ name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder }); setShowCatForm(true) }
  const closeCatForm = () => { setShowCatForm(false); setEditingCatId(null); setCatForm(emptySkillCategoryForm) }

  const handleCatSubmit = async (e) => {
    e.preventDefault(); setCatSaving(true); setError(null)
    try {
      if (editingCatId) await updateSkillCategory(editingCatId, catForm)
      else await createSkillCategory(catForm)
      await load(); closeCatForm()
    } catch (err) { setError(err.message) } finally { setCatSaving(false) }
  }

  const handleDeleteCat = async (id) => {
    if (!confirm('حذف هذا القسم وكل مهاراته؟')) return
    try { await deleteSkillCategory(id); await load() } catch (err) { setError(err.message) }
  }

  // Skill adding
  const startAddSkill = (catId) => { setAddingSkill(catId); setSkillName(''); setSkillLevel('مبتدئ') }
  const cancelAddSkill = () => { setAddingSkill(null); setSkillName(''); setSkillLevel('مبتدئ') }

  const handleAddSkill = async (categoryId) => {
    if (!skillName.trim()) return
    setSkillSaving(true); setError(null)
    try {
      await createSkill({ categoryId, name: skillName.trim(), level: skillLevel, sortOrder: 0 })
      await load(); cancelAddSkill()
    } catch (err) { setError(err.message) } finally { setSkillSaving(false) }
  }

  const startEditSkill = (skill) => { setEditingSkill(skill.id); setEditSkillName(skill.name); setEditSkillLevel(skill.level) }
  const cancelEditSkill = () => { setEditingSkill(null); setEditSkillName(''); setEditSkillLevel('مبتدئ') }

  const handleUpdateSkill = async (skill) => {
    if (!editSkillName.trim()) return
    setSkillSaving(true); setError(null)
    try {
      await updateSkill(skill.id, { categoryId: skill.categoryId, name: editSkillName.trim(), level: editSkillLevel, sortOrder: skill.sortOrder })
      await load(); cancelEditSkill()
    } catch (err) { setError(err.message) } finally { setSkillSaving(false) }
  }

  const handleDeleteSkill = async (id) => {
    try { await deleteSkill(id); await load() } catch (err) { setError(err.message) }
  }

  // DnD Handlers
  const handleDragStart = (e, skill) => {
    setDraggedSkillId(skill.id)
    e.dataTransfer.effectAllowed = 'move'
    setTimeout(() => { e.target.style.opacity = '0.5' }, 0)
  }
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    setDraggedSkillId(null)
    setDragOverSkillId(null)
  }
  const handleDragOver = (e, skill) => {
    e.preventDefault()
    if (draggedSkillId === skill.id) return
    setDragOverSkillId(skill.id)
  }
  const handleDrop = async (e, catId, targetSkill) => {
    e.preventDefault()
    if (!draggedSkillId || draggedSkillId === targetSkill.id) {
      setDragOverSkillId(null)
      return
    }

    const cat = categories.find(c => c.id === catId)
    const skills = [...cat.skills]
    
    const draggedIdx = skills.findIndex(s => s.id === draggedSkillId)
    const targetIdx = skills.findIndex(s => s.id === targetSkill.id)
    
    const [draggedSkill] = skills.splice(draggedIdx, 1)
    skills.splice(targetIdx, 0, draggedSkill)
    
    const updatedSkills = skills.map((s, idx) => ({ ...s, sortOrder: idx }))
    
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, skills: updatedSkills } : c))
    setDraggedSkillId(null)
    setDragOverSkillId(null)
    
    try {
      await updateSkillsBulk(updatedSkills)
    } catch (err) {
      setError(err.message)
      load()
    }
  }

  return (
    <section className="space-y-4">
      <ErrorBanner error={error} />

      {/* Category Form */}
      {!showCatForm && (
        <div className="flex justify-end">
          <button type="button" onClick={openNewCat} className={btnPrimary}>+ قسم جديد</button>
        </div>
      )}

      {showCatForm && (
        <div className={`${cardClass} p-5 sm:p-6`}>
          <h2 className="mb-4 font-kufi text-sm font-semibold text-ink dark:text-sand-100">
            {editingCatId ? 'تعديل القسم' : 'قسم جديد'}
          </h2>
          <form className="space-y-4" onSubmit={handleCatSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cat-name" className={labelClass}>اسم القسم</label>
                <input id="cat-name" type="text" required placeholder="مثال: Frontend" value={catForm.name}
                  onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label htmlFor="cat-order" className={labelClass}>ترتيب العرض</label>
                <input id="cat-order" type="number" min="0" value={catForm.sortOrder}
                  onChange={(e) => setCatForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} className={inputClass} />
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <p className={labelClass}>أيقونة القسم</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {COMMON_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setCatForm((p) => ({ ...p, icon }))}
                    className={`text-xl w-10 h-10 rounded-xl border transition-all ${catForm.icon === icon ? 'border-gold bg-gold/10 scale-110' : 'border-sand-200 dark:border-sand-800 hover:border-gold/50'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={catSaving} className={`${btnPrimary} disabled:opacity-50`}>
                {catSaving ? 'جاري الحفظ...' : editingCatId ? 'حفظ التعديل' : 'إضافة القسم'}
              </button>
              <button type="button" onClick={closeCatForm} className={btnSecondary}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <p className="text-sm text-muted text-center py-6 animate-pulse">جاري التحميل...</p>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-sand-300 dark:border-sand-800">
          <p className="text-3xl mb-2">⚙️</p>
          <p className="text-sm text-muted font-serif">ابدأ بإضافة قسم جديد للمهارات</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className={`${cardClass} p-5`}>
              {/* Category header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="font-kufi text-base font-bold text-ink dark:text-sand-100">{cat.name}</h3>
                  <span className="text-xs text-muted">({cat.skills.length} مهارة)</span>
                </div>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => openEditCat(cat)} className="rounded px-2 py-1 text-xs text-teal hover:bg-sand-100 dark:text-gold-light dark:hover:bg-sand-800">تعديل</button>
                  <button type="button" onClick={() => handleDeleteCat(cat.id)} className="rounded px-2 py-1 text-xs text-terracotta hover:bg-terracotta/10">حذف القسم</button>
                </div>
              </div>

              {/* Skills Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {cat.skills.map((skill) => (
                  editingSkill === skill.id ? (
                    <div key={skill.id} className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto border border-teal/30 p-2 rounded-xl bg-teal/5">
                      <input
                        type="text"
                        value={editSkillName}
                        onChange={(e) => setEditSkillName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdateSkill(skill) } }}
                        className="rounded-lg border border-teal/30 bg-white/80 px-2 py-1 text-xs text-ink outline-none focus:border-teal dark:bg-sand-900/80 dark:text-sand-100 dark:border-sand-700 min-w-[100px]"
                        autoFocus
                      />
                      <select
                        value={editSkillLevel}
                        onChange={(e) => setEditSkillLevel(e.target.value)}
                        className="rounded-lg border border-teal/30 bg-white/80 px-1.5 py-1 text-xs text-ink outline-none focus:border-teal dark:bg-sand-900/80 dark:text-sand-100 dark:border-sand-700"
                      >
                        <option value="مبتدئ">مبتدئ</option>
                        <option value="متوسط">متوسط</option>
                        <option value="متقدم">متقدم</option>
                        <option value="خبير">خبير</option>
                      </select>
                      <button type="button" onClick={() => handleUpdateSkill(skill)} disabled={skillSaving}
                        className="rounded-lg bg-teal/20 text-teal px-2 py-1 text-xs font-semibold hover:bg-teal/40 disabled:opacity-50">
                        {skillSaving ? '...' : '✓ حفظ'}
                      </button>
                      <button type="button" onClick={cancelEditSkill} className="text-xs text-muted hover:text-terracotta mr-1">✕</button>
                    </div>
                  ) : (
                    <span
                      key={skill.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, skill)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, skill)}
                      onDrop={(e) => handleDrop(e, cat.id, skill)}
                      className={`group flex items-center gap-1 rounded-xl border px-3 py-1 text-xs font-semibold transition-all cursor-grab active:cursor-grabbing ${
                        dragOverSkillId === skill.id
                          ? 'border-teal/50 bg-teal/10 scale-105 shadow-md'
                          : 'border-gold/15 bg-sand-100/80 dark:bg-sand-800/80 text-ink dark:text-sand-100 dark:border-sand-700'
                      } ${draggedSkillId === skill.id ? 'opacity-50' : ''}`}
                    >
                      <span className="text-muted mr-1 opacity-50 group-hover:opacity-100 cursor-grab active:cursor-grabbing" title="اسحب لتغيير الترتيب">⋮⋮</span>
                      {skill.name} <span className="text-[10px] opacity-70 font-normal">({skill.level})</span>
                      <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => startEditSkill(skill)}
                          className="text-teal hover:text-teal-dark font-bold text-[10px] px-1"
                          title="تعديل المهارة"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="text-terracotta hover:text-terracotta-dark font-bold text-[10px] px-1"
                          title="حذف المهارة"
                        >
                          ✕
                        </button>
                      </div>
                    </span>
                  )
                ))}

                {/* Add skill button / inline input */}
                {addingSkill === cat.id ? (
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 w-full sm:w-auto border border-gold/20 p-2 rounded-xl bg-gold/5">
                    <input
                      type="text"
                      placeholder="اسم المهارة"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(cat.id) } }}
                      className="rounded-lg border border-gold/30 bg-white/80 px-2 py-1 text-xs text-ink outline-none focus:border-gold dark:bg-sand-900/80 dark:text-sand-100 dark:border-sand-700 min-w-[100px]"
                      autoFocus
                    />
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="rounded-lg border border-gold/30 bg-white/80 px-1.5 py-1 text-xs text-ink outline-none focus:border-gold dark:bg-sand-900/80 dark:text-sand-100 dark:border-sand-700"
                    >
                      <option value="مبتدئ">مبتدئ</option>
                      <option value="متوسط">متوسط</option>
                      <option value="متقدم">متقدم</option>
                      <option value="خبير">خبير</option>
                    </select>
                    <button type="button" onClick={() => handleAddSkill(cat.id)} disabled={skillSaving}
                      className="rounded-lg bg-gold/20 text-gold px-2 py-1 text-xs font-semibold hover:bg-gold/30 disabled:opacity-50">
                      {skillSaving ? '...' : '✓ إضافة'}
                    </button>
                    <button type="button" onClick={cancelAddSkill} className="text-xs text-muted hover:text-terracotta mr-1">✕</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startAddSkill(cat.id)}
                    className="rounded-xl border border-dashed border-gold/30 px-3 py-1 text-xs text-gold hover:border-gold/60 hover:bg-gold/5 transition-all"
                  >
                    + مهارة
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ═══════════════════════════════════════
// MAIN Dashboard Page
// ═══════════════════════════════════════
function DashboardPage() {
  const [tab, setTab] = useState('profile')
  const navigate = useNavigate()

  return (
    <div className="animate-wind-reveal space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-kufi text-xl font-bold text-ink dark:text-sand-100 sm:text-2xl">
            لوحة التحكم
          </h1>
          <p className="mt-1 font-serif text-sm text-muted dark:text-sand-300">
            إدارة كاملة لمحتوى موقعك الشخصي
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/projects" className={btnSecondary}>
            إدارة المشاريع ←
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              navigate('/login')
            }}
            className="rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-2.5 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-white"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 flex-wrap rounded-xl border border-sand-200/80 bg-sand-100/50 p-1 dark:border-sand-800/80 dark:bg-sand-900/40">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            id={`dashboard-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[5rem] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
              tab === t.id
                ? 'bg-white text-terracotta shadow-sm dark:bg-sand-800 dark:text-gold border border-gold/10'
                : 'text-muted hover:text-ink dark:hover:text-sand-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'profile' && <ProfileTab />}
      {tab === 'articles' && <ArticlesTab />}
      {tab === 'curated' && <CuratedTab />}
      {tab === 'skills' && <SkillsTab />}
    </div>
  )
}

export default DashboardPage
