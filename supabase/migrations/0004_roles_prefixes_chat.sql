-- ============================================================
-- PIXEL Cyberclub — Roles, Prefixes & Chat
-- ============================================================

-- 1. Обновляем ENUM ролей (добавляем новые)
drop type if exists public.user_role cascade;
create type public.user_role as enum (
  'developer',      -- Разработчик
  'owner',          -- Владелец
  'director',       -- Директор
  'head_admin',     -- Главный Администратор
  'admin',          -- Администратор
  'user'            -- Пользователь
);

-- 2. Таблица префиксов (настраиваются только для ролей выше admin)
create table public.user_prefixes (
  id          uuid primary key default gen_random_uuid(),
  role        public.user_role not null,
  prefix      text not null,        -- визуальный префикс, например [DEV], [OWNER]
  color       text not null default '#ff6a00',  -- цвет префикса
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (role, prefix)
);

-- Начальные префиксы
insert into public.user_prefixes (role, prefix, color, sort_order) values
  ('developer',    '[DEV]',    '#00f0ff', 1),
  ('owner',        '[OWNER]',  '#ff6a00', 2),
  ('director',     '[DIR]',    '#a855f7', 3),
  ('head_admin',   '[HEAD]',   '#ef4444', 4),
  ('admin',        '[ADM]',    '#22c55e', 5),
  ('user',         '',         '#ffffff', 6);

-- 3. Таблица чата
create table public.chat_messages (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  content       text not null check (char_length(content) <= 500),
  is_deleted    boolean not null default false,
  is_muted      boolean not null default false,  -- флаг мута отправителя
  created_at    timestamptz not null default now()
);

create index chat_messages_created_idx on public.chat_messages (user_id, created_at desc);

-- 4. Таблица банов в чате
create table public.chat_bans (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  banned_by     uuid not null references public.profiles (id),
  reason        text,
  expires_at    timestamptz,  -- null = вечный бан
  created_at    timestamptz not null default now(),
  unique (user_id, banned_by)
);

-- 5. Функция проверки бана в чате
create or replace function public.is_chat_banned(p_user_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from chat_bans
    where user_id = p_user_id
      and (expires_at is null or expires_at > now())
  );
$$;

-- 6. Функция получения префикса пользователя
create or replace function public.get_user_prefix(p_role public.user_role)
returns text language sql stable as $$
  select prefix from user_prefixes
  where role = p_role and is_active
  order by sort_order asc
  limit 1;
$$;

-- 7. RLS для чата
alter table public.chat_messages enable row level security;
alter table public.chat_bans enable row level security;
alter table public.user_prefixes enable row level security;

-- Чат: все читают, пишут свои сообщения
create policy "public read chat" on public.chat_messages for select using (true);
create policy "user write chat" on public.chat_messages for insert with check (user_id = auth.uid());
create policy "user delete own chat" on public.chat_messages for delete using (user_id = auth.uid() or exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'manager', 'head_admin', 'director', 'owner', 'developer')));

-- Бан чата: только админы
create policy "admin manage bans" on public.chat_bans for all using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'manager', 'head_admin', 'director', 'owner', 'developer')));

-- Префиксы: все читают, админы пишут
create policy "public read prefixes" on public.user_prefixes for select using (true);
create policy "admin write prefixes" on public.user_prefixes for all using (exists (select 1 from profiles where id = auth.uid() and role in ('head_admin', 'director', 'owner', 'developer')));

-- 8. Updated_at trigger для чата
create trigger chat_messages_updated_at before update on public.chat_messages
  for each row execute function public.touch_updated_at();
