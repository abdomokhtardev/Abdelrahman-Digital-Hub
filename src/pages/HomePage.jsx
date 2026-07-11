import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { fetchProfile } from '../lib/profile'
import { cardClass } from '../lib/ui'
import { SOCIAL_LINKS } from '../lib/constants'

const SECTIONS = [
  {
    to: '/projects',
    icon: '◆',
    iconBg: 'from-teal/10 to-teal/20',
    iconColor: 'text-teal dark:text-gold',
    title: 'المشاريع',
    desc: 'معرض الأعمال الرقمية وحلول البرمجة التي تم بناؤها بشغف وإتقان.',
    cta: 'انتقل للمشاريع',
  },
  {
    to: '/articles',
    icon: '📝',
    iconBg: 'from-sand-400/20 to-sand-500/20',
    iconColor: 'text-sand-600 dark:text-sand-300',
    title: 'المقالات',
    desc: 'تدوينات تقنية، شروحات، وأفكار أشاركها من واقع خبرتي.',
    cta: 'اقرأ المقالات',
  },
  {
    to: '/curated',
    icon: '🎯',
    iconBg: 'from-terracotta/10 to-terracotta/20',
    iconColor: 'text-terracotta',
    title: 'المحتوى المختار',
    desc: 'مجموعة مختارة من أفضل الفيديوهات والمقالات التي أثّرت في مسيرتي.',
    cta: 'تصفح المحتوى',
  },
  {
    to: '/skills',
    icon: '⚙️',
    iconBg: 'from-gold/10 to-gold/20',
    iconColor: 'text-gold',
    title: 'المهارات',
    desc: 'الترسانة التقنية والأدوات الإبداعية التي أعتمد عليها في كل مشروع.',
    cta: 'اكتشف مهاراتي',
  },
  {
    to: '/about',
    icon: '✦',
    iconBg: 'from-sand-400/20 to-sand-500/20',
    iconColor: 'text-sand-600 dark:text-sand-300',
    title: 'عنّي',
    desc: 'قصتي وشغفي بدمج البرمجة مع الإبداع، وطريقة دعم مسيرتي.',
    cta: 'تعرف علي أكثر',
  },
]

function HomePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const avatarLetter = profile?.name?.charAt(0) || 'أ'

  if (loading) {
    return <p className="text-center text-sm text-muted py-12 animate-pulse">جاري تهيئة الكثبان...</p>
  }

  return (
    <div className="space-y-12">
      <Helmet>
        <title>{profile?.name ? `${profile.name} | الرئيسية` : 'مدوَّنتي'}</title>
        <meta name="description" content={profile?.bio || 'المركز الرقمي الشخصي'} />
      </Helmet>

      {/* Hero Section */}
      <section className="text-center py-10">
        <div className="relative mx-auto mb-8 w-48 h-48 sm:w-56 sm:h-56 flex justify-center items-center">
          {/* Glow behind avatar */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gold/30 via-terracotta/20 to-teal/20 blur-2xl rounded-full scale-110 animate-pulse" />

          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="arabic-arch z-10 h-44 w-44 sm:h-52 sm:w-52 object-cover ring-4 ring-gold-light/40 shadow-2xl transition-transform duration-500 hover:scale-[1.03]"
            />
          ) : (
            <div className="arabic-arch z-10 flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center bg-gradient-to-br from-sand-100 to-sand-200 text-6xl font-serif text-terracotta dark:from-sand-900 dark:to-sand-800 dark:text-gold shadow-2xl ring-4 ring-gold/20">
              {avatarLetter}
            </div>
          )}

          {/* Spinning decorative rings */}
          <div className="absolute inset-0 border border-dashed border-gold/40 rounded-full animate-[spin_40s_linear_infinite]" />
          <div className="absolute -inset-4 border border-dotted border-terracotta/30 rounded-full animate-[spin_60s_linear_infinite_reverse] opacity-50" />
        </div>

        <h1 className="mb-4 font-kufi text-3xl font-bold text-ink dark:text-sand-100 sm:text-4xl tracking-wide">
          {profile?.name || 'مدوَّنتي'}
        </h1>

        {/* Arabic mini divider */}
        <div className="flex items-center justify-center gap-2 mb-4 text-xs text-gold/60">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gold" />
          <span>✦</span>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gold" />
        </div>

        <p className="mx-auto max-w-lg font-serif text-lg leading-relaxed text-muted dark:text-sand-300 italic">
          {profile?.bio || 'أضف نبذتك من لوحة التحكم'}
        </p>

        {/* Social links row */}
        {SOCIAL_LINKS.some((s) => profile?.[s.key]) && (
          <div className="mt-6 flex justify-center gap-3">
            {SOCIAL_LINKS.filter((s) => profile?.[s.key]).map((s) => (
              <a
                key={s.key}
                href={profile[s.key]}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className={`flex items-center justify-center w-10 h-10 rounded-xl border border-sand-300 bg-white/50 text-muted shadow-sm transition-all hover:scale-110 hover:border-gold dark:border-sand-800 dark:bg-sand-900/50 ${s.color}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Section Navigation Cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {SECTIONS.map((sec, i) => (
          <Link
            key={sec.to}
            to={sec.to}
            id={`home-section-${sec.to.replace('/', '')}`}
            className={`${cardClass} group relative p-8 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.2)] hover:border-gold/40 stagger-${i + 1}`}
          >
            {/* Soft gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Giant watermark icon */}
            <div className="absolute -left-6 -bottom-6 text-[120px] opacity-[0.03] text-ink dark:text-white transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
              {sec.icon}
            </div>

            {/* Geometric corner decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-gold/10 rounded-tr-2xl transition-all duration-500 group-hover:border-gold/30 group-hover:w-32 group-hover:h-32" />

            <div className="relative z-10 flex items-center gap-4">
              <span
                className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${sec.iconBg} ${sec.iconColor} text-3xl shadow-sm ring-1 ring-white/20 dark:ring-white/10 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110`}
              >
                {sec.icon}
              </span>
              <h2 className="font-kufi text-xl font-bold text-ink group-hover:text-terracotta dark:text-sand-100 dark:group-hover:text-gold-light transition-colors">
                {sec.title}
              </h2>
            </div>
            
            <p className="relative z-10 mt-4 font-serif text-[15px] leading-relaxed text-muted dark:text-sand-300">
              {sec.desc}
            </p>
            
            <div className="relative z-10 mt-6 flex items-center gap-1.5 text-sm font-semibold text-terracotta dark:text-gold transition-all duration-300 group-hover:gap-3 group-hover:text-terracotta-dark dark:group-hover:text-gold-light">
              <span>{sec.cta}</span>
              <span>←</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}

export default HomePage
