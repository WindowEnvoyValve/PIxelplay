-- ============================================================
-- PIXEL Cyberclub — Initial Schema
-- Supabase / PostgreSQL migration
-- ============================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
create type public.user_role as enum ('user', 'manager', 'admin');

-- 5 уровней программы лояльности «LETS PLAY»
create type public.loyalty_level as enum ('rookie', 'bronze', 'silver', 'gold', 'legend');

create type public.zone_type as enum ('standart', 'vip', 'duo');

create type public.computer_status as enum ('available', 'busy', 'reserved', 'maintenance', 'offline');

create type public.booking_status as enum ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'no_show');

create type public.payment_method as enum ('money', 'bonuses', 'mixed');

create type public.transaction_type as enum ('topup', 'payment', 'bonus_accrual', 'bonus_spend', 'refund', 'admin_adjustment');

create type public.tournament_status as enum ('draft', 'registration', 'ongoing', 'finished', 'cancelled');

-- ------------------------------------------------------------
-- LOYALTY CONFIG (справочник уровней «LETS PLAY»)
-- hours_window: часы, накопленные за последние 3 месяца
-- ------------------------------------------------------------
create table public.loyalty_levels (
  id              public.loyalty_level primary key,
  title           text not null,
  min_hours       int  not null,
  cashback_percent int not null check (cashback_percent between 5 and 25),
  color           text not null default '#00f0ff',
  sort_order      int  not null
);

insert into public.loyalty_levels (id, title, min_hours, cashback_percent, color, sort_order) values
  ('rookie', 'Rookie', 0,   5,  '#9ca3af', 1),
  ('bronze', 'Bronze', 50,  10, '#cd7f32', 2),
  ('silver', 'Silver', 150, 15, '#e5e5e5', 3),
  ('gold',   'Gold',   300, 20, '#ff9040', 4),
  ('legend', 'Legend', 600, 25, '#ff6a00', 5);

-- ------------------------------------------------------------
-- PROFILES (расширение auth.users)
-- ------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  role          public.user_role not null default 'user',
  nickname      text unique not null,
  avatar_url    text,
  phone         text,
  birth_date    date,
  steam_id      text unique,
  steam_profile jsonb,               -- кэш данных Steam (ник, аватар, уровень)
  showcase_skin text default '★ Survival Knife | Marble Fade',  -- скин-витрина профиля
  loyalty_level public.loyalty_level not null default 'rookie',
  hours_3m      numeric(10,2) not null default 0,   -- часы за скользящие 3 месяца
  total_hours   numeric(10,2) not null default 0,
  balance       numeric(10,2) not null default 0,   -- деньги, ₽
  bonus_balance int not null default 0,             -- бонусные баллы LETS PLAY
  birthday_bonus_year int,                          -- год, за который начислен ДР-бонус
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index profiles_loyalty_idx on public.profiles (loyalty_level);
create index profiles_role_idx on public.profiles (role);

-- ------------------------------------------------------------
-- CLUBS
-- ------------------------------------------------------------
create table public.clubs (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,          -- 'play', 'centre', 'metro'
  name        text not null,
  address     text not null,
  phone       text,
  location    jsonb not null,                -- {lat, lng} для карты
  layout_json jsonb not null default '{}'::jsonb,  -- интерактивная схема зала: зоны, сетка ПК
  open_hours  jsonb not null default '{"open":"10:00","close":"02:00"}'::jsonb,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into public.clubs (slug, name, address, phone, location, layout_json, open_hours) values
  ('play',   'PIXEL Play',   'ул. Мовчанского, 53Б', '+375293193015', '{"lat": 53.9022, "lng": 30.3359}', '{"zones":["standart","standart_plus","vip1","vip2","duo"]}', '{"open":"00:00","close":"23:59","always":true}'),
  ('centre', 'PIXEL Centre', 'ул. Космонавтов, 2',   '+375293193015', '{"lat": 53.9007, "lng": 30.3314}', '{"zones":["standart","standart_plus","vip1","vip2"]}', '{"open":"00:00","close":"23:59","always":true}'),
  ('metro',  'PIXEL Metro',  'ул. Мигая, 13',        '+375293193015', '{"lat": 53.8981, "lng": 30.3392}', '{"zones":["mid","space","duo","trio","vip"]}', '{"open":"00:00","close":"23:59","always":true}');

-- ------------------------------------------------------------
-- COMPUTERS
-- ------------------------------------------------------------
create table public.computers (
  id         uuid primary key default gen_random_uuid(),
  club_id    uuid not null references public.clubs (id) on delete cascade,
  number     int  not null,
  zone_type  public.zone_type not null default 'standart',
  specs      jsonb not null default '{}'::jsonb,  -- {cpu, gpu, monitor, refresh_rate, chair, peripherals}
  status     public.computer_status not null default 'available',
  price_per_hour numeric(10,2) not null default 200,
  grid_pos   jsonb,                               -- {x, y} позиция на схеме зала
  remote_agent_id text,                            -- ID для локального ПО управления ПК
  unique (club_id, number)
);

create index computers_club_idx on public.computers (club_id, zone_type, status);

-- ------------------------------------------------------------
-- BOOKINGS
-- ------------------------------------------------------------
create table public.bookings (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  club_id       uuid not null references public.clubs (id) on delete cascade,
  pc_id         uuid not null references public.computers (id) on delete cascade,
  start_time    timestamptz not null,
  end_time      timestamptz not null,
  status        public.booking_status not null default 'pending',
  payment_method public.payment_method not null default 'money',
  total_price   numeric(10,2) not null default 0,
  bonuses_used  int not null default 0,            -- до 50% чека
  cashback_earned int not null default 0,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (end_time > start_time)
);

create index bookings_user_idx on public.bookings (user_id, start_time desc);
create index bookings_club_time_idx on public.bookings (club_id, start_time);
create index bookings_status_idx on public.bookings (status);

-- ------------------------------------------------------------
-- TRANSACTIONS (детализация баланса и бонусов)
-- ------------------------------------------------------------
create table public.transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  booking_id    uuid references public.bookings (id) on delete set null,
  type          public.transaction_type not null,
  amount        numeric(10,2) not null,            -- деньги (+/-)
  bonus_amount  int not null default 0,            -- баллы (+/-)
  description   text,
  created_by    uuid references public.profiles (id),  -- админ при ручных операциях
  created_at    timestamptz not null default now()
);

