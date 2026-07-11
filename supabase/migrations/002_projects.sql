-- للمشاريع — نفّذه إذا كان schema.sql نُفّذ سابقاً بدون جدول projects

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  project_url text,
  tech_stack text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "projects_read" on public.projects for select using (true);
create policy "projects_write" on public.projects for all to authenticated using (true) with check (true);

create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
