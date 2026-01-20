// types.ts - полностью обновленный файл
export interface Review {
  author: string;
  text: string;
  rating: number;
  date: string;
  provider_id?: number;
  category?: "performance" | "support" | "price" | "general";
}

export interface TechnicalSpecs {
  diskType: "NVMe" | "SSD" | "HDD";
  networkSpeed: string;
  virtualization: ("KVM" | "OpenVZ" | "VMware" | "Hyper-V" | "LXC" | "Xen")[];
  guaranteedResources: boolean;
  ipv4: boolean;
  ipv6: boolean;
  availableOS: string[];
  controlPanel?: string;
  apiAccess: boolean;
  ddosProtection?: string;
  cpuModels?: string[];
  kubernetes?: {
    available: boolean;
    managed: boolean;
  };
}

export interface ServiceGuarantees {
  uptimeSLA: string;
  supportResponseTime?: string;
  moneyBackGuarantee?: number;
}

export interface AdditionalServices {
  autoBackups: boolean;
  backupPrice?: number;
  monitoring: boolean;
  snapshots: boolean;
  customOS: boolean;
}

export interface PricingDetails {
  discounts?: {
    months: number;
    percent: number;
  }[];
  paymentMethods: string[];
  minPrice: number;
}

export interface MonthlyUptime {
  month: string;
  uptime: number;
  downtime_minutes: number;
}

export interface Provider {
  id: number;
  name: string;
  logo: string;
  rating: number;
  basePrice: number;
  cpuPrice: number;
  ramPrice: number;
  storagePrice: number;
  features: string[];
  locations: string[];
  trialDays?: number;
  url?: string;
  pros: string[];
  cons: string[];
  reviews: Review[];
  fz152Compliant: boolean;
  fz152Level?: string;
  // Изменено: заменили fstekCompliant и fstekLevel на массив стандартов
  fstekStandards: string[]; // Массив стандартов ФСТЭК (например: ["ФСТЭК-17", "ФСТЭК-21", "ФСТЭК-239"])
  // Добавлены новые поля
  kiiPlacement: boolean; // Размещение объектов КИИ
  mobileApp: boolean; // Мобильное приложение
  technicalSpecs: TechnicalSpecs;
  serviceGuarantees: ServiceGuarantees;
  additionalServices: AdditionalServices;
  pricingDetails: PricingDetails;
  popularity?: number;
  promoText?: string;
  caseStudies?: string[];
  uptime30days?: number;
  monthlyUptimeData?: MonthlyUptime[];
}

export interface ResourceConfig {
  cpu: number;
  ram: number;
  storage: number;
}
