// ============================================================
// Демо-данные клубов и ПК — используются для публичных страниц.
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
  zone: string;
  status: "available" | "busy" | "reserved" | "maintenance";
  pricePerHour: number;
  gridX: number;
  gridY: number;
  specs: PcSpecs;
}

export const ZONE_PRICES: Record<string, number> = {
  standart: 5,
  vip: 7,
  duo: 8,
  MID: 5,
  SPACE: 6,
  TRIO: 7,
};

export const ZONE_INFO: Record<string, { label: string; desc: string }> = {
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

      // Определяем зону для БД
      let zoneType = "standart";
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