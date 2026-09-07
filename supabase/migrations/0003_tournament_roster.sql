-- ============================================================
-- PIXEL Cyberclub — Tournament Roster Table
-- ============================================================

create table public.tournament_roster (
  id              uuid primary key default gen_random_uuid(),
  tournament_id   uuid not null references public.tournaments (id) on delete cascade,
  participant_id  uuid not null references public.tournament_participants (id) on delete cascade,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  nickname        text not null,
  role            text default 'player',  -- 'captain', 'player', 'substitute'
  registered_at   timestamptz not null default now(),
  unique (tournament_id, user_id)
);

create index tournament_roster_tournament_idx on public.tournament_roster (tournament_id);
create index tournament_roster_participant_idx on public.tournament_roster (participant_id);
