-- ============================================================
-- PIXEL Cyberclub — RLS Security Fixes
-- ============================================================

-- 1. Исправляем RLS для profiles — разрешаем менять свой профиль
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- 2. Новые таблицы — RLS
alter table public.user_prefixes enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_bans enable row level security;
alter table public.chat_warnings enable row level security;

-- user_prefixes — все читают, админы пишут
create policy "public read prefixes" on public.user_prefixes for select using (true);
create policy "admin write prefixes" on public.user_prefixes for all
  using (public.is_admin());

-- chat_messages — все читают, свои пишут/удаляют, админы управляют
create policy "public read chat" on public.chat_messages for select using (true);
create policy "user write chat" on public.chat_messages for insert
  with check (user_id = auth.uid());
create policy "user delete own chat" on public.chat_messages for delete
  using (user_id = auth.uid() or public.is_admin());

-- chat_bans — только админы
create policy "admin manage bans" on public.chat_bans for all
  using (public.is_admin());

-- chat_warnings — только админы
create policy "admin manage warnings" on public.chat_warnings for all
  using (public.is_admin());

-- 3. Добавляем функцию is_admin если её нет
create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role in ('admin', 'manager', 'head_admin', 'director', 'owner', 'developer')
  );
$$;

-- 4. Добавляем триггер updated_at для новых таблиц
create trigger chat_messages_updated_at before update on public.chat_messages
  for each row execute function public.touch_updated_at();

create trigger chat_bans_updated_at before update on public.chat_bans
  for each row execute function public.touch_updated_at();

create trigger chat_warnings_updated_at before update on public.chat_warnings
  for each row execute function public.touch_updated_at();
