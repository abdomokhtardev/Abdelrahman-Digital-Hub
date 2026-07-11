const staggerClasses = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4']

export function ArticleCard({ article, index, onClick }) {
  const stagger = staggerClasses[Math.min(index, 3)]

  return (
    <article
      className={`animate-arabic-fade-in-up group cursor-pointer overflow-hidden rounded-2xl border border-sand-200/80 bg-white/70 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg dark:border-sand-800/80 dark:bg-sand-900/60 flex flex-col md:flex-row ${stagger}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      role="button"
      tabIndex={0}
    >
      {article.coverImage && (
        <div className="overflow-hidden md:w-56 h-48 md:h-auto relative shrink-0">
          <img
            src={article.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* طبقة تظليل ذهبية خفيفة فوق الصورة */}
          <div className="absolute inset-0 bg-gradient-to-t from-sand-950/20 via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>
      )}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="mb-3 flex items-center justify-end gap-2">
            <span className="text-xs text-muted flex items-center gap-1">
              <span className="text-gold">◆</span> {article.date}
            </span>
          </div>
          
          <h3 className="mb-2 font-kufi text-lg font-bold text-ink group-hover:text-terracotta dark:text-sand-100 dark:group-hover:text-gold transition-colors duration-300">
            {article.title}
          </h3>
          
          <p className="mb-4 font-serif text-sm leading-relaxed text-muted dark:text-sand-300 line-clamp-2">
            {article.excerpt}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="rounded-xl border border-teal/20 bg-teal/5 px-3 py-1 text-[10px] font-bold tracking-wider text-teal dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700/50">
            {article.category}
          </span>
          <span className="text-xs font-semibold text-terracotta dark:text-gold flex items-center gap-1 transition-all group-hover:gap-2">
            <span>{article.readTime} قراءة</span>
            <span>←</span>
          </span>
        </div>
      </div>
    </article>
  )
}
