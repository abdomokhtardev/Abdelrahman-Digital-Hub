import { useEffect, useState } from 'react'
import { fetchProfile } from '../lib/profile'
import { cardClass } from '../lib/ui'

import { SOCIAL_LINKS } from '../lib/constants'

function AboutPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const socialLinks = SOCIAL_LINKS.filter((s) => profile?.[s.key])

  if (loading) {
    return (
      <p className="text-center text-sm text-muted py-12 animate-pulse">
        جاري تحميل الصفحة...
      </p>
    )
  }

  return (
    <div className="space-y-10 animate-wind-reveal">
      {/* Header */}
      <header className="arabic-divider mb-4">
        <h1 className="font-kufi text-2xl font-bold text-ink dark:text-sand-100 sm:text-3xl">
          عنّي
        </h1>
        <p className="mt-2 font-serif text-sm text-muted dark:text-sand-300">
          قصتي، شغفي، وكيف يمكنك دعم مسيرتي
        </p>
      </header>

      {/* Personal Story */}
      {(profile?.story || profile?.bio) && (
        <section className={`${cardClass} p-6 space-y-4`}>
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mb-6">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="arabic-arch h-48 w-48 sm:h-56 sm:w-56 object-cover ring-4 ring-gold-light/40 shadow-xl shrink-0"
              />
            ) : (
              <div className="arabic-arch flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center bg-gradient-to-br from-sand-100 to-sand-200 text-6xl font-serif text-terracotta dark:from-sand-900 dark:to-sand-800 dark:text-gold shadow-xl ring-4 ring-gold/20 shrink-0">
                {profile?.name?.charAt(0) || 'أ'}
              </div>
            )}
            <div className="text-center sm:text-right">
              <h2 className="font-kufi text-lg font-bold text-ink dark:text-sand-100">
                {profile?.name || 'مطور'}
              </h2>
              <p className="text-xs text-muted font-serif">{profile?.bio}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          {/* Story */}
          {profile?.story && (
            <div className="space-y-3">
              <h3 className="font-kufi text-sm font-bold text-gold flex items-center gap-2">
                <span>✦</span>
                <span>قصتي</span>
              </h3>
              <div className="font-serif text-base leading-loose text-muted dark:text-sand-300 whitespace-pre-line border-r-4 border-gold/20 pr-4">
                {profile.story}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Support Section */}
      {(profile?.vodafoneCash || profile?.instapay) && (
        <section className="space-y-4">
          <h2 className="font-kufi text-lg font-bold text-ink dark:text-sand-100 flex items-center gap-2">
            <span className="text-gold">💛</span>
            <span>ادعم رحلتي</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {profile?.vodafoneCash && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(profile.vodafoneCash.replace(/\D/g, ''))
                  setCopied('vodafone')
                  setTimeout(() => setCopied(null), 2000)
                }}
                className={`${cardClass} w-full p-5 text-center space-y-2 block transition-transform hover:-translate-y-1`}
              >
                <div className="text-3xl">📱</div>
                <h3 className="font-kufi text-sm font-bold text-ink dark:text-sand-100 tracking-wider">
                  Vodafone Cash
                </h3>
                <p className="font-mono text-lg font-bold text-terracotta dark:text-gold tracking-widest">
                  {profile.vodafoneCash}
                </p>
                <p className={`text-xs font-serif transition-colors ${copied === 'vodafone' ? 'text-terracotta dark:text-gold font-bold' : 'text-muted'}`}>
                  {copied === 'vodafone' ? 'تم النسخ بنجاح! ✅' : 'اضغط لنسخ الرقم'}
                </p>
              </button>
            )}

            {profile?.instapay && (
              <div className={`${cardClass} w-full p-5 text-center space-y-3 transition-transform hover:-translate-y-1`}>
                <div className="text-3xl">⚡</div>
                <h3 className="font-kufi text-sm font-bold text-ink dark:text-sand-100 tracking-wider">
                  InstaPay
                </h3>

                <div className="flex flex-col gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(profile.instapay.replace(/^https?:\/\/[^/]+\//, ''))
                      setCopied('instapay-user')
                      setTimeout(() => setCopied(null), 2000)
                    }}
                    className="flex items-center justify-between rounded-xl bg-sand-50 p-3 hover:bg-sand-100 dark:bg-sand-900/40 dark:hover:bg-sand-900/80 transition-colors border border-sand-200/50 dark:border-sand-800/50"
                  >
                    <span className="font-mono text-sm sm:text-base font-bold text-teal dark:text-teal-light tracking-widest truncate">
                      {profile.instapay.replace(/^https?:\/\/[^/]+\//, '')}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-muted bg-white dark:bg-sand-950 px-2 py-1 rounded-md shadow-sm border border-sand-100 dark:border-sand-800 shrink-0 ml-2">
                      {copied === 'instapay-user' ? 'تم النسخ ✅' : 'نسخ اليوزر'}
                    </span>
                  </button>

                  {profile?.vodafoneCash && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(profile.vodafoneCash.replace(/\D/g, ''))
                        setCopied('instapay-num')
                        setTimeout(() => setCopied(null), 2000)
                      }}
                      className="flex items-center justify-between rounded-xl bg-sand-50 p-3 hover:bg-sand-100 dark:bg-sand-900/40 dark:hover:bg-sand-900/80 transition-colors border border-sand-200/50 dark:border-sand-800/50"
                    >
                      <span className="font-mono text-sm sm:text-base font-bold text-teal dark:text-teal-light tracking-widest">
                        {profile.vodafoneCash}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-muted bg-white dark:bg-sand-950 px-2 py-1 rounded-md shadow-sm border border-sand-100 dark:border-sand-800 shrink-0 ml-2">
                        {copied === 'instapay-num' ? 'تم النسخ ✅' : 'نسخ الرقم'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-kufi text-base font-bold text-ink dark:text-sand-100 flex items-center gap-2">
            <span className="text-gold">✦</span>
            <span>تواصل معي</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.key}
                href={
                  s.key === 'whatsapp' && !profile[s.key].includes('http')
                    ? `https://wa.me/${profile[s.key].replace(/\D/g, '')}`
                    : profile[s.key]
                }
                target="_blank"
                rel="noreferrer"
                id={`about-social-${s.key}`}
                aria-label={s.label}
                title={s.label}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sand-200/80 bg-white/60 text-muted shadow-sm transition-all duration-300 hover:border-gold/40 hover:scale-105 hover:shadow-md dark:border-sand-800/60 dark:bg-sand-900/40 dark:hover:border-gold/30 ${s.color}`}
              >
                {s.icon}
                <span className="text-xs font-semibold">{s.label}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default AboutPage
