export interface GamingServer {
  game: string;
  icon: string;
  minPlayers: number;
  maxPlayers: number;
}

export interface GamingProvider {
  id: number;
  name: string;
  logo: string;
  rating: number;
  basePrice: number;
  pricePerSlot: number;
  features: string[];
  locations: string[];
  trialDays?: number;
  url: string;
  pros: string[];
  cons: string[];
  supportedGames: GamingServer[];
  ddosProtection: string;
  uptime: number;
  supportResponseTime: string;
  paymentMethods: string[];
  promoText?: string;
}
