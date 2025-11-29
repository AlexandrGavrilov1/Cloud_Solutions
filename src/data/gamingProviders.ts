import { GamingProvider } from "@/components/gaming/types";

export const gamingProviders: GamingProvider[] = [
  {
    id: 1,
    name: "Timeweb Cloud Gaming",
    logo: "providers_logo/01_TimeWeb_Cloud.jpg",
    rating: 9.7,
    basePrice: 299,
    pricePerSlot: 15,
    features: ["DDoS защита до 500 Гбит/с", "NVMe диски", "Мгновенная установка", "Моды и плагины"],
    locations: ["Москва", "Санкт-Петербург", "Амстердам"],
    trialDays: 3,
    url: "https://timeweb.cloud/?i=123689",
    pros: [
      "Самая мощная DDoS защита",
      "NVMe диски для быстрой загрузки карт",
      "Поддержка модов и плагинов",
      "Бесплатный тестовый период 3 дня"
    ],
    cons: [
      "Цена выше среднего",
      "Панель управления сложная для новичков"
    ],
    supportedGames: [
      { game: "Minecraft", icon: "🎮", minPlayers: 10, maxPlayers: 500 },
      { game: "CS:GO", icon: "🔫", minPlayers: 10, maxPlayers: 64 },
      { game: "Rust", icon: "⚔️", minPlayers: 50, maxPlayers: 300 },
      { game: "ARK", icon: "🦖", minPlayers: 20, maxPlayers: 100 },
      { game: "Valheim", icon: "⚡", minPlayers: 2, maxPlayers: 10 },
      { game: "Terraria", icon: "🌍", minPlayers: 2, maxPlayers: 8 }
    ],
    ddosProtection: "До 500 Гбит/с",
    uptime: 99.98,
    supportResponseTime: "< 10 мин",
    paymentMethods: ["Карта", "ЮMoney", "Qiwi", "Webmoney"],
    promoText: "Промокод DOUBLE - удвоение первого платежа"
  },

  {
    id: 3,
    name: "Hosting-Ninja Gaming",
    logo: "providers_logo/04_Hosting-Ninja.jpg",
    rating: 9.3,
    basePrice: 199,
    pricePerSlot: 10,
    features: ["DDoS защита", "SSD накопители", "Панель управления", "Моды"],
    locations: ["Москва", "Варшава"],
    url: "https://hosting-ninja.ru/?utm_source=gdehosting",
    pros: [
      "Лучшие цены на рынке",
      "Удобная панель управления",
      "Хорошая поддержка",
      "Быстрое развертывание серверов"
    ],
    cons: [
      "Нет тестового периода",
      "Ограниченный выбор локаций"
    ],
    supportedGames: [
      { game: "Minecraft", icon: "🎮", minPlayers: 10, maxPlayers: 250 },
      { game: "CS:GO", icon: "🔫", minPlayers: 10, maxPlayers: 32 },
      { game: "GTA V", icon: "🚗", minPlayers: 32, maxPlayers: 128 },
      { game: "Rust", icon: "⚔️", minPlayers: 50, maxPlayers: 200 },
      { game: "ARK", icon: "🦖", minPlayers: 20, maxPlayers: 70 }
    ],
    ddosProtection: "До 200 Гбит/с",
    uptime: 99.9,
    supportResponseTime: "< 20 мин",
    paymentMethods: ["Карта", "ЮMoney", "Qiwi", "Криптовалюта"],
    promoText: "Первый месяц со скидкой 20%"
  },
  {
    id: 4,
    name: "Fornex Game Hosting",
    logo: "providers_logo/03_Fornex.jpg",
    rating: 9.4,
    basePrice: 270,
    pricePerSlot: 13,
    features: ["DDoS защита Corero", "NVMe диски", "Instant Setup", "MySQL базы"],
    locations: ["Москва", "Амстердам", "Нью-Йорк"],
    trialDays: 2,
    url: "https://fornex.com/ru/?ref=1007952",
    pros: [
      "Международные локации",
      "Мощная DDoS защита Corero",
      "NVMe диски",
      "Техподдержка 24/7"
    ],
    cons: [
      "Цена выше среднего",
      "Интерфейс на английском"
    ],
    supportedGames: [
      { game: "Minecraft", icon: "🎮", minPlayers: 10, maxPlayers: 400 },
      { game: "CS:GO", icon: "🔫", minPlayers: 10, maxPlayers: 64 },
      { game: "Team Fortress 2", icon: "🎯", minPlayers: 10, maxPlayers: 32 },
      { game: "Rust", icon: "⚔️", minPlayers: 50, maxPlayers: 250 },
      { game: "Garry's Mod", icon: "🔧", minPlayers: 10, maxPlayers: 128 }
    ],
    ddosProtection: "Corero до 600 Гбит/с",
    uptime: 99.97,
    supportResponseTime: "< 12 мин",
    paymentMethods: ["Карта", "PayPal", "Webmoney", "Криптовалюта"],
    promoText: "Пробный период 2 дня бесплатно"
  }
];