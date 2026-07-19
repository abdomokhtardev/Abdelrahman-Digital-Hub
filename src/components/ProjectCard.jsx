export function ProjectCard({ project, onClick }) {
  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-2xl border border-sand-200/80 bg-white/70 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lg dark:border-sand-800/80 dark:bg-sand-900/60 flex flex-col justify-between h-full gold-glow-hover"
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      role="button"
      tabIndex={0}
    >
      <div>
        {project.imageUrl ? (
          <div className="overflow-hidden h-44 relative">
            <img
              src={project.imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-750 group-hover:scale-105"
            />
            {/* طبقة تظليل ناعمة */}
            <div className="absolute inset-0 bg-gradient-to-t from-sand-950/20 via-transparent to-transparent opacity-50 pointer-events-none" />
          </div>
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-sand-100/80 to-sand-200/50 text-4xl text-gold dark:from-sand-900/80 dark:to-sand-850/50 border-b border-sand-200/40 dark:border-sand-800/40 font-sans select-none">
            ۞
          </div>
        )}
        <div className="p-5">
          <h3 className="mb-2 font-kufi text-base font-bold text-ink group-hover:text-terracotta dark:text-sand-100 dark:group-hover:text-gold transition-colors duration-300">
            {project.title}
          </h3>
          <p className="mb-4 font-serif text-sm leading-relaxed text-muted dark:text-sand-300 line-clamp-3">
            {project.shortDesc || project.description}
          </p>
        </div>
      </div>
      
      <div className="px-5 pb-5">
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech, index) => (
              <span
                key={`${tech}-${index}`}
                className="rounded-xl border border-gold/10 bg-sand-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-teal dark:bg-sand-800/80 dark:text-gold-light"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-terracotta dark:text-gold transition-all group-hover:gap-2">
          <span>عرض التفاصيل</span>
          <span>←</span>
        </span>
      </div>
    </article>
  )
}
