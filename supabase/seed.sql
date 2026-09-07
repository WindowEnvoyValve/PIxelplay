-- ============================================================
-- PIXELPLAY — Seed data (локальная разработка)
-- ============================================================

-- COMPUTERS: сетка ПК для каждого клуба
insert into public.computers (club_id, number, zone_type, specs, status, price_per_hour, grid_pos)
select
  c.id,
  gs.num,
  case
    when gs.num % 10 = 0 then 'duo'::public.zone_type
    when gs.num <= 5 then 'vip'::public.zone_type
    else 'standart'::public.zone_type
  end,
  jsonb_build_object(
    'cpu', case when gs.num % 3 = 0 then 'AMD Ryzen 7 7800X3D' when gs.num % 3 = 1 then 'Intel i7-14700K' else 'Intel i5-14400F' end,
    'gpu', case when gs.num % 4 = 0 then 'RTX 5080 16GB' when gs.num % 4 = 1 then 'RTX 4080 Super' when gs.num % 4 = 2 then 'RTX 5070 Ti' else 'RTX 4070 Super' end,
    'monitor', case when gs.num % 2 = 0 then 'Zowie XL2586X 540Hz' else 'LG UltraGear 27GP950 240Hz' end,
    'chair', case when gs.num <= 5 then 'Brave Pro X' else 'Lorgar Ranger 743' end
  ),
  case when gs.num % 17 = 0 then 'maintenance'::public.computer_status else 'available'::public.computer_status end,
  case
    when gs.num % 10 = 0 then 8
    when gs.num <= 5 then 6
    else 4
  end,
  jsonb_build_object('x', (gs.num - 1) % 8 + 1, 'y', floor((gs.num - 1) / 8) + 1)
from public.clubs c
cross join generate_series(1, 40) as gs(num);

-- TOURNAMENTS
insert into public.tournaments (club_id, title, game, discipline, description, prize_pool, entry_fee, max_teams, team_size, starts_at, status, stream_url) values
  ((select id from public.clubs where slug = 'centre'),
   'PIXEL CS2 Autumn Cup', 'CS2', 'FPS',
   'Открытый кубок по Counter-Strike 2. Format: Bo1 groups → Bo3 playoffs. Регистрация команд из 5 игроков.',
   50000, 500, 16, 5, now() + interval '7 days', 'registration', 'https://twitch.tv/pixelPlay'),

  ((select id from public.clubs where slug = 'play'),
   'Dota 2 Night League', 'Dota 2', 'MOBA',
   'Еженедельная лига по Dota 2. Игры каждую пятницу с 19:00. Призовой фонд растёт каждую неделю.',
   25000, 300, 8, 5, now() + interval '3 days', 'registration', null),

  ((select id from public.clubs where slug = 'metro'),
   'FIFA Friday #12', 'EA FC 26', 'Sports',
   'Вечерний турнир по EA FC 26. 1v1, двойное выбывание, 32 участника.',
   10000, 200, 32, 1, now() + interval '5 days', 'registration', null),

  ((select id from public.clubs where slug = 'centre'),
   'Valorant Clash', 'Valorant', 'FPS',
   'Турнир по Valorant для команд из 5 игроков. Bo1 до полуфиналов, далее Bo3.',
   30000, 400, 12, 5, now() + interval '14 days', 'registration', null),

  ((select id from public.clubs where slug = 'play'),
   'Mortal Kombat 1 Cup', 'MK1', 'Fighting',
   'Турнир по файтингам. Приходи и покажи, кто здесь настоящий шаолинь!',
   8000, 150, 16, 1, now() - interval '5 days', 'finished', null);
