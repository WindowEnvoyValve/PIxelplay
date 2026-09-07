import type { ZoneType, Profile } from "@/types";

// ============================================================
// Демо-данные — используются пока Supabase не подключён.
// Структура полностью совпадает с типами БД, поэтому
// позже достаточно заменить источник на реальный fetch.
// ============================================================

/** Детерминированный псевдорандом (без hydration-мисматчей) */
function seeded(i: number, salt = 1): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export interface PcSpecs {
  cpu: string;
  gpu: string;
  monitor: string;
  refresh: number;
  chair: string;
  mouse: string;
  keyboard: string;
}

export interface Pc {
  id: string;
  clubId: string;
  number: number;
  zone: ZoneType;
  status: "available" | "busy" | "reserved" | "maintenance";
  pricePerHour: number;
  gridX: number;
  gridY: number;
  specs: PcSpecs;
}

const GPUS = ["RTX 5080 16GB", "RTX 4080 Super", "RTX 4070 Super", "RTX 5070 Ti"];
const CPUS = ["Intel i7-14700K", "AMD Ryzen 7 7800X3D", "Intel i5-14400F"];
const CHAIRS = ["Brave Pro X", "Lorgar Ranger 743"];
const MICE = ["Logitech G Pro X Superlight 2", "Razer Viper V3 Pro", "Zowie EC2-CW"];
const KEYS = ["Wooting 60HE", "Razer Huntsman V3 Pro", "Logitech G Pro X TKL"];

export const ZONE_PRICES: Record<string, number> = {
  standart: 5,
  vip: 7,
  duo: 8,
  MID: 5,
  SPACE: 6,
  TRIO: 7,
};

export const ZONE_INFO: Record<ZoneType, { label: string; desc: string }> = {
  standart: { label: "STANDART", desc: "RTX 4070 Super · 240Hz · идеален для CS2 и Dota 2" },
  vip: { label: "VIP", desc: "RTX 5080 · 360Hz · кресла Brave Pro · отдельная комната" },
  duo: { label: "DUO", desc: "Два места за одним столом · для игры вдвоём с другом" },
};

