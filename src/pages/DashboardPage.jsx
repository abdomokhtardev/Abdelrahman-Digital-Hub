import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebaseClient'
import { signOut } from 'firebase/auth'
import { btnSecondary } from '../lib/ui'

import { ProfileTab } from './dashboard/ProfileTab'
import { ArticlesTab } from './dashboard/ArticlesTab'
import { CuratedTab } from './dashboard/CuratedTab'
import { SkillsTab } from './dashboard/SkillsTab'

const TABS = [
  { id: 'profile', label: '👤 الملف الشخصي' },
  { id: 'articles', label: '📝 المقالات' },
  { id: 'curated', label: '🎯 المحتوى المختار' },
  { id: 'skills', label: '⚙️ المهارات' },
]

function DashboardPage() {
  const [tab, setTab] = useState('profile')
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="animate-wind-reveal space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-kufi text-xl font-bold text-ink dark:text-sand-100 sm:text-2xl">
            لوحة التحكم
          </h1>
          <p className="mt-1 font-serif text-sm text-muted dark:text-sand-300">
            إدارة كاملة لمحتوى موقعك الشخصي
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/projects" className={btnSecondary}>
            إدارة المشاريع ←
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-2.5 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-white"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 flex-wrap rounded-xl border border-sand-200/80 bg-sand-100/50 p-1 dark:border-sand-800/80 dark:bg-sand-900/40">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            id={`dashboard-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[5rem] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${tab === t.id
                ? 'bg-white text-terracotta shadow-sm dark:bg-sand-800 dark:text-gold border border-gold/10'
                : 'text-muted hover:text-ink dark:hover:text-sand-100'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'profile' && <ProfileTab />}
      {tab === 'articles' && <ArticlesTab />}
      {tab === 'curated' && <CuratedTab />}
      {tab === 'skills' && <SkillsTab />}
    </div>
  )
}

export default DashboardPage

