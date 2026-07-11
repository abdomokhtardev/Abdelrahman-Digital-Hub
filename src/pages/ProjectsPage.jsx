import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { fetchProjects } from '../lib/projects'

function ProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8 animate-wind-reveal">
      <header className="arabic-divider mb-4">
        <h1 className="font-kufi text-2xl font-bold text-ink dark:text-sand-100 sm:text-3xl">المشاريع</h1>
        <p className="mt-2 font-serif text-sm text-muted dark:text-sand-300">معرضٌ لأبرز الأعمال والحلول البرمجية التي نسجتها الأكواد</p>
      </header>

      {loading ? (
        <p className="text-center text-sm text-muted py-12 animate-pulse">جاري جلب تفاصيل المعرض...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-sand-300 dark:border-sand-800">
          <p className="font-serif text-base text-muted">لا توجد مشاريع منشورة في الوقت الحالي.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/projects/${project.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectsPage
