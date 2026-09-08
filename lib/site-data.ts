// ============================================================
// Статические данные публичного сайта PIXELPLAY.
// Содержит только контент: клубы, зоны, характеристики ПК, цены.
// ============================================================

export interface PcSpecs {
  cpu: string;
  gpu: string;
  ram: string;
  monitor: string;
  refreshRate: number;
  chair: string;
  mouse: string;
  keyboard: string;
}

export interface ClubZone {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  pcCount: number;
  specs: PcSpecs;
}

export type ClubStatus = "open" | "closed" | "temporarily_closed";

export interface Club {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone?: string;
  hours: string;
  status: ClubStatus;
  features: string[];
  mapUrl?: string;
  images: {
    club: string;
    hall: string;
  };
  zones: ClubZone[];
}

export type PricingTariff = "STANDART" | "STANDART+" | "VIP/TRIO" | "DUO" | "PS5";

export interface PricingRow {
  label: string;
  note?: string;
  prices?: Partial<Record<PricingTariff, number>>;
  dayPrices?: Partial<Record<Exclude<PricingTariff, "PS5">, number>>;
}

const METRO_ADDRESS = "ул. Мигая 13";

const STANDARD_DESCRIPTION =
  "Универсальный вариант на каждый день: комфортно, удобно, всё работает как надо. Самый популярный формат, когда нужен стабильный игровой опыт без сюрпризов.";
const STANDARD_PLUS_DESCRIPTION =
  "Улучшенная версия стандарта: больше комфорта и приятнее ощущения от посадки и игры. Берут те, кто любит «чуть лучше», но без перехода в VIP.";
const VIP_DESCRIPTION =
  "Максимум удобства и атмосферы для тех, кто ценит приватность и высокий уровень комфорта. Подходит для долгих сессий, важных каток, дней рождения и «сделайте красиво».";
const DUO_DESCRIPTION =
  "Зал для двоих: играете рядом, общаетесь, собираете командные связки и кайфуете вместе. Лучший выбор для пары, друзей или постоянного тиммейта.";

export const CLUBS: Club[] = [
  {
    id: "club-play",
    slug: "play",
    name: "Pixel Play",
    address: "ул. Мовчанского, 53Б",
    phone: "+375 29 319 30 15",
    hours: "Круглосуточно",
    status: "open",
    features: ["PS5", "Wi-Fi", "Снек-бар", "Парковка", "Кондиционер"],
    mapUrl: "https://yandex.ru/maps/?text=ул.+Мовчанского,+53Б,+Могилев",
    images: { club: "/club-play.jpg", hall: "/hall-play.jpg" },
    zones: [
      {
        id: "play-standart",
        name: "STANDART",
        description: STANDARD_DESCRIPTION,
        pricePerHour: 5,
        pcCount: 15,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 4070 Super",
          ram: "16 GB",
          monitor: "ZOWIE XL2586X",
          refreshRate: 360,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        id: "play-standart-plus",
        name: "STANDART+",
        description: STANDARD_PLUS_DESCRIPTION,
        pricePerHour: 6,
        pcCount: 10,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 4070 Super",
          ram: "32 GB",
          monitor: "ZOWIE XL2586X",
          refreshRate: 360,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        id: "play-vip-1",
        name: "VIP[1]",
        description: VIP_DESCRIPTION,
        pricePerHour: 7,
        pcCount: 8,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 5080 16GB",
          ram: "32 GB",
          monitor: "ZOWIE XL2586X",
          refreshRate: 360,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        id: "play-vip-2",
        name: "VIP[2]",
        description: VIP_DESCRIPTION,
        pricePerHour: 7,
        pcCount: 4,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 5080 16GB",
          ram: "32 GB",
          monitor: "ZOWIE XL2586X",
          refreshRate: 360,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        id: "play-duo",
        name: "DUO",
        description: DUO_DESCRIPTION,
        pricePerHour: 8,
        pcCount: 2,
        specs: {
          cpu: "AMD Ryzen 7 7800X3D",
          gpu: "RTX 5070 Ti",
          ram: "64 GB",
          monitor: "ZOWIE XL2586X",
          refreshRate: 360,
          chair: "Lorgar Ranger 743",
          mouse: "Logitech G Pro X Superlight 2",
          keyboard: "Wooting 60HE",
        },
      },
    ],
  },
  {
    id: "club-centre",
    slug: "centre",
    name: "Pixel Centre",
    address: "ул. Космонавтов 2",
    phone: "+375 29 319 30 15",
    hours: "Круглосуточно",
    status: "open",
    features: ["PS5", "Wi-Fi", "Снек-бар", "Парковка", "Кондиционер"],
    mapUrl: "https://yandex.ru/maps/?text=ул.+Космонавтов,+2,+Могилев",
    images: { club: "/club-center.jpg", hall: "/hall-center.jpg" },
    zones: [
      {
        id: "centre-standart",
        name: "STANDART",
        description: STANDARD_DESCRIPTION,
        pricePerHour: 5,
        pcCount: 12,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 4070 Super",
          ram: "16 GB",
          monitor: "ZOWIE XL2586X",
          refreshRate: 240,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        id: "centre-standart-plus",
        name: "STANDART+",
        description: STANDARD_PLUS_DESCRIPTION,
        pricePerHour: 6,
        pcCount: 10,
        specs: {
          cpu: "Intel i5-14400F",
          gpu: "RTX 4070 Super",
          ram: "32 GB",
          monitor: "ZOWIE XL2586X",
          refreshRate: 240,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        id: "centre-vip-1",
        name: "VIP[1]",
        description: VIP_DESCRIPTION,
        pricePerHour: 7,
        pcCount: 7,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 4070 Super",
          ram: "32 GB",
          monitor: "ZOWIE XL2586X",
          refreshRate: 240,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        id: "centre-vip-2",
        name: "VIP[2]",
        description: VIP_DESCRIPTION,
        pricePerHour: 7,
        pcCount: 4,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 4070 Super",
          ram: "32 GB",
          monitor: "ZOWIE XL2586X",
          refreshRate: 240,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
    ],
  },
  {
    id: "club-metro",
    slug: "metro",
    name: "Pixel Metro",
    address: METRO_ADDRESS,
    phone: "+375 29 319 30 15",
    hours: "Круглосуточно",
    status: "open",
    features: ["PS5", "Wi-Fi", "Снек-бар", "Парковка", "Кондиционер"],
    mapUrl: `https://yandex.ru/maps/?text=${encodeURIComponent(`${METRO_ADDRESS}, Могилев`)}`,
    images: { club: "/club-metro.jpg", hall: "/hall-metro.jpg" },
    zones: [
      {
        id: "metro-mid",
        name: "MID",
        description: STANDARD_DESCRIPTION,
        pricePerHour: 5,
        pcCount: 15,
        specs: {
          cpu: "Intel i5-10400F",
          gpu: "GeForce 4060",
          ram: "16 GB",
          monitor: '27" 165Hz',
          refreshRate: 165,
          chair: "Brave Pro X",
          mouse: "Logitech G Pro X Superlight 2",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        id: "metro-space",
        name: "SPACE",
        description: STANDARD_PLUS_DESCRIPTION,
        pricePerHour: 6,
        pcCount: 12,
        specs: {
          cpu: "Intel i5-12400F",
          gpu: "GeForce RTX 4060",
          ram: "16 GB",
          monitor: '27" 240Hz',
          refreshRate: 240,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        id: "metro-duo",
        name: "DUO",
        description: DUO_DESCRIPTION,
        pricePerHour: 8,
        pcCount: 5,
        specs: {
          cpu: "AMD Ryzen 5 7500F",
          gpu: "GeForce RTX 5070 12GB",
          ram: "32 GB DDR5",
          monitor: '24,5" 320Hz',
          refreshRate: 320,
          chair: "Lorgar Ranger 743",
          mouse: "Logitech G Pro X Superlight 2",
          keyboard: "Wooting 60HE",
        },
      },
      {
        id: "metro-trio",
        name: "TRIO",
        description: VIP_DESCRIPTION,
        pricePerHour: 7,
        pcCount: 4,
        specs: {
          cpu: "AMD Ryzen 5 7500F",
          gpu: "GeForce RTX 5060",
          ram: "16 GB DDR5",
          monitor: '24,5" 320Hz',
          refreshRate: 320,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        id: "metro-vip",
        name: "VIP",
        description: VIP_DESCRIPTION,
        pricePerHour: 7,
        pcCount: 3,
        specs: {
          cpu: "AMD Ryzen 5 7500F",
          gpu: "GeForce RTX 5060",
          ram: "16 GB DDR5",
          monitor: '24,5" 320Hz',
          refreshRate: 320,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
    ],
  },
];

export const PRICING_ROWS: PricingRow[] = [
  { label: "1 час", prices: { PS5: 10 } },
  {
    label: "3 часа",
    prices: { STANDART: 13, "STANDART+": 15, "VIP/TRIO": 18, DUO: 25, PS5: 25 },
    dayPrices: { STANDART: 10, "STANDART+": 13, "VIP/TRIO": 15, DUO: 20 },
  },
  {
    label: "5 часов",
    note: "не сгорает 7 дней",
    prices: { STANDART: 18, "STANDART+": 25, "VIP/TRIO": 30, DUO: 35, PS5: 35 },
    dayPrices: { STANDART: 15, "STANDART+": 20, "VIP/TRIO": 25, DUO: 30 },
  },
  {
    label: "10 часов",
    note: "не сгорает 14 дней",
    prices: { STANDART: 30, "STANDART+": 35, "VIP/TRIO": 40, DUO: 45 },
  },
  { label: "Утречко", note: "6:00-10:00", prices: { STANDART: 10, "STANDART+": 15, "VIP/TRIO": 20, DUO: 25 } },
  {
    label: "День / Ночь",
    note: "10:00–21:00 / 23:00–8:00",
    prices: { STANDART: 17, "STANDART+": 25, "VIP/TRIO": 30, DUO: 45 },
  },
  { label: "Ночь+", note: "20:00–8:00", prices: { STANDART: 20, "STANDART+": 30, "VIP/TRIO": 35, DUO: 50 } },
];

export const SITE_STATS = {
  cashbackLegend: "25%",
  networkHours: "24/7",
} as const;

const HOURLY_TARIFF_ZONES: Record<Exclude<PricingTariff, "PS5">, string[]> = {
  STANDART: ["STANDART", "MID"],
  "STANDART+": ["STANDART+", "SPACE"],
  "VIP/TRIO": ["VIP[1]", "VIP[2]", "VIP", "TRIO"],
  DUO: ["DUO"],
};

export function getHourlyPricing(): Partial<Record<PricingTariff, number>> {
  const prices: Partial<Record<PricingTariff, number>> = {};

  for (const [tariff, zoneNames] of Object.entries(HOURLY_TARIFF_ZONES) as [
    Exclude<PricingTariff, "PS5">,
    string[],
  ][]) {
    const zone = CLUBS.flatMap((club) => club.zones).find((candidate) =>
      zoneNames.includes(candidate.name),
    );
    if (zone) prices[tariff] = zone.pricePerHour;
  }

  return prices;
}

export function totalPcCount(club: Club): number {
  return club.zones.reduce((sum, zone) => sum + zone.pcCount, 0);
}

export function totalNetworkPcCount(clubs: Club[] = CLUBS): number {
  return clubs.reduce((sum, club) => sum + totalPcCount(club), 0);
}

export function getClubById(id: string): Club | undefined {
  return CLUBS.find((club) => club.id === id);
}

export function getClubBySlug(slug: string): Club | undefined {
  return CLUBS.find((club) => club.slug === slug);
}

export function getLowestClubPrice(club: Club): number {
  return Math.min(...club.zones.map((zone) => zone.pricePerHour));
}

export function getMaxRefreshRate(clubs: Club[] = CLUBS): number {
  return Math.max(...clubs.flatMap((club) => club.zones.map((zone) => zone.specs.refreshRate)));
}

export function clubStatusLabel(status: ClubStatus): string {
  if (status === "open") return "Открыто";
  if (status === "temporarily_closed") return "Временно закрыто";
  return "Закрыто";
}