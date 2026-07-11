-- ملف SQL موحّد — نفّذه مرة واحدة في Supabase SQL Editor

-- ─── المقالات ───
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category text not null default 'عام',
  read_time text not null default '5 دقائق',
  cover_image text,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── الملف الشخصي ───
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  bio text not null default '',
  story text not null default '',
  github_url text,
  linkedin_url text,
  instagram_url text,
  youtube_url text,
  facebook_url text,
  telegram_url text,
  whatsapp text,
  instapay_url text,
  vodafone_cash text,
  avatar_url text,
  updated_at timestamptz default now()
);

-- ─── المشاريع ───
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  problem text not null default '',
  solution text not null default '',
  short_desc text not null default '',
  image_url text,
  project_url text,
  github_url text,
  tech_stack text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── المحتوى المختار ───
create table if not exists public.curated_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  type text not null check (type in ('video', 'article')),
  comment text not null default '',
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── أقسام المهارات ───
create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text not null default '⚙️',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- ─── المهارات ───
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.skill_categories(id) on delete cascade,
  name text not null,
  level text not null default 'مبتدئ',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- 1. تفعيل RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- 2. إزالة السياسات القديمة لتجنب الأخطاء
DROP POLICY IF EXISTS "articles_read" ON public.articles;
DROP POLICY IF EXISTS "articles_write" ON public.articles;
DROP POLICY IF EXISTS "profiles_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_write" ON public.profiles;
DROP POLICY IF EXISTS "projects_read" ON public.projects;
DROP POLICY IF EXISTS "projects_write" ON public.projects;
DROP POLICY IF EXISTS "curated_read" ON public.curated_content;
DROP POLICY IF EXISTS "curated_write" ON public.curated_content;
DROP POLICY IF EXISTS "skill_categories_read" ON public.skill_categories;
DROP POLICY IF EXISTS "skill_categories_write" ON public.skill_categories;
DROP POLICY IF EXISTS "skills_read" ON public.skills;
DROP POLICY IF EXISTS "skills_write" ON public.skills;

-- 3. السياسات الجديدة (الـ Read للعامة، والـ Write لك أنت فقط بالـ UID)
CREATE POLICY "articles_read" ON public.articles FOR SELECT USING (true);
CREATE POLICY "articles_write" ON public.articles FOR ALL TO authenticated USING (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a') WITH CHECK (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a');

CREATE POLICY "profiles_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_write" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a') WITH CHECK (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a');

CREATE POLICY "projects_read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_write" ON public.projects FOR ALL TO authenticated USING (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a') WITH CHECK (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a');

CREATE POLICY "curated_read" ON public.curated_content FOR SELECT USING (true);
CREATE POLICY "curated_write" ON public.curated_content FOR ALL TO authenticated USING (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a') WITH CHECK (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a');

CREATE POLICY "skill_categories_read" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "skill_categories_write" ON public.skill_categories FOR ALL TO authenticated USING (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a') WITH CHECK (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a');

CREATE POLICY "skills_read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "skills_write" ON public.skills FOR ALL TO authenticated USING (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a') WITH CHECK (auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a');

-- ─── Storage ───
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "images_read" ON storage.objects;
DROP POLICY IF EXISTS "images_write" ON storage.objects;

CREATE POLICY "images_read" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "images_write" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'blog-images' AND auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a') WITH CHECK (bucket_id = 'blog-images' AND auth.uid() = '3bd884cc-2df7-49a3-ab1f-00f96a8dbe4a');

-- ─── تحديث updated_at ───
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS articles_updated_at ON public.articles;
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS curated_updated_at ON public.curated_content;
CREATE TRIGGER curated_updated_at BEFORE UPDATE ON public.curated_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();