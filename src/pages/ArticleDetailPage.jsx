import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchArticleById } from '../lib/articles'
import { ArticlePage } from './ArticlePage'

function ArticleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchArticleById(id)
      .then(setArticle)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-center text-sm text-muted">جاري تحميل المقال...</p>

  if (error || !article) {
    return (
      <div className="text-center">
        <p className="mb-4 text-sm text-terracotta">{error || 'المقال غير موجود'}</p>
        <button type="button" onClick={() => navigate('/articles')} className="text-sm text-muted hover:text-terracotta">
          → العودة للمقالات
        </button>
      </div>
    )
  }

  return <ArticlePage article={article} onBack={() => navigate('/articles')} />
}

export default ArticleDetailPage
