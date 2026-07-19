import { Helmet } from 'react-helmet-async'
import { cardClass } from '../lib/ui'

export function ProjectPage({ project, onBack }) {
  return (
    <article className="animate-wind-reveal space-y-8">
      <Helmet>
        <title>{project.title} | مشاريعي</title>
        <meta name="description" content={project.shortDesc || project.description?.substring(0, 150)} />
      </Helmet>

      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="group flex items-center gap-1.5 text-sm font-semibold text-muted transition-all duration-300 hover:text-terracotta dark:hover:text-gold hover:gap-2"
      >
        <span>→</span>
        <span>العودة للمشاريع</span>
      </button>

      {/* Hero Image */}
      {project.imageUrl && (
        <div className="overflow-hidden rounded-3xl ring-4 ring-gold/10 shadow-lg relative">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="max-h-72 w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-sand-950/40 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Title */}
      <header className="arabic-divider">
        <h1 className="font-kufi text-2xl font-bold text-ink dark:text-sand-100 sm:text-3xl tracking-wide leading-snug">
          {project.title}
        </h1>
      </header>

      {/* Description */}
      {(project.description || project.shortDesc) && (
        <section className={`${cardClass} p-5 sm:p-6 space-y-4`}>
          <h2 className="font-kufi text-sm font-bold text-gold flex items-center gap-2">
            <span>◆</span>
            <span>وصف المشروع</span>
          </h2>
          <p className="font-serif text-base leading-loose text-muted dark:text-sand-300 whitespace-pre-line border-r-4 border-gold/20 pr-4">
            {project.description || project.shortDesc}
          </p>
        </section>
      )}

      {/* Problem & Solution */}
      {(project.problem || project.solution) && (
        <section className="grid gap-6 sm:grid-cols-2">
          {project.problem && (
            <div className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-6 shadow-sm dark:bg-terracotta/10 transition-transform hover:-translate-y-1 duration-300">
              <h3 className="font-kufi text-lg font-bold text-terracotta mb-3 flex items-center gap-2">
                <span className="bg-terracotta/20 p-1.5 rounded-lg text-xl">🎯</span>
                <span>المشكلة</span>
              </h3>
              <p className="font-serif text-[15px] leading-relaxed text-ink/80 dark:text-sand-200 whitespace-pre-line">
                {project.problem}
              </p>
            </div>
          )}
          {project.solution && (
            <div className="rounded-2xl border border-teal/20 bg-teal/5 p-6 shadow-sm dark:bg-teal/10 transition-transform hover:-translate-y-1 duration-300">
              <h3 className="font-kufi text-lg font-bold text-teal mb-3 flex items-center gap-2">
                <span className="bg-teal/20 p-1.5 rounded-lg text-xl">💡</span>
                <span>الحل</span>
              </h3>
              <p className="font-serif text-[15px] leading-relaxed text-ink/80 dark:text-sand-200 whitespace-pre-line">
                {project.solution}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-kufi text-sm font-bold text-ink dark:text-sand-100 flex items-center gap-2">
            <span className="text-gold">✦</span>
            <span>التقنيات المستخدمة</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, index) => (
              <span
                key={`${tech}-${index}`}
                className="rounded-xl border border-gold/15 bg-sand-100/80 px-4 py-1.5 text-xs font-bold text-teal dark:bg-sand-900 dark:text-gold-light dark:border-sand-700/50 transition-all hover:border-gold/40 hover:bg-gold/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Action Links */}
      <section className="flex flex-wrap gap-3">
        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noreferrer"
            id="project-demo-link"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-terracotta to-sand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:from-terracotta-dark hover:to-sand-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.99] dark:from-teal dark:to-sand-700 dark:hover:from-teal-light"
          >
            <span>🔗</span>
            <span>Live Demo</span>
            <span>←</span>
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            id="project-github-link"
            className="inline-flex items-center gap-2 rounded-xl border border-sand-300/80 bg-white/60 px-6 py-3 text-sm font-semibold text-ink shadow-sm transition-all duration-300 hover:border-gold/40 hover:shadow-md hover:scale-[1.02] hover:bg-sand-100/80 active:scale-[0.99] dark:border-sand-800/80 dark:bg-sand-900/60 dark:text-sand-100 dark:hover:border-gold/30"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-3.795-.735-.525-1.335-1.275-1.695-1.275-1.695-1.05-.72.075-.705.075-.705 1.155.075 1.755 1.185 1.755 1.185 1.02 1.755 2.685 1.23 3.345.945.105-.75.405-1.23.735-1.515-2.55-.285-5.235-1.275-5.235-5.685 0-1.26.45-2.28 1.185-3.09-.12-.285-.525-1.44.12-2.985 0 0 .975-.3 3.195 1.17 1.005-.255 2.085-.39 3.15-.39 1.065 0 2.145.135 3.15.39 2.22-1.485 3.195-1.17 3.195-1.17.645 1.545.24 2.7.12 2.985.735.81 1.185 1.83 1.185 3.09 0 4.425-2.7 5.385-5.25 5.655.42.36.81 1.065.81 2.145 0 1.545-.015 2.79-.015 3.165 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub Repository</span>
          </a>
        )}
      </section>
    </article>
  )
}
