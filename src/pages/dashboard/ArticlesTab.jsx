import { useEffect, useState } from 'react'
import { fetchArticles, createArticle, updateArticle, deleteArticle, updateArticlesBulk } from '../../lib/articles'
import { ImageUploadField } from '../../components/ImageUploadField'
import { btnPrimary, btnSecondary, cardClass, inputClass, labelClass } from '../../lib/ui'
import { ErrorBanner } from './ErrorBanner'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { InlineConfirm } from '../../components/InlineConfirm'

const emptyArticleForm = {
  title: '', category: '', readTime: '', excerpt: '', content: '', coverImage: '',
}

export function ArticlesTab() {
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
      if (editingId) {
        await updateArticle(editingId, { ...form, sortOrder: articles.find(a => a.id === editingId)?.sortOrder || 0 })
      } else {
        await createArticle({ ...form, sortOrder: articles.length })
      }
      await load(); closeForm()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { 
      setLoading(true)
      await deleteArticle(id)
      await load() 
    } catch (err) { 
      setError(err.message)
      setLoading(false)
    }
  }

  const handleReorder = async (updatedItems) => {
    setArticles(updatedItems)
    try {
      await updateArticlesBulk(updatedItems)
    } catch (err) {
      setError('حدث خطأ أثناء تحديث الترتيب: ' + err.message)
      load()
    }
  }

  const dnd = useDragAndDrop({ items: articles, onReorder: handleReorder })

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
          <div className="animate-pulse flex flex-col">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex p-4 border-b border-sand-200 dark:border-sand-800 gap-4">
                <div className="h-10 w-14 bg-sand-300 dark:bg-sand-700 rounded"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-sand-300 dark:bg-sand-700 rounded w-3/4"></div>
                  <div className="h-3 bg-sand-300 dark:bg-sand-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
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
                <tr 
                  key={a.id} 
                  draggable
                  onDragStart={(e) => dnd.handlers.onDragStart(e, a.id)}
                  onDragEnd={dnd.handlers.onDragEnd}
                  onDragOver={(e) => dnd.handlers.onDragOver(e, a.id)}
                  onDrop={(e) => dnd.handlers.onDrop(e, a.id)}
                  className={`border-b border-sand-100 last:border-0 dark:border-sand-800/50 transition-all cursor-grab active:cursor-grabbing ${
                    dnd.dragOverId === a.id ? 'bg-teal/10 scale-[1.01] shadow-sm' : 'bg-white dark:bg-sand-950'
                  } ${dnd.draggedId === a.id ? 'opacity-50' : ''}`}
                >
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {a.coverImage ? <img src={a.coverImage} alt="" className="h-10 w-14 rounded object-cover" /> : <span className="text-xs text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3 text-ink dark:text-sand-200">
                    <span className="text-muted opacity-50 mr-2 inline-block" title="اسحب للترتيب">⋮⋮</span>
                    {a.title}
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">{a.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEdit(a)} className="rounded px-2 py-1 text-xs text-teal hover:bg-sand-100 dark:text-gold-light dark:hover:bg-sand-800">تعديل</button>
                      <InlineConfirm onConfirm={() => handleDelete(a.id)} />
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
