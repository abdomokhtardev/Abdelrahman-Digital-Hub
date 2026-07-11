import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Helper to load .env variables manually for Node script
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    const envFile = fs.readFileSync(envPath, 'utf-8')
    const env = {}
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        env[match[1].trim()] = match[2].trim()
      }
    })
    return env
  } catch (err) {
    console.log('No local .env file found. Falling back to process.env')
    return process.env
  }
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Missing Supabase URL or Key. Skipping sitemap generation.')
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const BASE_URL = 'https://your-domain.com' // Should be changed to actual domain

async function generateSitemap() {
  console.log('Generating sitemap...')
  const sitemapItems = []

  // Add static pages
  const staticPages = ['/', '/projects', '/curated', '/skills', '/about']
  staticPages.forEach(page => {
    sitemapItems.push(`<url><loc>${BASE_URL}${page}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
  })

  // Add Projects
  const { data: projects } = await supabase.from('projects').select('id, updated_at')
  if (projects) {
    projects.forEach(project => {
      sitemapItems.push(`<url><loc>${BASE_URL}/projects/${project.id}</loc><lastmod>${project.updated_at}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`)
    })
  }

  // Add Articles
  const { data: articles } = await supabase.from('articles').select('id, updated_at')
  if (articles) {
    articles.forEach(article => {
      sitemapItems.push(`<url><loc>${BASE_URL}/articles/${article.id}</loc><lastmod>${article.updated_at}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`)
    })
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapItems.join('\n  ')}
</urlset>`

  const publicDir = path.resolve(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir)
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml)
  console.log('✅ sitemap.xml generated successfully!')
}

generateSitemap().catch(console.error)
