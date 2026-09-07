-- ============================================================
-- PIXEL Cyberclub — Club status (open / closed / special)
-- ============================================================

create type public.club_status as enum ('open', 'closed', 'special');

alter table public.clubs
  add column status public.club_status not null default 'open';

-- Спец-обслуживание: клуб открыт, но часть мест зарезервирована под мероприятие
comment on column public.clubs.status is
  'Режим работы: open — открыто, closed — закрыто, special — спец-обслуживание';
