import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { ThemeToggle } from './ThemeToggle'

const navLink = (active) =>
  `rounded-xl px-3 py-1.5 text-xs sm:text-sm transition-all duration-300 font-medium ${active
    ? 'bg-sand-200/80 text-ink shadow-sm dark:bg-sand-800 dark:text-sand-100 border border-gold/20'
    : 'text-muted hover:text-ink hover:bg-sand-100/50 dark:hover:bg-sand-900/40 dark:hover:text-sand-100 border border-transparent'
  }`

const NAV_LINKS = [
  { to: '/', label: 'الرئيسية', match: (p) => p === '/' },
  { to: '/projects', label: 'المشاريع', match: (p) => p.startsWith('/projects') && !p.startsWith('/dashboard') },
  { to: '/articles', label: 'المقالات', match: (p) => p.startsWith('/articles') },
  { to: '/curated', label: 'المختارات', match: (p) => p.startsWith('/curated') },
  { to: '/skills', label: 'المهارات', match: (p) => p.startsWith('/skills') },
  { to: '/about', label: 'عنّي', match: (p) => p.startsWith('/about') },
]

export default function RootLayout() {
  const location = useLocation()
  const { pathname, key } = location
  const isLogin = pathname === '/login'
  const [isAuth, setIsAuth] = useState(false)
  const [prevKey, setPrevKey] = useState(key)
  const [windActive, setWindActive] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // مراقبة الانتقال بين الصفحات لتشغيل تأثير الرياح الرملية
  useEffect(() => {
    if (key !== prevKey) {
      setWindActive(true)
      setMobileOpen(false)
      const timer = setTimeout(() => {
        setWindActive(false)
      }, 950)
      setPrevKey(key)
      return () => clearTimeout(timer)
    }
  }, [key, prevKey])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuth(!!data.session))
  }, [pathname])

  return (
    <div className="arabic-pattern flex min-h-screen flex-col relative overflow-x-hidden">
      {/* تأثير هبوب الرياح الصحراوية الانتقالي */}
      {windActive && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          <div className="absolute top-[5%] left-0 w-[250vw] h-28 animate-wind-1">
            <svg className="w-full h-full text-gold/30 fill-current" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,40 C150,90 350,10 500,50 C650,90 850,10 1000,40 L1000,100 L0,100 Z" />
            </svg>
          </div>
          <div className="absolute top-[35%] left-0 w-[250vw] h-36 animate-wind-2">
            <svg className="w-full h-full text-sand-400/25 fill-current" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,50 C150,10 350,90 500,40 C650,10 850,90 1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
          <div className="absolute top-[65%] left-0 w-[250vw] h-32 animate-wind-3">
            <svg className="w-full h-full text-terracotta/20 fill-current" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,30 C200,80 400,20 600,60 C800,90 900,10 1000,30 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </div>
      )}

      {!isLogin && (
        <header className="sticky top-0 z-50 border-b border-sand-200/50 bg-sand-50/80 backdrop-blur-md dark:border-sand-800/50 dark:bg-sand-950/80">
          {/* Gold gradient top bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-terracotta via-gold to-teal" />

          <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center gap-1.5 text-lg font-bold transition-all duration-300"
            >
              <span className="text-gold transition-transform duration-500 group-hover:rotate-180">✦</span>
              <span className="font-kufi bg-gradient-to-l from-terracotta to-gold bg-clip-text text-transparent dark:from-gold-light dark:to-gold">
                مدوَّنتي
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={navLink(link.match(pathname))}
                >
                  {link.label}
                </Link>
              ))}
              {isAuth && (
                <Link
                  to="/dashboard"
                  className={navLink(pathname.startsWith('/dashboard'))}
                >
                  التحكم
                </Link>
              )}
              <ThemeToggle />
            </div>

            {/* Mobile: Theme toggle + hamburger */}
            <div className="flex sm:hidden items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                id="mobile-menu-btn"
                aria-label="القائمة"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-sand-200/80 bg-white/60 text-muted transition-all hover:border-gold/40 dark:border-sand-800 dark:bg-sand-900/40"
              >
                {mobileOpen ? '✕' : '☰'}
              </button>
            </div>
          </nav>

          {/* Mobile Menu Dropdown */}
          {mobileOpen && (
            <div className="sm:hidden border-t border-sand-200/50 dark:border-sand-800/50 bg-sand-50/95 dark:bg-sand-950/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${navLink(link.match(pathname))} w-full text-right`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuth && (
                <Link
                  to="/dashboard"
                  className={`${navLink(pathname.startsWith('/dashboard'))} w-full text-right`}
                >
                  التحكم
                </Link>
              )}
            </div>
          )}
        </header>
      )}

      {/* Page content */}
      <main className={isLogin ? 'flex flex-1 items-center justify-center px-4 z-10' : 'mx-auto w-full max-w-3xl flex-1 px-4 py-8 z-10'}>
        <div key={key} className="animate-arabic-fade-in-up">
          <Outlet />
        </div>
      </main>

      {!isLogin && (
        <footer className="relative mt-auto border-t border-sand-200/60 bg-sand-100/20 py-8 text-center text-xs text-muted dark:border-sand-800/60 dark:bg-sand-900/10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sand-50 px-4 text-gold dark:bg-sand-950 font-sans select-none text-base">
            ۞
          </div>
          <p className="font-serif text-sm italic mb-2 text-sand-500 dark:text-gold-light/80">
            «خطواتٌ فوق رمال الفكر ترسمُ أثراً لا يزول»
          </p>
          <div className="mt-2 text-[10px] sm:text-xs text-muted">
            © {new Date().getFullYear()} مدوَّنتي الشخصية. جميع الحقوق محفوظة
          </div>
        </footer>
      )}
    </div>
  )
}
