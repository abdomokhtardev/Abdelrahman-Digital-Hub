import { Helmet } from 'react-helmet-async'
import { ArticleContent } from '../components/ArticleContent'

export function ArticlePage({ article, onBack }) {
  return (
    <article className="animate-wind-reveal space-y-6">
      <Helmet>
        <title>{article.title} | مقالاتي</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>
      <button
        type="button"
        onClick={onBack}
        className="group flex items-center gap-1.5 text-sm font-semibold text-muted transition-all duration-300 hover:text-terracotta dark:hover:text-gold hover:gap-2"
      >
        <span>→</span>
        <span>العودة للمقالات</span>
      </button>

      <header className="arabic-divider">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="rounded-xl border border-gold/10 bg-sand-100/80 px-3 py-1 font-semibold text-teal dark:bg-sand-900 dark:text-gold-light">
            {article.category}
          </span>
          <span className="text-gold">◆</span>
          <time className="flex items-center gap-1">
            <span>{article.date}</span>
          </time>
          <span className="text-gold">◆</span>
          <span>{article.readTime} قراءة</span>
        </div>
        
        <h1 className="font-kufi text-2xl font-bold text-ink dark:text-sand-100 sm:text-3xl tracking-wide leading-snug">
          {article.title}
        </h1>
        
        <p className="mt-4 font-serif text-lg leading-relaxed text-muted dark:text-sand-200 border-r-4 border-gold/30 pr-4 italic bg-sand-100/30 p-4 rounded-l-2xl dark:bg-sand-900/20">
          {article.excerpt}
        </p>
      </header>

      {article.coverImage && (
        <div className="overflow-hidden rounded-3xl ring-4 ring-gold/10 shadow-md">
          <img src={article.coverImage} alt={article.title} className="max-h-[500px] w-full object-cover" />
        </div>
      )}

      <ArticleContent content={article.content} />
    </article>
  )
}
