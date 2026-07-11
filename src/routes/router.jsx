import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../components/RootLayout'
import HomePage from '../pages/HomePage'
import ArticlesPage from '../pages/ArticlesPage'
import ArticleDetailPage from '../pages/ArticleDetailPage'
import ProjectsPage from '../pages/ProjectsPage'
import ProjectDetailPage from '../pages/ProjectDetailPage'
import CuratedPage from '../pages/CuratedPage'
import SkillsPage from '../pages/SkillsPage'
import AboutPage from '../pages/AboutPage'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import ProjectsDashboardPage from '../pages/ProjectsDashboardPage'
import Protected from '../pages/Protected'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/curated', element: <CuratedPage /> },
      { path: '/skills', element: <SkillsPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/projects', element: <ProjectsPage /> },
      { path: '/projects/:id', element: <ProjectDetailPage /> },
      // Articles kept for backward compat (accessible from dashboard)
      { path: '/articles', element: <ArticlesPage /> },
      { path: '/articles/:id', element: <ArticleDetailPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/dashboard', element: <Protected><DashboardPage /></Protected> },
      { path: '/dashboard/projects', element: <Protected><ProjectsDashboardPage /></Protected> },
      { path: '*', element: <p className="text-center text-muted py-12 font-serif">الصفحة غير موجودة</p> },
    ],
  },
])

export default router
