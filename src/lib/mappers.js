export function formatArticleDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const empty = (v) => v || null

// ─── Articles ───
export function mapArticle(row) {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    readTime: row.read_time,
    coverImage: row.cover_image ?? '',
    date: formatArticleDate(row.published_at || row.created_at),
    sortOrder: row.sort_order ?? 0,
  }
}

export function articleToDb(form) {
  return {
    title: form.title,
    excerpt: form.excerpt,
    content: form.content,
    category: form.category,
    read_time: form.readTime,
    cover_image: empty(form.coverImage),
    sort_order: form.sortOrder ?? 0,
  }
}

// ─── Profiles ───
export function mapProfile(row) {
  return {
    id: row.id,
    name: row.name,
    bio: row.bio,
    story: row.story ?? '',
    github: row.github_url ?? '',
    linkedin: row.linkedin_url ?? '',
    instagram: row.instagram_url ?? '',
    youtube: row.youtube_url ?? '',
    facebook: row.facebook_url ?? '',
    telegram: row.telegram_url ?? '',
    whatsapp: row.whatsapp ?? '',
    instapay: row.instapay_url ?? '',
    vodafoneCash: row.vodafone_cash ?? '',
    avatarUrl: row.avatar_url ?? '',
  }
}

export function profileToDb(form) {
  return {
    name: form.name,
    bio: form.bio,
    story: form.story,
    github_url: empty(form.github),
    linkedin_url: empty(form.linkedin),
    instagram_url: empty(form.instagram),
    youtube_url: empty(form.youtube),
    facebook_url: empty(form.facebook),
    telegram_url: empty(form.telegram),
    whatsapp: empty(form.whatsapp),
    instapay_url: empty(form.instapay),
    vodafone_cash: empty(form.vodafoneCash),
    avatar_url: empty(form.avatarUrl),
  }
}

// ─── Projects ───
export function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    problem: row.problem ?? '',
    solution: row.solution ?? '',
    shortDesc: row.short_desc ?? '',
    imageUrl: row.image_url ?? '',
    projectUrl: row.project_url ?? '',
    githubUrl: row.github_url ?? '',
    techStack: row.tech_stack ?? [],
    sortOrder: row.sort_order ?? 0,
  }
}

export function projectToDb(form) {
  return {
    title: form.title,
    description: form.description,
    problem: form.problem ?? '',
    solution: form.solution ?? '',
    short_desc: form.shortDesc ?? '',
    image_url: empty(form.imageUrl),
    project_url: empty(form.projectUrl),
    github_url: empty(form.githubUrl),
    tech_stack: form.techStack ?? [],
    sort_order: form.sortOrder ?? 0,
  }
}

// ─── Curated Content ───
export function mapCuratedItem(row) {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    type: row.type, // 'video' | 'article'
    comment: row.comment ?? '',
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  }
}

export function curatedItemToDb(form) {
  return {
    title: form.title,
    url: form.url,
    type: form.type,
    comment: form.comment ?? '',
    sort_order: form.sortOrder ?? 0,
  }
}

// ─── Skill Categories ───
export function mapSkillCategory(row) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon ?? '⚙️',
    sortOrder: row.sort_order ?? 0,
    skills: (row.skills ?? []).map(mapSkill),
  }
}

export function skillCategoryToDb(form) {
  return {
    name: form.name,
    icon: form.icon ?? '⚙️',
    sort_order: form.sortOrder ?? 0,
  }
}

// ─── Skills ───
export function mapSkill(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    level: row.level ?? 'مبتدئ',
    sortOrder: row.sort_order ?? 0,
  }
}

export function skillToDb(form) {
  return {
    ...(form.id ? { id: form.id } : {}),
    category_id: form.categoryId,
    name: form.name,
    level: form.level ?? 'مبتدئ',
    sort_order: form.sortOrder ?? 0,
  }
}
