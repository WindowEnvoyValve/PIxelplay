// ============================================================
// Статические данные публичного сайта PIXELPLAY.
// Содержит только контент: клубы, зоны, характеристики ПК, цены.
// ============================================================

export interface PcSpecs {
  cpu: string;
  gpu: string;
  monitor: string;
  refresh: number;
  chair: string;
  mouse: string;
  keyboard: string;
}

export interface ClubZone {
  name: string;
  pricePerHour: number;
  pcCount: number;
  specs: PcSpecs;
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  features: string[];
  yandexMapsUrl: string;
  zones: ClubZone[];
}

export const CLUBS: Club[] = [
  {
    id: "club-play",
    slug: "play",
    name: "Pixel Play",
    address: "ул. Мовчанского, 53Б",
    phone: "+375 29 319 30 15",
    hours: "Круглосуточно",
    features: ["PS5", "Wi-Fi", "Снек-бар", "Парковка", "Кондиционер"],
    yandexMapsUrl: "https://yandex.ru/maps/?text=ул.+Мовчанского,+53Б,+Могилев",
    zones: [
      {
        name: "STANDART",
        pricePerHour: 5,
        pcCount: 15,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 4070 Super",
          monitor: "ZOWIE XL2586X",
          refresh: 360,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        name: "STANDART+",
        pricePerHour: 6,
        pcCount: 10,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 4070 Super",
          monitor: "ZOWIE XL2586X",
          refresh: 360,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        name: "VIP[1]",
        pricePerHour: 7,
        pcCount: 8,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 5080 16GB",
          monitor: "ZOWIE XL2586X",
          refresh: 360,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        name: "VIP[2]",
        pricePerHour: 7,
        pcCount: 4,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 5080 16GB",
          monitor: "ZOWIE XL2586X",
          refresh: 360,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        name: "DUO",
        pricePerHour: 8,
        pcCount: 2,
        specs: {
          cpu: "AMD Ryzen 7 7800X3D",
          gpu: "RTX 5070 Ti",
          monitor: "ZOWIE XL2586X",
          refresh: 360,
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
    features: ["PS5", "Wi-Fi", "Снек-бар", "Парковка", "Кондиционер"],
    yandexMapsUrl: "https://yandex.ru/maps/?text=ул.+Космонавтов,+2,+Могилев",
    zones: [
      {
        name: "STANDART",
        pricePerHour: 5,
        pcCount: 12,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 4070 Super",
          monitor: "ZOWIE XL2586X",
          refresh: 240,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        name: "STANDART+",
        pricePerHour: 6,
        pcCount: 10,
        specs: {
          cpu: "Intel i5-14400F",
          gpu: "RTX 4070 Super",
          monitor: "ZOWIE XL2586X",
          refresh: 240,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        name: "VIP[1]",
        pricePerHour: 7,
        pcCount: 7,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 4070 Super",
          monitor: "ZOWIE XL2586X",
          refresh: 240,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        name: "VIP[2]",
        pricePerHour: 7,
        pcCount: 4,
        specs: {
          cpu: "Intel i7-14700K",
          gpu: "RTX 4070 Super",
          monitor: "ZOWIE XL2586X",
          refresh: 240,
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
    address: "ул. Мигая 13",
    phone: "+375 29 319 30 15",
    hours: "Круглосуточно",
    features: ["PS5", "Wi-Fi", "Снек-бар", "Парковка", "Кондиционер"],
    yandexMapsUrl: "https://yandex.ru/maps/?text=пер.+Мигая,+13,+Могилев",
    zones: [
      {
        name: "MID",
        pricePerHour: 5,
        pcCount: 15,
        specs: {
          cpu: "Intel i5-10400F",
          gpu: "GeForce 4060",
          monitor: '27" 165Hz',
          refresh: 165,
          chair: "Brave Pro X",
          mouse: "Logitech G Pro X Superlight 2",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        name: "SPACE",
        pricePerHour: 6,
        pcCount: 12,
        specs: {
          cpu: "Intel i5-12400F",
          gpu: "GeForce RTX 4060",
          monitor: '27" 240Hz',
          refresh: 240,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        name: "DUO",
        pricePerHour: 8,
        pcCount: 5,
        specs: {
          cpu: "AMD Ryzen 5 7500F",
          gpu: "GeForce RTX 5070 12GB",
          monitor: '24,5" 320Hz',
          refresh: 320,
          chair: "Lorgar Ranger 743",
          mouse: "Logitech G Pro X Superlight 2",
          keyboard: "Wooting 60HE",
        },
      },
      {
        name: "TRIO",
        pricePerHour: 7,
        pcCount: 4,
        specs: {
          cpu: "AMD Ryzen 5 7500F",
          gpu: "GeForce RTX 5060",
          monitor: '24,5" 320Hz',
          refresh: 320,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
      {
        name: "VIP",
        pricePerHour: 7,
        pcCount: 3,
        specs: {
          cpu: "AMD Ryzen 5 7500F",
          gpu: "GeForce RTX 5060",
          monitor: '24,5" 320Hz',
          refresh: 320,
          chair: "Brave Pro X",
          mouse: "Razer Viper V3 Pro",
          keyboard: "Logitech G Pro X TKL",
        },
      },
    ],
  },
];

export function totalPcCount(club: Club): number {
  return club.zones.reduce((sum, zone) => sum + zone.pcCount, 0);
}