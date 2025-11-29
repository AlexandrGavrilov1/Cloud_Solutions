import { GamingProvider } from "@/components/gaming/types";

export const gamingProviders: GamingProvider[] = [
  {
    id: 1,
    name: "IMBA Host",
    logo: "https://cdn.poehali.dev/files/imba-host-logo.png",
    rating: 9.8,
    basePrice: 199,
    pricePerSlot: 8,
    features: ["DDoS защита до 1 Тбит/с", "NVMe диски", "Панель управления Pterodactyl", "Автоматическая установка модов"],
    locations: ["Москва", "Санкт-Петербург", "Казань"],
    trialDays: 3,
    url: "https://imba.host/",
    pros: [
      "Лучшая цена за слот на рынке",
      "Мощнейшая DDoS защита до 1 Тбит/с",
      "Современная панель Pterodactyl",
      "Бесплатный тестовый период 3 дня"
    ],
    cons: [
      "Только российские локации",
      "Молодая компания на рынке"
    ],
    supportedGames: [
      { game: "Minecraft", icon: "🎮", minPlayers: 10, maxPlayers: 500 },
      { game: "CS:GO", icon: "🔫", minPlayers: 10, maxPlayers: 64 },
      { game: "Rust", icon: "⚔️", minPlayers: 50, maxPlayers: 300 },
      { game: "ARK", icon: "🦖", minPlayers: 20, maxPlayers: 150 },
      { game: "Valheim", icon: "⚡", minPlayers: 2, maxPlayers: 10 },
      { game: "Terraria", icon: "🌍", minPlayers: 2, maxPlayers: 8 }
    ],
    ddosProtection: "До 1 Тбит/с",
    uptime: 99.98,
    supportResponseTime: "< 5 мин",
    paymentMethods: ["Карта", "ЮMoney", "Qiwi", "Криптовалюта"],
    promoText: "Промокод IMBA20 - скидка 20% на первый месяц"
  }
];