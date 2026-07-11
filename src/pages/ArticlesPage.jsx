import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArticleCard } from '../components/ArticleCard'
import { fetchArticles } from '../lib/articles'

function ArticlesPage() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8 animate-wind-reveal">
      <header className="arabic-divider mb-4">
        <h1 className="font-kufi text-2xl font-bold text-ink dark:text-sand-100 sm:text-3xl">المقالات</h1>
        <p className="mt-2 font-serif text-sm text-muted dark:text-sand-300">نثرٌ من القول وتدويناتٌ في رحاب التقنية والآداب</p>
      </header>

      {loading ? (
        <p className="text-center text-sm text-muted py-12 animate-pulse">جاري جمع الأوراق والمدونات...</p>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-sand-300 dark:border-sand-800">
          <p className="font-serif text-base text-muted">لم يتم العثور على أي مقالات منشورة بعد.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              index={index}
              onClick={() => navigate(`/articles/${article.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ArticlesPage
