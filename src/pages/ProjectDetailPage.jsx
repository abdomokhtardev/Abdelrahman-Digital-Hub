import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProjectById } from '../lib/projects'
import { ProjectPage } from './ProjectPage'

function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjectById(id)
      .then(setProject)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-center text-sm text-muted">جاري تحميل المشروع...</p>

  if (error || !project) {
    return (
      <div className="text-center">
        <p className="mb-4 text-sm text-terracotta">{error || 'المشروع غير موجود'}</p>
        <button type="button" onClick={() => navigate('/projects')} className="text-sm text-muted hover:text-terracotta">
          → العودة للمشاريع
        </button>
      </div>
    )
  }

  return <ProjectPage project={project} onBack={() => navigate('/projects')} />
}

export default ProjectDetailPage