/** Реальные спецификации для каждого клуба и зоны */
const CLUB_SPECS: Record<string, Record<string, PcSpecs>> = {
  "club-play": {
    STANDART: {
      cpu: "Intel i7-14700K",
      gpu: "RTX 4070 Super",
      monitor: "ZOWIE XL2586X",
      refresh: 360,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
    "STANDART+": {
      cpu: "Intel i7-14700K",
      gpu: "RTX 4070 Super",
      monitor: "ZOWIE XL2586X",
      refresh: 360,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
    "VIP[1]": {
      cpu: "Intel i7-14700K",
      gpu: "RTX 5080 16GB",
      monitor: "ZOWIE XL2586X",
      refresh: 360,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
    "VIP[2]": {
      cpu: "Intel i7-14700K",
      gpu: "RTX 5080 16GB",
      monitor: "ZOWIE XL2586X",
      refresh: 360,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
    DUO: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "RTX 5070 Ti",
      monitor: "ZOWIE XL2586X",
      refresh: 360,
      chair: "Lorgar Ranger 743",
      mouse: "Logitech G Pro X Superlight 2",
      keyboard: "Wooting 60HE",
    },
  },
  "club-centre": {
    STANDART: {
      cpu: "Intel i7-14700K",
      gpu: "RTX 4070 Super",
      monitor: "ZOWIE XL2586X",
      refresh: 240,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
    "STANDART+": {
      cpu: "Intel i5-14400F",
      gpu: "RTX 4070 Super",
      monitor: "ZOWIE XL2586X",
      refresh: 240,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
    "VIP[1]": {
      cpu: "Intel i7-14700K",
      gpu: "RTX 4070 Super",
      monitor: "ZOWIE XL2586X",
      refresh: 240,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
    "VIP[2]": {
      cpu: "Intel i7-14700K",
      gpu: "RTX 4070 Super",
      monitor: "ZOWIE XL2586X",
      refresh: 240,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
  },
  "club-metro": {
    MID: {
      cpu: "Intel i5-10400F",
      gpu: "GeForce 4060",
      monitor: '27" 165Hz',
      refresh: 165,
      chair: "Brave Pro X",
      mouse: "Logitech G Pro X Superlight 2",
      keyboard: "Logitech G Pro X TKL",
    },
    SPACE: {
      cpu: "Intel i5-12400F",
      gpu: "GeForce RTX 4060",
      monitor: '27" 240Hz',
      refresh: 240,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
    DUO: {
      cpu: "AMD Ryzen 5 7500F",
      gpu: "GeForce RTX 5070 12GB",
      monitor: '24,5" 320Hz',
      refresh: 320,
      chair: "Lorgar Ranger 743",
      mouse: "Logitech G Pro X Superlight 2",
      keyboard: "Wooting 60HE",
    },
    TRIO: {
      cpu: "AMD Ryzen 5 7500F",
      gpu: "GeForce RTX 5060",
      monitor: '24,5" 320Hz',
      refresh: 320,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
    VIP: {
      cpu: "AMD Ryzen 5 7500F",
      gpu: "GeForce RTX 5060",
      monitor: '24,5" 320Hz',
      refresh: 320,
      chair: "Brave Pro X",
      mouse: "Razer Viper V3 Pro",
      keyboard: "Logitech G Pro X TKL",
    },
  },
};

/** Распределение ПК по зонам для каждого клуба */
const PC_DISTRIBUTION: Record<string, Record<string, number>> = {
  "club-play": { STANDART: 15, "STANDART+": 10, "VIP[1]": 8, "VIP[2]": 4, DUO: 2 },
  "club-centre": { STANDART: 12, "STANDART+": 10, "VIP[1]": 7, "VIP[2]": 4 },
  "club-metro": { MID: 15, SPACE: 12, DUO: 5, TRIO: 4, VIP: 3 },
};

/** Генерация парка ПК клуба с реальными спецификациями */
function generatePcs(clubId: string, distribution: Record<string, number>, seed: number): Pc[] {
  const cols = 8;
  const clubSpecs = CLUB_SPECS[clubId] ?? {};
  const pcs: Pc[] = [];
  let pcNumber = 1;

  for (const [zone, count] of Object.entries(distribution)) {
    const specs = clubSpecs[zone];
    if (!specs) continue;

    for (let i = 0; i < count; i++) {
      const statusRoll = seeded(pcNumber, seed + 7);
      const status: Pc["status"] =
        statusRoll > 0.85 ? "busy" : statusRoll > 0.78 ? "reserved" : statusRoll > 0.75 ? "maintenance" : "available";

      // Определяем ZoneType для БД
      let zoneType: ZoneType = "standart";
      if (zone === "DUO" || zone === "TRIO" || zone === "VIP" || zone === "VIP[1]" || zone === "VIP[2]") zoneType = "vip";
      if (zone === "DUO") zoneType = "duo";

      pcs.push({
        id: `${clubId}-pc-${pcNumber}`,
        clubId,
        number: pcNumber,
        zone: zoneType,
        status,
        pricePerHour: ZONE_PRICES[zoneType],
        gridX: pcNumber % cols,
        gridY: Math.floor(pcNumber / cols),
        specs,
      });
      pcNumber++;
    }
  }

  return pcs;
}

export interface DemoClub {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  pcs: Pc[];
  features: string[];
  yandexMapsUrl: string;
  zones: string[];
}

export const DEMO_CLUBS: DemoClub[] = [
  {
    id: "club-play",
    slug: "play",
    name: "Pixel Play",
    address: "ул. Мовчанского, 53Б",
    phone: "+375 29 319 30 15",
    hours: "Круглосуточно",
    pcs: generatePcs("club-play", PC_DISTRIBUTION["club-play"], 1),
    features: [
      "PS5",
      "Wi-Fi",
      "Снек-бар",
      "Парковка",
      "Кондиционер",
    ],
    yandexMapsUrl: "https://yandex.ru/maps/?text=ул.+Мовчанского,+53Б,+Могилев",
    zones: ["STANDART", "STANDART+", "VIP[1]", "VIP[2]", "DUO"],
  },
  {
    id: "club-centre",
    slug: "centre",
    name: "Pixel Centre",
    address: "ул. Космонавтов 2",
    phone: "+375 29 319 30 15",
    hours: "Круглосуточно",
    pcs: generatePcs("club-centre", PC_DISTRIBUTION["club-centre"], 2),
    features: [
      "PS5",
      "Wi-Fi",
      "Снек-бар",
      "Парковка",
      "Кондиционер",
    ],
    yandexMapsUrl: "https://yandex.ru/maps/?text=ул.+Космонавтов,+2,+Могилев",
    zones: ["STANDART", "STANDART+", "VIP[1]", "VIP[2]"],
  },
  {
    id: "club-metro",
    slug: "metro",
    name: "Pixel Metro",
    address: "ул. Мигая 13",
    phone: "+375 29 319 30 15",
    hours: "Круглосуточно",
    pcs: generatePcs("club-metro", PC_DISTRIBUTION["club-metro"], 3),
    features: [
      "PS5",
      "Wi-Fi",
      "Снек-бар",
      "Парковка",
      "Кондиционер",
    ],
    yandexMapsUrl: "https://yandex.ru/maps/?text=пер.+Мигая,+13,+Могилев",
    zones: ["MID", "SPACE", "DUO", "TRIO", "VIP"],
  },
];

export function freePcsCount(club: DemoClub): number {
  return club.pcs.filter((p) => p.status === "available").length;
}

// ============================================================
// Демо-профиль игрока
// ============================================================
export const LOYALTY_TIERS = [
  { id: "rookie", title: "Rookie", minHours: 0, cashback: 5 },
  { id: "bronze", title: "Bronze", minHours: 50, cashback: 10 },
  { id: "silver", title: "Silver", minHours: 150, cashback: 15 },
  { id: "gold", title: "Gold", minHours: 300, cashback: 20 },
  { id: "legend", title: "Legend", minHours: 600, cashback: 25 },
] as const;

export const DEMO_PROFILE: Profile & { hoursToNext: number; nextLevel: string | null } = {
  id: "demo-user",
  role: "user",
  nickname: "ShadowFrag",
  avatar_url: null,
  phone: "+7 (914) 555-77-77",
  birth_date: "2001-03-15",
  steam_id: "76561198042196537",
  steam_profile: { level: 87, games: 214, hoursTotal: 4820 },
  showcase_skin: "★ Survival Knife | Marble Fade",
  loyalty_level: "gold",
  hours_3m: 274,
  total_hours: 1128,
  balance: 3200,
  bonus_balance: 4200,
  birthday_bonus_year: 2026,
  created_at: "2024-06-01T10:00:00Z",
  updated_at: "2026-09-01T10:00:00Z",
  hoursToNext: 26,
  nextLevel: "Legend",
};

export interface DemoSession {
  id: string;
  club: string;
  pc: string;
  zone: ZoneType;
  date: string;
  hours: number;
  price: number;
  bonusesUsed: number;
  cashback: number;
}

export const DEMO_SESSIONS: DemoSession[] = [
  { id: "s1", club: "PIXEL Centre", pc: "PC #23", zone: "vip", date: "2026-09-05 18:30", hours: 4, price: 24, bonusesUsed: 0, cashback: 0 },
  { id: "s2", club: "PIXEL Play", pc: "PC #07", zone: "standart", date: "2026-09-03 20:00", hours: 5, price: 20, bonusesUsed: 0, cashback: 0 },
  { id: "s3", club: "PIXEL Centre", pc: "PC #41", zone: "duo", date: "2026-08-30 16:00", hours: 3, price: 24, bonusesUsed: 0, cashback: 0 },
  { id: "s4", club: "PIXEL Metro", pc: "PC #12", zone: "standart", date: "2026-08-27 19:00", hours: 6, price: 24, bonusesUsed: 0, cashback: 0 },
  { id: "s5", club: "PIXEL Centre", pc: "PC #18", zone: "vip", date: "2026-08-24 14:00", hours: 8, price: 48, bonusesUsed: 0, cashback: 0 },
];

export interface DemoTransaction {
  id: string;
  type: "topup" | "payment" | "bonus_accrual" | "bonus_spend";
  description: string;
  amount: number;
  bonusAmount: number;
  date: string;
}

export const DEMO_TRANSACTIONS: DemoTransaction[] = [];

// ============================================================
// Турниры
// ============================================================
export interface DemoTournament {
  id: string;
  title: string;
  game: string;
  prize: string;
  entry: string;
  date: string;
  teams: string;
  status: "registration" | "ongoing" | "finished";
  stream?: string;
  cover: string; // градиент для обложки
}

export const DEMO_TOURNAMENTS: DemoTournament[] = [
  {
    id: "tr1",
    title: "PIXEL CS2 Cup — Season 8",
    game: "CS2",
    prize: "2 000 руб",
    entry: "30 руб/команда",
    date: "20 сентября, 18:00",
    teams: "16 / 16 команд",
    status: "ongoing",
    stream: "twitch.tv/pixel_cyberclub",
    cover: "from-orange-600/40 via-void to-void",
  },
  {
    id: "tr2",
    title: "Dota 2 — Battle of Mogilev",
    game: "Dota 2",
    prize: "1 200 руб",
    entry: "Бесплатно",
    date: "27 сентября, 14:00",
    teams: "12 / 16 команд",
    status: "registration",
    cover: "from-red-700/30 via-void to-void",
  },
  {
    id: "tr3",
    title: "Valorant Night #14",
    game: "Valorant",
    prize: "600 руб",
    entry: "18 руб/команда",
    date: "4 октября, 19:00",
    teams: "8 / 8 команд",
    status: "registration",
    cover: "from-rose-600/30 via-void to-void",
  },
];

export interface BracketMatch {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  winner: "A" | "B" | null;
}

export interface BracketRound {
  name: string;
  matches: BracketMatch[];
}

export const DEMO_BRACKET: BracketRound[] = [
  {
    name: "1/4 финала",
    matches: [
      { teamA: "Team Spirit", teamB: "Nemiga", scoreA: 13, scoreB: 7, winner: "A" },
      { teamA: "9Pandas", teamB: "B8", scoreA: 10, scoreB: 13, winner: "B" },
      { teamA: "SINNERS", teamB: "RoundsGG", scoreA: 13, scoreB: 9, winner: "A" },
      { teamA: " Monte", teamB: "1WIN", scoreA: 13, scoreB: 11, winner: "A" },
    ],
  },
  {
    name: "1/2 финала",
    matches: [
      { teamA: "Team Spirit", teamB: "B8", scoreA: 2, scoreB: 0, winner: "A" },
      { teamA: "SINNERS", teamB: "Monte", scoreA: 1, scoreB: 2, winner: "B" },
    ],
  },
  {
    name: "Финал",
    matches: [
      { teamA: "Team Spirit", teamB: "Monte", scoreA: 0, scoreB: 0, winner: null },
    ],
  },
];

// ============================================================
// Админ-панель (демо)
// ============================================================
export interface AdminUser {
  id: string;
  nickname: string;
  email: string;
  loyalty: string;
  hours3m: number;
  balance: number;
  bonus: number;
  steamLinked: boolean;
  status: "active" | "idle" | "banned";
}

export const ADMIN_USERS: AdminUser[] = [
  { id: "u1", nickname: "ShadowFrag", email: "shadow@pixel.gg", loyalty: "Gold", hours3m: 274, balance: 0, bonus: 0, steamLinked: true, status: "active" },
  { id: "u2", nickname: "Kv1nzy", email: "kv1nzy@mail.ru", loyalty: "Legend", hours3m: 640, balance: 0, bonus: 0, steamLinked: true, status: "active" },
  { id: "u3", nickname: "M1rra", email: "mirra@gmail.com", loyalty: "Silver", hours3m: 162, balance: 0, bonus: 0, steamLinked: false, status: "idle" },
  { id: "u4", nickname: "T1lted", email: "tilted@yandex.ru", loyalty: "Bronze", hours3m: 71, balance: 0, bonus: 0, steamLinked: true, status: "active" },
  { id: "u5", nickname: "NoScope_77", email: "noscope@pixel.gg", loyalty: "Rookie", hours3m: 12, balance: 0, bonus: 0, steamLinked: false, status: "idle" },
  { id: "u6", nickname: "CheaterPro", email: "cheat@spam.gg", loyalty: "Rookie", hours3m: 3, balance: 0, bonus: 0, steamLinked: false, status: "banned" },
];

// Тепловая карта: загрузка по часам (10:00 → 02:00) для каждого клуба, 0–100%
export const HEATMAP_HOURS = ["10", "12", "14", "16", "18", "20", "22", "00", "02"];
export const HEATMAP_DATA: Record<string, number[]> = {
  "PIXEL Play": [15, 25, 35, 55, 85, 95, 90, 70, 40],
  "PIXEL Centre": [20, 30, 45, 65, 95, 100, 95, 80, 55],
  "PIXEL Metro": [10, 20, 30, 45, 75, 85, 70, 45, 20],
};

export const ADMIN_STATS = {
  revenueToday: 874,
  revenueShift: 412,
  activeSessions: 87,
  totalPcs: 111,
  newUsersToday: 14,
  bonusesIssued: 0,
};

export interface AdminWebhookLog {
  id: string;
  event: string;
  payload: string;
  status: "delivered" | "failed" | "pending";
  time: string;
}

export const ADMIN_WEBHOOK_LOGS: AdminWebhookLog[] = [
  { id: "w1", event: "booking.created", payload: "ShadowFrag → PIXEL Centre, PC #23, 18:30–22:30, 24 руб", status: "delivered", time: "18:25:03" },
  { id: "w2", event: "system.alert", payload: "ПК #41 (Metro) перешёл в статус maintenance", status: "delivered", time: "17:58:41" },
  { id: "w3", event: "booking.created", payload: "Kv1nzy → PIXEL Play, PC #07, 20:00–01:00, 20 руб", status: "delivered", time: "19:54:12" },
  { id: "w4", event: "system.alert", payload: "Оплата не прошла: T1lted, 10 руб (timeout)", status: "failed", time: "19:31:57" },
  { id: "w5", event: "booking.created", payload: "M1rra → PIXEL Centre, PC #41, 16:00–19:00, 24 руб", status: "pending", time: "15:59:02" },
];

// ============================================================
// Steam-витрина: скины для фона профиля
// ============================================================
export interface ShowcaseSkin {
  id: string;
  name: string;
  rarity: "covert" | "knife" | "gloves";
  exterior: string;
  price: string;
  gradient: string; // градиент-заглушка вместо изображения
}

export const SHOWCASE_SKINS: ShowcaseSkin[] = [
  { id: "k1", name: "★ Survival Knife | Marble Fade", rarity: "knife", exterior: "Factory New", price: "780 руб", gradient: "from-yellow-400 via-red-500 to-blue-600" },
  { id: "k2", name: "★ Butterfly Knife | Doppler", rarity: "knife", exterior: "Factory New", price: "1 200 руб", gradient: "from-purple-500 via-blue-600 to-black" },
  { id: "k3", name: "AWP | Dragon Lore", rarity: "covert", exterior: "Field-Tested", price: "2 100 руб", gradient: "from-amber-500 via-yellow-700 to-amber-900" },
  { id: "k4", name: "AK-47 | Fire Serpent", rarity: "covert", exterior: "Minimal Wear", price: "650 руб", gradient: "from-lime-600 via-green-800 to-black" },
  { id: "k5", name: "M4A4 | Howl", rarity: "covert", exterior: "Factory New", price: "1 800 руб", gradient: "from-orange-500 via-red-700 to-black" },
  { id: "g1", name: "★ Sport Gloves | Pandora's Box", rarity: "gloves", exterior: "Field-Tested", price: "950 руб", gradient: "from-indigo-500 via-purple-800 to-black" },
];