create index transactions_user_idx on public.transactions (user_id, created_at desc);

-- ------------------------------------------------------------
-- TOURNAMENTS
-- ------------------------------------------------------------
create table public.tournaments (
  id            uuid primary key default gen_random_uuid(),
  club_id       uuid references public.clubs (id) on delete set null,
  title         text not null,
  game          text not null,                     -- 'CS2', 'Dota 2', ...
  discipline    text,
  description   text,
  prize_pool    numeric(10,2) not null default 0,
  entry_fee     numeric(10,2) not null default 0,
  max_teams     int not null default 16,
  team_size     int not null default 5,
  starts_at     timestamptz not null,
  status        public.tournament_status not null default 'draft',
  bracket_json  jsonb not null default '{}'::jsonb,   -- сетка турнира
  stream_url    text,                                 -- Twitch/YouTube интеграция
  cover_url     text,
  created_at    timestamptz not null default now()
);

create table public.tournament_participants (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  team_name     text,
  seed          int,
  place         int,
  registered_at timestamptz not null default now(),
  unique (tournament_id, user_id)
);

-- ------------------------------------------------------------
-- WEBHOOKS (API для Telegram-ботов и внешних интеграций)
-- ------------------------------------------------------------
create table public.webhook_endpoints (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  url        text not null,
  secret     text not null default gen_random_uuid()::text,
  events     text[] not null default '{booking.created,system.alert}'::text[],
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.webhook_logs (
  id          uuid primary key default gen_random_uuid(),
  endpoint_id uuid references public.webhook_endpoints (id) on delete cascade,
  event_type  text not null,
  payload     jsonb not null,
  status_code int,
  is_delivered boolean not null default false,
  attempts    int not null default 0,
  created_at  timestamptz not null default now()
);

create index webhook_logs_undelivered_idx on public.webhook_logs (is_delivered, created_at)
  where not is_delivered;

-- ------------------------------------------------------------
-- HELPERS
-- ------------------------------------------------------------

-- Проверка роли текущего пользователя (для RLS)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'manager')
  );
$$;

-- Авто-создание профиля при регистрации
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nickname', 'player_' || left(new.id::text, 8))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Пересчёт уровня лояльности по часам за 3 месяца
create or replace function public.calc_loyalty_level(p_hours numeric)
returns public.loyalty_level language sql stable as $$
  select l.id from public.loyalty_levels l
  where p_hours >= l.min_hours
  order by l.sort_order desc
  limit 1;
$$;

