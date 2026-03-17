-- Table: public.instagram_posts
-- Stores the latest Instagram posts synced via Instagram Graph API.
-- Run this in your Supabase SQL editor.

create table if not exists public.instagram_posts (
  id text primary key,
  media_url text not null,
  media_type text not null,
  caption text,
  permalink text not null,
  timestamp timestamptz not null,
  like_count bigint,
  comments_count bigint
);

create index if not exists instagram_posts_timestamp_idx
  on public.instagram_posts (timestamp desc);

alter table public.instagram_posts enable row level security;

grant select on table public.instagram_posts to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'instagram_posts'
      and policyname = 'Public read instagram posts'
  ) then
    create policy "Public read instagram posts"
      on public.instagram_posts
      for select
      using (true);
  end if;
end $$;
