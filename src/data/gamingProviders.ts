import { GamingProvider } from "@/components/gaming/types";

export const gamingProviders: GamingProvider[] = [
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