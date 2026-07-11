import { useEffect, useState } from 'react'
import { fetchSkillCategories } from '../lib/skills'
import { cardClass } from '../lib/ui'

function SkillsPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSkillCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8 animate-wind-reveal">
      {/* Header */}
      <header className="arabic-divider mb-4">
        <h1 className="font-kufi text-2xl font-bold text-ink dark:text-sand-100 sm:text-3xl">
          المهارات والأدوات
        </h1>
        <p className="mt-2 font-serif text-sm text-muted dark:text-sand-300">
          الترسانة التقنية والأدوات الإبداعية التي أعتمد عليها في رحلتي
        </p>
      </header>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-sand-200/80 bg-white/60 p-5 dark:border-sand-800/60 dark:bg-sand-900/40 animate-pulse"
            >
              <div className="h-6 w-24 rounded-lg bg-sand-200 dark:bg-sand-800 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-6 w-16 rounded-xl bg-sand-100 dark:bg-sand-800"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-sand-300 dark:border-sand-800">
          <p className="text-4xl mb-3">⚙️</p>
          <p className="font-serif text-base text-muted">
            لم تُضف أي مهارات بعد. أضف أقسام المهارات من لوحة التحكم.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {categories.map((cat, catIndex) => (
            <div
              key={cat.id}
              className={`${cardClass} p-5 group gold-glow-hover`}
              style={{ animationDelay: `${catIndex * 0.08}s` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-2xl text-xl bg-gradient-to-br from-gold/10 to-gold/20 transition-transform duration-500 group-hover:rotate-[360deg]"
                >
                  {cat.icon}
                </span>
                <h2 className="font-kufi text-base font-bold text-ink dark:text-sand-100">
                  {cat.name}
                </h2>
              </div>

              {/* Separator */}
              <div className="h-[1px] w-full bg-gradient-to-r from-gold/20 via-gold/40 to-transparent mb-4" />

              {/* Skills */}
              {cat.skills.length === 0 ? (
                <p className="text-xs text-muted font-serif italic">
                  لا توجد مهارات في هذا القسم بعد.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-xl border border-gold/15 bg-sand-100/80 px-3 py-1 text-xs font-semibold text-ink dark:bg-sand-800/80 dark:text-sand-100 dark:border-sand-700/50 transition-all duration-200 hover:border-gold/40 hover:bg-gold/5 dark:hover:border-gold/30 flex items-center gap-1.5"
                    >
                      <span>{skill.name}</span>
                      <span className="text-[10px] text-muted dark:text-sand-400 bg-sand-200/50 dark:bg-sand-900/50 px-1.5 py-0.5 rounded-md">
                        {skill.level}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SkillsPage
