import { useEffect, useState } from 'react'
import { fetchCuratedContent, createCuratedItem, updateCuratedItem, deleteCuratedItem, updateCuratedBulk } from '../../lib/curated'
import { btnPrimary, btnSecondary, cardClass, inputClass, labelClass } from '../../lib/ui'
import { ErrorBanner } from './ErrorBanner'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { InlineConfirm } from '../../components/InlineConfirm'

const emptyCuratedForm = {
  title: '', url: '', type: 'video', comment: '',
}

export function CuratedTab() {
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
    setForm({ title: item.title, url: item.url, type: item.type, comment: item.comment })
    setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyCuratedForm) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      if (editingId) {
        await updateCuratedItem(editingId, { ...form, sortOrder: items.find(i => i.id === editingId)?.sortOrder || 0 })
      } else {
        await createCuratedItem({ ...form, sortOrder: items.length })
      }
      await load(); closeForm()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { 
      setLoading(true)
      await deleteCuratedItem(id)
      await load() 
    } catch (err) { 
      setError(err.message)
      setLoading(false)
    }
  }

  const handleReorder = async (updatedItems) => {
    setItems(updatedItems)
    try {
      await updateCuratedBulk(updatedItems)
    } catch (err) {
      setError('حدث خطأ أثناء تحديث الترتيب: ' + err.message)
      load()
    }
  }

  const dnd = useDragAndDrop({ items: items, onReorder: handleReorder })

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
          <div className="animate-pulse flex flex-col">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex p-4 border-b border-sand-200 dark:border-sand-800 gap-4">
                <div className="h-4 bg-sand-300 dark:bg-sand-700 rounded w-1/2"></div>
                <div className="h-4 bg-sand-300 dark:bg-sand-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
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
                <tr 
                  key={item.id}
                  draggable
                  onDragStart={(e) => dnd.handlers.onDragStart(e, item.id)}
                  onDragEnd={dnd.handlers.onDragEnd}
                  onDragOver={(e) => dnd.handlers.onDragOver(e, item.id)}
                  onDrop={(e) => dnd.handlers.onDrop(e, item.id)}
                  className={`border-b border-sand-100 last:border-0 dark:border-sand-800/50 transition-all cursor-grab active:cursor-grabbing ${
                    dnd.dragOverId === item.id ? 'bg-teal/10 scale-[1.01] shadow-sm' : 'bg-white dark:bg-sand-950'
                  } ${dnd.draggedId === item.id ? 'opacity-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <span className="text-muted opacity-50 mr-2 inline-block" title="اسحب للترتيب">⋮⋮</span>
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
                      <InlineConfirm onConfirm={() => handleDelete(item.id)} />
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
