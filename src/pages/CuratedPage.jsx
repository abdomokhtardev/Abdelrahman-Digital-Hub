import { useEffect, useState } from 'react'
import { fetchCuratedContent } from '../lib/curated'
import { cardClass } from '../lib/ui'

const FILTER_TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'video', label: '🎥 فيديوهات' },
  { id: 'article', label: '📄 مقالات' },
]

const TYPE_META = {
  video: { icon: '🎥', label: 'فيديو', color: 'text-terracotta dark:text-gold' },
  article: { icon: '📄', label: 'مقالة', color: 'text-teal dark:text-teal-light' },
}

function getYouTubeEmbedUrl(url) {
  try {
    let videoId = null
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v')
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1)
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  } catch (e) {
    return null
  }
}

function CuratedPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetchCuratedContent()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    activeFilter === 'all' ? items : items.filter((item) => item.type === activeFilter)

  return (
    <div className="space-y-8 animate-wind-reveal">
      {/* Header */}
      <header className="arabic-divider mb-4">
        <h1 className="font-kufi text-2xl font-bold text-ink dark:text-sand-100 sm:text-3xl">
          المحتوى المختار
        </h1>
        <p className="mt-2 font-serif text-sm text-muted dark:text-sand-300">
          مجموعة مختارة من أفضل الفيديوهات والمقالات التي أثّرت في مسيرتي
        </p>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            id={`curated-filter-${tab.id}`}
            onClick={() => setActiveFilter(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              activeFilter === tab.id
                ? 'bg-gradient-to-r from-terracotta to-sand-600 text-white shadow-sm dark:from-teal dark:to-sand-700'
                : 'border border-sand-200/80 bg-white/60 text-muted hover:border-gold/40 hover:text-ink dark:border-sand-800/60 dark:bg-sand-900/40 dark:hover:text-sand-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-sm text-muted py-12 animate-pulse">
          جاري تحميل المحتوى المختار...
        </p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-sand-300 dark:border-sand-800">
          <p className="text-3xl mb-3">📚</p>
          <p className="font-serif text-base text-muted">
            {items.length === 0
              ? 'لم يُضف أي محتوى بعد.'
              : 'لا يوجد محتوى من هذا النوع.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item, index) => {
            const meta = TYPE_META[item.type] ?? TYPE_META.article
            return (
              <article
                key={item.id}
                className={`${cardClass} p-5 flex gap-4 items-start group gold-glow-hover`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Icon */}
                <span
                  className={`text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${meta.color}`}
                  title={meta.label}
                >
                  {meta.icon}
                </span>

                <div className="flex-1 min-w-0 space-y-2">
                  {/* Title + Link */}
                  <div className="flex items-start gap-2 justify-between flex-wrap">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      id={`curated-link-${item.id}`}
                      className="font-kufi text-base font-bold text-ink dark:text-sand-100 hover:text-terracotta dark:hover:text-gold transition-colors leading-snug"
                    >
                      {item.title}
                    </a>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                        item.type === 'video'
                          ? 'border-terracotta/30 text-terracotta bg-terracotta/5 dark:text-gold dark:border-gold/30'
                          : 'border-teal/30 text-teal bg-teal/5 dark:text-teal-light'
                      }`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {/* Comment / Insight */}
                  {item.comment && (
                    <div className="relative rounded-xl border border-gold/15 bg-sand-50/60 px-4 py-3 dark:bg-sand-900/40">
                      <span className="absolute -top-2 right-3 text-[10px] font-semibold text-gold bg-sand-50 dark:bg-sand-950 px-1.5">
                        رأيي
                      </span>
                      <p className="font-serif text-sm leading-relaxed text-muted dark:text-sand-300 italic">
                        {item.comment}
                      </p>
                    </div>
                  )}

                  {/* Video Embed */}
                  {item.type === 'video' && getYouTubeEmbedUrl(item.url) && (
                    <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-xl border border-sand-200/80 shadow-sm dark:border-sand-800/80">
                      <iframe
                        src={getYouTubeEmbedUrl(item.url)}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                    </div>
                  )}

                  {/* Visit Link */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta dark:text-gold hover:gap-2.5 transition-all duration-300 mt-2"
                  >
                    <span>زيارة المحتوى الأصلي</span>
                    <span>←</span>
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CuratedPage
