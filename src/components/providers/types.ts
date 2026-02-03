// types.ts
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
  // Добавляем поддержку GPU
  gpuModels?: string[];
  // Добавляем поддержку 1C
  supports1C?: boolean;
  // Добавляем поддержку AI
  supportsAI?: boolean;
  aiServices?: string[];
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
  minPrice?: number;
}

export interface MonthlyUptime {
  month: string;
  uptime: number;
  downtime_minutes: number;
}

export type RegistrationDataField =
  | "ФИО"
  | "Email"
  | "Телефон"
  | "Страна"
  | "По заявке через менеджера"
  | "ИНН"
  | "Корпоративный email"
  | "Наименование организации"
  | "Адрес организации"
  | "Паспортные данные"
  | "Реквизиты банка"
  | "Регистрация в сторонних сервисах"
  | "Скан удостоверения личности";

export type ClientType = "Физлицо" | "Юрлицо";

export type AdditionalServiceType =
  | "Аудит инфраструктуры"
  | "Проектирование инфраструктуры"
  | "Миграция в облако"
  | "Импортозамещение"
  | "Консультация по ИБ"
  | "Аттестация по ФСТЭК"
  | "Другие гос. лицензии";

// Добавляем интерфейсы для реферальной программы
export interface ReferralProgramItem {
  service: string;
  commission: string;
}

// Добавляем интерфейс для контактов
export interface ContactInfo {
  type: string;
  value: string;
  link?: string;
}

export interface Provider {
  id: number;
  name: string;
  logo: string;
  rating: number;
  basePrice: number; // Только число, 0 = "цена по запросу"
  features: string[];
  locations: string[];
  trialDays?: number;
  url?: string;
  pros: string[];
  cons: string[];
  reviews: Review[];
  fz152Compliant: boolean;
  fz152Level?: string;
  fstekCompliant: boolean;
  fstekCertifications: string[];
  fstekLevel?: string;
  kiiPlacement: boolean;
  mobileApp: boolean;
  orderBeforeRegistration: boolean;
  additionalServicesList: AdditionalServiceType[];
  registrationData: RegistrationDataField[];
  supportedClientTypes: ClientType[];
  technicalSpecs: TechnicalSpecs;
  serviceGuarantees: ServiceGuarantees;
  additionalServices: AdditionalServices;
  pricingDetails: PricingDetails;
  popularity?: number;
  promoText?: string;
  caseStudies?: string[];
  uptime30days?: number;
  monthlyUptimeData?: MonthlyUptime[];
  // Добавляем новые поля
  referralProgram?: ReferralProgramItem[];
  contacts?: ContactInfo[];
  companyDescription?: string;
  foundedYear?: number;
  employeesCount?: string;
  headquarters?: string;
}
