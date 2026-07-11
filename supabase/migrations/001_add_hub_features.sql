-- Migration: Add new tables and columns for Personal Digital Hub
-- Run this in Supabase SQL Editor if you already have an existing database

-- ─── إضافة أعمدة جديدة لجدول الملف الشخصي ───
alter table public.profiles add column if not exists story text not null default '';
alter table public.profiles add column if not exists instagram_url text;
alter table public.profiles add column if not exists youtube_url text;
alter table public.profiles add column if not exists facebook_url text;
alter table public.profiles add column if not exists telegram_url text;
alter table public.profiles add column if not exists whatsapp text;
alter table public.profiles add column if not exists vodafone_cash text;

-- ─── إضافة أعمدة جديدة لجدول المشاريع ───
alter table public.projects add column if not exists github_url text;
alter table public.projects add column if not exists short_desc text not null default '';

-- ─── جدول المحتوى المختار ───
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

alter table public.curated_content enable row level security;

create policy "curated_read" on public.curated_content for select using (true);
create policy "curated_write" on public.curated_content for all to authenticated using (true) with check (true);

create trigger curated_updated_at before update on public.curated_content
  for each row execute function public.set_updated_at();

-- ─── جدول أقسام المهارات ───
create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text not null default '⚙️',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table public.skill_categories enable row level security;

create policy "skill_categories_read" on public.skill_categories for select using (true);
create policy "skill_categories_write" on public.skill_categories for all to authenticated using (true) with check (true);

-- ─── جدول المهارات ───
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.skill_categories(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table public.skills enable row level security;

create policy "skills_read" on public.skills for select using (true);
create policy "skills_write" on public.skills for all to authenticated using (true) with check (true);
