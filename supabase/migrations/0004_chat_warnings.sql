-- Предупреждения в чате
create table if not exists public.chat_warnings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  reason      text,
  created_at  timestamptz not null default now()
);

create index chat_warnings_user_idx on public.chat_warnings (user_id, created_at desc);
