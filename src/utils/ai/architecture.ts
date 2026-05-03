import { Intent } from "./aiParser";

export interface ArchComponent {
  name: string;
  role: string;
  cpu: number;
  ram: number;
  storage: number;
  icon: string;
  gpu?: boolean;
}

export function buildArchitecture(intent: Intent): ArchComponent[] {
  const scale = Math.max(1, Math.log10(intent.users) - 2);

  const base: ArchComponent[] = [];

  if (intent.type === "saas") {
    base.push({
      name: "App Server",
      role: "Backend / API",
      cpu: Math.ceil(2 * scale),
      ram: Math.ceil(4 * scale),
      storage: 40,
      icon: "Server",
    });
    base.push({
      name: "PostgreSQL",
      role: "База данных",
      cpu: 2,
      ram: Math.ceil(4 * scale),
      storage: 100,
      icon: "Database",
    });
    base.push({
      name: "Redis",
      role: "Кэш / сессии",
      cpu: 1,
      ram: 2,
      storage: 10,
      icon: "Zap",
    });
  } else if (intent.type === "ai") {
    base.push({
      name: "GPU Worker",
      role: "Inference / Training",
      cpu: 8,
      ram: 32,
      storage: 200,
      icon: "Cpu",
      gpu: true,
    });
    base.push({
      name: "API Gateway",
      role: "REST / WebSocket",
      cpu: 2,
      ram: 4,
      storage: 20,
      icon: "Network",
    });
    base.push({
      name: "Vector DB",
      role: "Эмбеддинги",
      cpu: 2,
      ram: 8,
      storage: 100,
      icon: "Database",
    });
  } else if (intent.type === "bot") {
    base.push({
      name: "Bot Worker",
      role: "Telegram/Discord",
      cpu: 1,
      ram: 2,
      storage: 20,
      icon: "Bot",
    });
    base.push({
      name: "Queue (Redis)",
      role: "Очередь задач",
      cpu: 1,
      ram: 1,
      storage: 10,
      icon: "ListOrdered",
    });
  } else if (intent.type === "ecommerce") {
    base.push({
      name: "Web Server",
      role: "Nginx + App",
      cpu: Math.ceil(2 * scale),
      ram: Math.ceil(4 * scale),
      storage: 60,
      icon: "Globe",
    });
    base.push({
      name: "MySQL",
      role: "Каталог + заказы",
      cpu: 2,
      ram: Math.ceil(4 * scale),
      storage: 150,
      icon: "Database",
    });
    base.push({
      name: "CDN / Static",
      role: "Картинки",
      cpu: 1,
      ram: 2,
      storage: 50,
      icon: "Image",
    });
  } else if (intent.type === "gaming") {
    base.push({
      name: "Game Server",
      role: "Реалтайм игра",
      cpu: 4,
      ram: 8,
      storage: 50,
      icon: "Gamepad2",
    });
    base.push({
      name: "Match Backend",
      role: "Матчмейкинг",
      cpu: 2,
      ram: 4,
      storage: 20,
      icon: "Users",
    });
  } else if (intent.type === "highload") {
    base.push({
      name: "Load Balancer",
      role: "HAProxy/Nginx",
      cpu: 2,
      ram: 4,
      storage: 20,
      icon: "Network",
    });
    base.push({
      name: "App Cluster x3",
      role: "Stateless API",
      cpu: 4 * 3,
      ram: 8 * 3,
      storage: 40 * 3,
      icon: "Layers",
    });
    base.push({
      name: "DB Master+Replica",
      role: "Postgres / репликация",
      cpu: 8,
      ram: 32,
      storage: 500,
      icon: "Database",
    });
    base.push({
      name: "Redis Cluster",
      role: "Распределённый кэш",
      cpu: 2,
      ram: 8,
      storage: 20,
      icon: "Zap",
    });
  } else if (intent.type === "static") {
    base.push({
      name: "Web Server",
      role: "Static hosting",
      cpu: 1,
      ram: 1,
      storage: 20,
      icon: "Globe",
    });
  } else {
    base.push({
      name: "App Server",
      role: "Универсальный сервер",
      cpu: 2,
      ram: 4,
      storage: 40,
      icon: "Server",
    });
  }

  if (intent.realtime && intent.type !== "gaming" && intent.type !== "bot") {
    base.push({
      name: "WebSocket Hub",
      role: "Realtime соединения",
      cpu: 2,
      ram: 4,
      storage: 20,
      icon: "Radio",
    });
  }

  return base;
}

export function totalResources(arch: ArchComponent[]) {
  return arch.reduce(
    (acc, c) => ({
      cpu: acc.cpu + c.cpu,
      ram: acc.ram + c.ram,
      storage: acc.storage + c.storage,
      gpu: acc.gpu || !!c.gpu,
    }),
    { cpu: 0, ram: 0, storage: 0, gpu: false },
  );
}