-- Пересчёт часов за 3 месяца + уровень (вызывается после завершения сессии)
create or replace function public.refresh_loyalty(p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_hours numeric;
begin
  select coalesce(sum(extract(epoch from (end_time - start_time)) / 3600), 0)
    into v_hours
  from bookings
  where user_id = p_user_id
    and status = 'completed'
    and start_time >= now() - interval '3 months';

  update profiles
     set hours_3m = v_hours,
         loyalty_level = public.calc_loyalty_level(v_hours)
   where id = p_user_id;
end;
$$;

-- Начисление кешбэка после завершённой сессии (LETS PLAY: 5–25%)
create or replace function public.accrue_booking_cashback()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_cashback int;
  v_percent  int;
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    select cashback_percent into v_percent
    from loyalty_levels where id = (select loyalty_level from profiles where id = new.user_id);

    v_cashback := floor(new.total_price * coalesce(v_percent, 5) / 100)::int;

    update profiles set bonus_balance = bonus_balance + v_cashback where id = new.user_id;
    update bookings set cashback_earned = v_cashback where id = new.id;

    insert into transactions (user_id, booking_id, type, bonus_amount, description)
    values (new.user_id, new.id, 'bonus_accrual', v_cashback,
            format('Кешбэк LETS PLAY %s%% за сессию', v_percent));

    perform public.refresh_loyalty(new.user_id);
  end if;
  return new;
end;
$$;

create trigger on_booking_completed
  after update on public.bookings
  for each row execute function public.accrue_booking_cashback();

-- Бонус 15 баллов на День рождения (вызывать RPC раз в сутки из cron/бота)
create or replace function public.award_birthday_bonuses()
returns int language plpgsql security definer set search_path = public as $$
declare
  v_count int := 0;
  r record;
begin
  for r in
    select id from profiles
    where birth_date is not null
      and extract(month from birth_date) = extract(month from now())
      and extract(day from birth_date) = extract(day from now())
      and (birthday_bonus_year is null or birthday_bonus_year < extract(year from now()))
  loop
    update profiles
       set bonus_balance = bonus_balance + 15,
           birthday_bonus_year = extract(year from now())
     where id = r.id;

    insert into transactions (user_id, type, bonus_amount, description)
    values (r.id, 'bonus_accrual', 15, 'С Днём Рождения! Бонус от PIXEL');

    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- Свободные ПК клуба в интервале (для виджета и сетки бронирования)
create or replace function public.get_available_pcs(
  p_club_id uuid,
  p_start timestamptz,
  p_end timestamptz
)
returns setof public.computers
language sql stable security definer set search_path = public as $$
  select c.* from computers c
  where c.club_id = p_club_id
    and c.status in ('available', 'reserved')
    and not exists (
      select 1 from bookings b
      where b.pc_id = c.id
        and b.status in ('pending', 'confirmed', 'active')
        and b.start_time < p_end
        and b.end_time > p_start
    );
$$;

-- Outbox: при бронировании кладём событие для webhook-воркера (Telegram-бот)
create or replace function public.enqueue_webhook_event()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into webhook_logs (event_type, payload)
  values (
    'booking.created',
    jsonb_build_object(
      'booking_id', new.id,
      'user', (select nickname from profiles where id = new.user_id),
      'club', (select name from clubs where id = new.club_id),
      'pc', (select number from computers where id = new.pc_id),
      'start_time', new.start_time,
      'end_time', new.end_time,
      'total_price', new.total_price,
      'bonuses_used', new.bonuses_used
    )
  );
  return new;
end;
$$;

create trigger on_booking_created
  after insert on public.bookings
  for each row execute function public.enqueue_webhook_event();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.clubs enable row level security;
alter table public.computers enable row level security;
alter table public.bookings enable row level security;
alter table public.transactions enable row level security;
alter table public.loyalty_levels enable row level security;
alter table public.tournaments enable row level security;
alter table public.tournament_participants enable row level security;
alter table public.webhook_endpoints enable row level security;
alter table public.webhook_logs enable row level security;

-- profiles
create policy "own profile read"   on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "own profile update" on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "admin manage profiles" on public.profiles for all using (public.is_admin());

-- clubs / computers / loyalty — публичное чтение, админ — запись
create policy "public read clubs"     on public.clubs     for select using (is_active or public.is_admin());
create policy "admin write clubs"     on public.clubs     for all using (public.is_admin());
create policy "public read computers" on public.computers for select using (true);
create policy "admin write computers" on public.computers for all using (public.is_admin());
create policy "public read loyalty"   on public.loyalty_levels for select using (true);
create policy "admin write loyalty"   on public.loyalty_levels for all using (public.is_admin());

-- bookings
create policy "own bookings read"    on public.bookings for select using (user_id = auth.uid() or public.is_admin());
create policy "own bookings insert"  on public.bookings for insert with check (user_id = auth.uid());
create policy "own bookings cancel"  on public.bookings for update
  using (user_id = auth.uid() and status in ('pending', 'confirmed'))
  with check (user_id = auth.uid());
create policy "admin manage bookings" on public.bookings for all using (public.is_admin());

-- transactions — только чтение своих, запись через SECURITY DEFINER-функции и админа
create policy "own transactions read" on public.transactions for select using (user_id = auth.uid() or public.is_admin());
create policy "admin write transactions" on public.transactions for all using (public.is_admin());

-- tournaments
create policy "public read tournaments"   on public.tournaments for select using (true);
create policy "admin write tournaments"   on public.tournaments for all using (public.is_admin());
create policy "public read participants"  on public.tournament_participants for select using (true);
create policy "join tournaments"          on public.tournament_participants for insert with check (user_id = auth.uid());
create policy "admin manage participants" on public.tournament_participants for all using (public.is_admin());

-- webhooks — только админ
create policy "admin webhooks" on public.webhook_endpoints for all using (public.is_admin());
create policy "admin webhook logs" on public.webhook_logs for all using (public.is_admin());

-- ------------------------------------------------------------
-- UPDATED_AT trigger
-- ------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.touch_updated_at();
