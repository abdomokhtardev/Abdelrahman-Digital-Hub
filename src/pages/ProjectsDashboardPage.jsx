import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  updateProjectsBulk
} from '../lib/projects'
import { ImageUploadField } from '../components/ImageUploadField'
import { btnPrimary, btnSecondary, cardClass, inputClass, labelClass } from '../lib/ui'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import { InlineConfirm } from '../components/InlineConfirm'

const emptyForm = {
  title: '',
  shortDesc: '',
  description: '',
  problem: '',
  solution: '',
  imageUrl: '',
  projectUrl: '',
  githubUrl: '',
  techStack: '',
}

function parseTechStack(value) {
  return [...new Set(value.split(',').map((s) => s.trim()).filter(Boolean))]
}

function ProjectsDashboardPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // DnD state
  const [draggedId, setDraggedId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  const loadProjects = async () => {
    try {
      setError(null)
      setProjects(await fetchProjects())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (project) => {
    setEditingId(project.id)
    setForm({
      title: project.title,
      shortDesc: project.shortDesc,
      description: project.description,
      problem: project.problem,
      solution: project.solution,
      imageUrl: project.imageUrl,
      projectUrl: project.projectUrl,
      githubUrl: project.githubUrl,
      techStack: project.techStack.join(', '),
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (editingId) {
        const payload = {
          title: form.title,
          shortDesc: form.shortDesc,
          description: form.description,
          problem: form.problem,
          solution: form.solution,
          imageUrl: form.imageUrl,
          projectUrl: form.projectUrl,
          githubUrl: form.githubUrl,
          techStack: parseTechStack(form.techStack),
          sortOrder: projects.find(p => p.id === editingId)?.sortOrder || 0,
        }
        await updateProject(editingId, payload)
      } else {
        const payload = {
          title: form.title,
          shortDesc: form.shortDesc,
          description: form.description,
          problem: form.problem,
          solution: form.solution,
          imageUrl: form.imageUrl,
          projectUrl: form.projectUrl,
          githubUrl: form.githubUrl,
          techStack: parseTechStack(form.techStack),
          sortOrder: projects.length,
        }
        await createProject(payload)
      }
      await loadProjects()
      closeForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProject(id)
      await loadProjects()
    } catch (err) {
      setError(err.message)
    }
  }

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleReorder = async (updatedItems) => {
    setProjects(updatedItems)
    try {
      await updateProjectsBulk(updatedItems)
    } catch (err) {
      setError('حدث خطأ أثناء تحديث الترتيب: ' + err.message)
      loadProjects()
    }
  }

  const dnd = useDragAndDrop({ items: projects, onReorder: handleReorder })

  return (
    <div className="animate-wind-reveal">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-kufi text-xl font-bold text-ink dark:text-sand-100 sm:text-2xl">إدارة المشاريع</h1>
          <p className="mt-1 font-serif text-sm text-muted dark:text-sand-300">إضافة وتعديل وحذف مشاريعك البرمجية</p>
        </div>
        <Link to="/dashboard" className={btnSecondary}>
          → العودة للوحة التحكم
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </div>
      )}

      {!showForm && (
        <div className="mb-4 flex justify-end">
          <button type="button" onClick={openNew} className={btnPrimary}>
            + مشروع جديد
          </button>
        </div>
      )}

      {showForm && (
        <div className={`${cardClass} mb-6 p-5 sm:p-6`}>
          <h2 className="arabic-divider mb-4 font-kufi text-sm font-semibold text-ink dark:text-sand-100">
            {editingId ? 'تعديل مشروع' : 'مشروع جديد'}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="project-title" className={labelClass}>عنوان المشروع</label>
              <input id="project-title" type="text" required value={form.title} onChange={updateField('title')} className={inputClass} />
            </div>

            <div>
              <label htmlFor="project-short-desc" className={labelClass}>وصف مختصر (للبطاقة)</label>
              <input id="project-short-desc" type="text" placeholder="جملة أو جملتان تظهر في بطاقة المشروع" value={form.shortDesc} onChange={updateField('shortDesc')} className={inputClass} />
            </div>

            <div>
              <label htmlFor="project-description" className={labelClass}>وصف المشروع</label>
              <textarea id="project-description" rows={3} placeholder="وصف عام للمشروع..." value={form.description} onChange={updateField('description')} className={`${inputClass} resize-y`} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border border-gold/20 p-4 rounded-xl bg-gold/5">
              <div className="sm:col-span-2">
                <p className="text-xs font-bold text-gold mb-2">✦ المشكلة والحل (اختياري)</p>
              </div>
              <div>
                <label htmlFor="project-problem" className={labelClass}>المشكلة</label>
                <textarea id="project-problem" rows={4} placeholder="ما المشكلة التي يحلها المشروع؟" value={form.problem} onChange={updateField('problem')} className={`${inputClass} resize-y`} />
              </div>
              <div>
                <label htmlFor="project-solution" className={labelClass}>الحل</label>
                <textarea id="project-solution" rows={4} placeholder="كيف قمت بحلها؟" value={form.solution} onChange={updateField('solution')} className={`${inputClass} resize-y`} />
              </div>
            </div>

            <ImageUploadField
              id="project-image"
              label="صورة المشروع"
              hint="تظهر في بطاقة المشروع بالصفحة الرئيسية"
              value={form.imageUrl}
              onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
              folder="projects"
              disabled={saving}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="project-url" className={labelClass}>رابط Live Demo</label>
                <input id="project-url" type="url" dir="ltr" placeholder="https://..." value={form.projectUrl} onChange={updateField('projectUrl')} className={inputClass} />
              </div>
              <div>
                <label htmlFor="project-github" className={labelClass}>رابط GitHub</label>
                <input id="project-github" type="url" dir="ltr" placeholder="https://github.com/..." value={form.githubUrl} onChange={updateField('githubUrl')} className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="project-tech" className={labelClass}>التقنيات المستخدمة</label>
              <input id="project-tech" type="text" placeholder="React, Firebase, Tailwind" value={form.techStack} onChange={updateField('techStack')} className={inputClass} />
              <p className="mt-1 text-xs text-muted">افصل بين التقنيات بفاصلة</p>
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={`${btnPrimary} disabled:opacity-50`}>
                {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديل' : 'إضافة المشروع'}
              </button>
              <button type="button" onClick={closeForm} className={btnSecondary}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-sand-200 dark:border-sand-800">
        {loading ? (
          <p className="p-6 text-center text-sm text-muted animate-pulse">جاري تحميل المشاريع...</p>
        ) : projects.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted">لا توجد مشاريع بعد.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-sand-100 text-muted dark:border-sand-800 dark:bg-sand-900">
                <th className="hidden w-16 px-4 py-3 sm:table-cell">صورة</th>
                <th className="px-4 py-3 text-right font-medium">المشروع</th>
                <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">التقنيات</th>
                <th className="px-4 py-3 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr 
                  key={project.id}
                  draggable
                  onDragStart={(e) => dnd.handlers.onDragStart(e, project.id)}
                  onDragEnd={dnd.handlers.onDragEnd}
                  onDragOver={(e) => dnd.handlers.onDragOver(e, project.id)}
                  onDrop={(e) => dnd.handlers.onDrop(e, project.id)}
                  className={`border-b border-sand-100 last:border-0 dark:border-sand-800/50 transition-all cursor-grab active:cursor-grabbing ${
                    dnd.dragOverId === project.id ? 'bg-teal/10 scale-[1.01] shadow-sm' : 'bg-white dark:bg-sand-950'
                  } ${dnd.draggedId === project.id ? 'opacity-50' : ''}`}
                >
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt="" className="h-10 w-14 rounded object-cover" />
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink dark:text-sand-200">
                    <span className="text-muted opacity-50 mr-2 inline-block" title="اسحب للترتيب">⋮⋮</span>
                    {project.title}
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">
                    {project.techStack.join(' · ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEdit(project)} className="rounded px-2 py-1 text-xs text-teal hover:bg-sand-100 dark:text-gold-light dark:hover:bg-sand-800">
                        تعديل
                      </button>
                      <InlineConfirm onConfirm={() => handleDelete(project.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ProjectsDashboardPage
