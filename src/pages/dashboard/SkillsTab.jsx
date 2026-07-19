import { useEffect, useState } from 'react'
import { fetchSkillCategories, createSkillCategory, updateSkillCategory, deleteSkillCategory, createSkill, updateSkill, deleteSkill, updateSkillsBulk, updateSkillCategoriesBulk } from '../../lib/skills'
import { btnPrimary, btnSecondary, cardClass, inputClass, labelClass } from '../../lib/ui'
import { ErrorBanner } from './ErrorBanner'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { InlineConfirm } from '../../components/InlineConfirm'

const emptySkillCategoryForm = {
  name: '', icon: '⚙️',
}
const COMMON_ICONS = ['⚙️', '💻', '🎨', '🛠️', '📱', '🌐', '🗄️', '🧪', '🎬', '✏️', '🔧', '📦', '🚀', '🧠', '🔐']

export function SkillsTab() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCatForm, setShowCatForm] = useState(false)
  const [editingCatId, setEditingCatId] = useState(null)
  const [catForm, setCatForm] = useState(emptySkillCategoryForm)
  const [catSaving, setCatSaving] = useState(false)
  const [addingSkill, setAddingSkill] = useState(null)
  const [skillName, setSkillName] = useState('')
  const [skillLevel, setSkillLevel] = useState('مبتدئ')
  const [skillSaving, setSkillSaving] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [editSkillName, setEditSkillName] = useState('')
  const [editSkillLevel, setEditSkillLevel] = useState('مبتدئ')
  
  // Skill DnD State
  const [draggedSkillId, setDraggedSkillId] = useState(null)
  const [dragOverSkillId, setDragOverSkillId] = useState(null)



  const load = async () => {
    try { setCategories(await fetchSkillCategories()) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openNewCat = () => { setEditingCatId(null); setCatForm(emptySkillCategoryForm); setShowCatForm(true) }
  const openEditCat = (cat) => { setEditingCatId(cat.id); setCatForm({ name: cat.name, icon: cat.icon }); setShowCatForm(true) }
  const closeCatForm = () => { setShowCatForm(false); setEditingCatId(null); setCatForm(emptySkillCategoryForm) }

  const handleCatSubmit = async (e) => {
    e.preventDefault(); setCatSaving(true); setError(null)
    try {
      if (editingCatId) {
        await updateSkillCategory(editingCatId, { ...catForm, sortOrder: categories.find(c => c.id === editingCatId)?.sortOrder || 0 })
      } else {
        await createSkillCategory({ ...catForm, sortOrder: categories.length })
      }
      await load(); closeCatForm()
    } catch (err) { setError(err.message) } finally { setCatSaving(false) }
  }

  const handleDeleteCat = async (id) => {
    try { await deleteSkillCategory(id); await load() } catch (err) { setError(err.message) }
  }

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

  // Skill DnD Handlers
  const handleDragStart = (e, skill) => {
    e.stopPropagation()
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
    e.stopPropagation()
    if (draggedSkillId === skill.id) return
    setDragOverSkillId(skill.id)
  }
  const handleDrop = async (e, catId, targetSkill) => {
    e.preventDefault()
    e.stopPropagation()
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

  const handleCatReorder = async (updatedCats) => {
    setCategories(updatedCats)
    try {
      await updateSkillCategoriesBulk(updatedCats)
    } catch (err) {
      setError('حدث خطأ أثناء تحديث الترتيب: ' + err.message)
      load()
    }
  }

  const catDnd = useDragAndDrop({ items: categories, onReorder: handleCatReorder })

  return (
    <section className="space-y-4">
      <ErrorBanner error={error} />

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
            <div>
              <label htmlFor="cat-name" className={labelClass}>اسم القسم</label>
              <input id="cat-name" type="text" required placeholder="مثال: Frontend" value={catForm.name}
                onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
            </div>

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
            <div 
              key={cat.id} 
              draggable
              onDragStart={(e) => catDnd.handlers.onDragStart(e, cat.id)}
              onDragEnd={catDnd.handlers.onDragEnd}
              onDragOver={(e) => catDnd.handlers.onDragOver(e, cat.id)}
              onDrop={(e) => catDnd.handlers.onDrop(e, cat.id)}
              className={`${cardClass} p-5 cursor-grab active:cursor-grabbing transition-all ${
                catDnd.dragOverId === cat.id ? 'border-teal/50 bg-teal/5 scale-[1.01] shadow-md' : ''
              } ${catDnd.draggedId === cat.id ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-muted opacity-50 mr-2 inline-block cursor-grab active:cursor-grabbing" title="اسحب لترتيب القسم">⋮⋮</span>
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="font-kufi text-base font-bold text-ink dark:text-sand-100">{cat.name}</h3>
                  <span className="text-xs text-muted">({cat.skills.length} مهارة)</span>
                </div>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => openEditCat(cat)} className="rounded px-2 py-1 text-xs text-teal hover:bg-sand-100 dark:text-gold-light dark:hover:bg-sand-800">تعديل</button>
                  <InlineConfirm onConfirm={() => handleDeleteCat(cat.id)} confirmText="حذف القسم ومهاراته؟">حذف القسم</InlineConfirm>
                </div>
              </div>

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
                      className={`group flex items-center gap-1 rounded-xl border px-3 py-1 text-xs font-semibold transition-all cursor-grab active:cursor-grabbing ${dragOverSkillId === skill.id
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
                        <InlineConfirm 
                          onConfirm={() => handleDeleteSkill(skill.id)}
                          buttonClass="text-terracotta hover:text-terracotta-dark font-bold text-[10px] px-1"
                          confirmText="متأكد؟"
                        >
                          ✕
                        </InlineConfirm>
                      </div>
                    </span>
                  )
                ))}

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
