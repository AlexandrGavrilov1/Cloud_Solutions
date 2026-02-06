import { Provider } from "./types";
import Icon from "@/components/ui/icon";
import { MonthlyUptimeGraph } from "./MonthlyUptimeGraph";
import { useState } from "react";

interface UptimeProviderCardProps {
  provider: Provider;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onProviderClick: () => void;
  getDowntimeMinutes: (uptime: number) => string;
  isTopThree: boolean;
  place?: number;
}

// Данные за 2025 год
const get2025Data = (providerId: number) => {
  if (providerId === 1) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 3 },
      { month: "Февраль", uptime: 99.98, downtime: 9 },
      { month: "Март", uptime: 100, downtime: 0 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 99.99, downtime: 3 },
      { month: "Июнь", uptime: 99.98, downtime: 9 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 99.99, downtime: 3 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6 },
      { month: "Октябрь", uptime: 99.98, downtime: 6 },
      { month: "Ноябрь", uptime: 99.99, downtime: 6 },
      { month: "Декабрь", uptime: 99.99, downtime: 3 },
    ];
  } else if (providerId === 2) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 100, downtime: 0 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 100, downtime: 0 },
      { month: "Июль", uptime: 99.98, downtime: 9 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 100, downtime: 0 },
      { month: "Октябрь", uptime: 99.99, downtime: 3 },
      { month: "Ноябрь", uptime: 100, downtime: 0 },
      { month: "Декабрь", uptime: 99.99, downtime: 6 },
    ];
  } else if (providerId === 3) {
    return [
      { month: "Январь", uptime: 99.81, downtime: 84 },
      { month: "Февраль", uptime: 99.93, downtime: 30 },
      { month: "Март", uptime: 99.89, downtime: 48 },
      { month: "Апрель", uptime: 99.9, downtime: 45 },
      { month: "Май", uptime: 99.78, downtime: 93 },
      { month: "Июнь", uptime: 100, downtime: 0 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 99.99, downtime: 3 },
      { month: "Октябрь", uptime: 99.99, downtime: 3 },
      { month: "Ноябрь", uptime: 99.99, downtime: 6 },
      { month: "Декабрь", uptime: 99.99, downtime: 6 },
    ];
  } else if (providerId === 5) {
    return [
      { month: "Январь", uptime: 99.7, downtime: 135 },
      { month: "Февраль", uptime: 99.51, downtime: 195 },
      { month: "Март", uptime: 99.84, downtime: 69 },
      { month: "Апрель", uptime: 99.9, downtime: 45 },
      { month: "Май", uptime: 99.8, downtime: 90 },
      { month: "Июнь", uptime: 99.84, downtime: 69 },
      { month: "Июль", uptime: 99.78, downtime: 96 },
      { month: "Август", uptime: 99.91, downtime: 39 },
      { month: "Сентябрь", uptime: 99.95, downtime: 21 },
      { month: "Октябрь", uptime: 99.81, downtime: 84 },
      { month: "Ноябрь", uptime: 99.92, downtime: 33 },
      { month: "Декабрь", uptime: 99.95, downtime: 21 },
    ];
  } else if (providerId === 6) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 99.97, downtime: 12 },
      { month: "Март", uptime: 99.97, downtime: 12 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 99.97, downtime: 15 },
      { month: "Июнь", uptime: 99.98, downtime: 9 },
      { month: "Июль", uptime: 99.99, downtime: 6 },
      { month: "Август", uptime: 99.97, downtime: 15 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12 },
      { month: "Октябрь", uptime: 100, downtime: 0 },
      { month: "Ноябрь", uptime: 100, downtime: 0 },
      { month: "Декабрь", uptime: 99.97, downtime: 12 },
    ];
  } else if (providerId === 7) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 99.98, downtime: 9 },
      { month: "Март", uptime: 99.97, downtime: 15 },
      { month: "Апрель", uptime: 99.86, downtime: 60 },
      { month: "Май", uptime: 97.9, downtime: 930 },
      { month: "Июнь", uptime: 99.9, downtime: 45 },
      { month: "Июль", uptime: 99.98, downtime: 9 },
      { month: "Август", uptime: 99.97, downtime: 12 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12 },
      { month: "Октябрь", uptime: 99.96, downtime: 18 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9 },
      { month: "Декабрь", uptime: 99.99, downtime: 3 },
    ];
  } else if (providerId === 9) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.99, downtime: 3 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 99.98, downtime: 9 },
      { month: "Июнь", uptime: 99.98, downtime: 9 },
      { month: "Июль", uptime: 99.9, downtime: 45 },
      { month: "Август", uptime: 99.99, downtime: 3 },
      { month: "Сентябрь", uptime: 99.99, downtime: 3 },
      { month: "Октябрь", uptime: 99.99, downtime: 6 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9 },
      { month: "Декабрь", uptime: 99.99, downtime: 3 },
    ];
  } else if (providerId === 10) {
    return [
      { month: "Январь", uptime: 99.98, downtime: 9 },
      { month: "Февраль", uptime: 99.99, downtime: 6 },
      { month: "Март", uptime: 99.97, downtime: 15 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 99.99, downtime: 3 },
      { month: "Июль", uptime: 99.97, downtime: 12 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12 },
      { month: "Октябрь", uptime: 99.97, downtime: 12 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9 },
      { month: "Декабрь", uptime: 99.9, downtime: 45 },
    ];
  } else if (providerId === 11) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 3 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.99, downtime: 3 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 100, downtime: 0 },
      { month: "Июль", uptime: 99.99, downtime: 3 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 99.98, downtime: 9 },
      { month: "Октябрь", uptime: 100, downtime: 0 },
      { month: "Ноябрь", uptime: 99.99, downtime: 3 },
      { month: "Декабрь", uptime: 100, downtime: 0 },
    ];
  } else if (providerId === 12) {
    return [
      { month: "Январь", uptime: 99.97, downtime: 15 },
      { month: "Февраль", uptime: 99.98, downtime: 9 },
      { month: "Март", uptime: 99.98, downtime: 9 },
      { month: "Апрель", uptime: 99.98, downtime: 9 },
      { month: "Май", uptime: 99.97, downtime: 15 },
      { month: "Июнь", uptime: 99.96, downtime: 18 },
      { month: "Июль", uptime: 99.99, downtime: 3 },
      { month: "Август", uptime: 99.99, downtime: 3 },
      { month: "Сентябрь", uptime: 99.97, downtime: 15 },
      { month: "Октябрь", uptime: 99.97, downtime: 15 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9 },
      { month: "Декабрь", uptime: 99.99, downtime: 6 },
    ];
  } else if (providerId === 13) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 99.97, downtime: 12 },
      { month: "Март", uptime: 99.99, downtime: 3 },
      { month: "Апрель", uptime: 99.97, downtime: 15 },
      { month: "Май", uptime: 99.98, downtime: 9 },
      { month: "Июнь", uptime: 99.97, downtime: 15 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6 },
      { month: "Октябрь", uptime: 99.98, downtime: 9 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9 },
      { month: "Декабрь", uptime: 100, downtime: 0 },
    ];
  } else if (providerId === 14) {
    return [
      { month: "Январь", uptime: 99.97, downtime: 15 },
      { month: "Февраль", uptime: 99.93, downtime: 27 },
      { month: "Март", uptime: 99.94, downtime: 27 },
      { month: "Апрель", uptime: 99.96, downtime: 18 },
      { month: "Май", uptime: 99.93, downtime: 33 },
      { month: "Июнь", uptime: 99.43, downtime: 246 },
      { month: "Июль", uptime: 99.97, downtime: 12 },
      { month: "Август", uptime: 99.93, downtime: 30 },
      { month: "Сентябрь", uptime: 99.8, downtime: 87 },
      { month: "Октябрь", uptime: 99.93, downtime: 33 },
      { month: "Ноябрь", uptime: 99.94, downtime: 24 },
      { month: "Декабрь", uptime: 99.85, downtime: 66 },
    ];
  } else if (providerId === 15) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 99.99, downtime: 6 },
      { month: "Март", uptime: 99.87, downtime: 57 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 99.98, downtime: 9 },
      { month: "Июнь", uptime: 99.68, downtime: 136 },
      { month: "Июль", uptime: 99.97, downtime: 12 },
      { month: "Август", uptime: 97.96, downtime: 903 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12 },
      { month: "Октябрь", uptime: 99.95, downtime: 21 },
      { month: "Ноябрь", uptime: 99.42, downtime: 249 },
      { month: "Декабрь", uptime: 99.99, downtime: 3 },
    ];
  } else if (providerId === 18) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.98, downtime: 9 },
      { month: "Апрель", uptime: 99.98, downtime: 9 },
      { month: "Май", uptime: 99.99, downtime: 3 },
      { month: "Июнь", uptime: 99.99, downtime: 6 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 99.99, downtime: 6 },
      { month: "Сентябрь", uptime: 99.98, downtime: 9 },
      { month: "Октябрь", uptime: 99.97, downtime: 15 },
      { month: "Ноябрь", uptime: 100, downtime: 0 },
      { month: "Декабрь", uptime: 100, downtime: 0 },
    ];
  } else if (providerId === 19) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 99.98, downtime: 9 },
      { month: "Март", uptime: 100, downtime: 0 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 99.96, downtime: 18 },
      { month: "Июнь", uptime: 99.94, downtime: 27 },
      { month: "Июль", uptime: 99.95, downtime: 21 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6 },
      { month: "Октябрь", uptime: 99.99, downtime: 6 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9 },
      { month: "Декабрь", uptime: 99.99, downtime: 3 },
    ];
  } else if (providerId === 20) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.98, downtime: 9 },
      { month: "Апрель", uptime: 99.98, downtime: 9 },
      { month: "Май", uptime: 99.99, downtime: 3 },
      { month: "Июнь", uptime: 99.78, downtime: 93 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 99.84, downtime: 72 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6 },
      { month: "Октябрь", uptime: 99.99, downtime: 9 },
      { month: "Ноябрь", uptime: 99.97, downtime: 12 },
      { month: "Декабрь", uptime: 100, downtime: 0 },
    ];
  } else if (providerId === 21) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.99, downtime: 3 },
      { month: "Апрель", uptime: 99.98, downtime: 9 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 100, downtime: 0 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 100, downtime: 0 },
      { month: "Октябрь", uptime: 100, downtime: 0 },
      { month: "Ноябрь", uptime: 99.99, downtime: 6 },
      { month: "Декабрь", uptime: 100, downtime: 0 },
    ];
  } else if (providerId === 22) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 99.99, downtime: 6 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 99.99, downtime: 3 },
      { month: "Июнь", uptime: 99.94, downtime: 27 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 100, downtime: 0 },
      { month: "Сентябрь", uptime: 100, downtime: 0 },
      { month: "Октябрь", uptime: 99.89, downtime: 48 },
      { month: "Ноябрь", uptime: 100, downtime: 0 },
      { month: "Декабрь", uptime: 99.99, downtime: 3 },
    ];
  } else if (providerId === 23) {
    return [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 99.99, downtime: 3 },
      { month: "Март", uptime: 99.84, downtime: 72 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 99.99, downtime: 3 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 99.99, downtime: 3 },
      { month: "Сентябрь", uptime: 100, downtime: 0 },
      { month: "Октябрь", uptime: 100, downtime: 0 },
      { month: "Ноябрь", uptime: 100, downtime: 0 },
      { month: "Декабрь", uptime: 99.99, downtime: 3 },
    ];
  } else if (providerId === 32) {
    return [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 100, downtime: 0 },
      { month: "Апрель", uptime: 100, downtime: 0 },
      { month: "Май", uptime: 99.98, downtime: 9 },
      { month: "Июнь", uptime: 99.99, downtime: 3 },
      { month: "Июль", uptime: 99.99, downtime: 3 },
      { month: "Август", uptime: 99.98, downtime: 9 },
      { month: "Сентябрь", uptime: 100, downtime: 0 },
      { month: "Октябрь", uptime: 100, downtime: 0 },
      { month: "Ноябрь", uptime: 99.99, downtime: 3 },
      { month: "Декабрь", uptime: 100, downtime: 0 },
    ];
  } else if (providerId === 49) {
    return [
      { month: "Январь", uptime: 99.77, downtime: 102 },
      { month: "Февраль", uptime: 100, downtime: 0 },
      { month: "Март", uptime: 100, downtime: 0 },
      { month: "Апрель", uptime: 99.99, downtime: 3 },
      { month: "Май", uptime: 100, downtime: 0 },
      { month: "Июнь", uptime: 99.98, downtime: 9 },
      { month: "Июль", uptime: 100, downtime: 0 },
      { month: "Август", uptime: 99.95, downtime: 24 },
      { month: "Сентябрь", uptime: 99.95, downtime: 21 },
      { month: "Октябрь", uptime: 94.85, downtime: 2280 },
      { month: "Ноябрь", uptime: 100, downtime: 0 },
      { month: "Декабрь", uptime: 100, downtime: 6 },
    ];
  }
  return [];
};

// Данные за 2026 год (такая же структура как для 2025)
const get2026Data = (providerId: number) => {
  const monthlyData: {
    [key: number]: Array<{ month: string; uptime: number; downtime: number }>;
  } = {
    1: [
      { month: "Январь", uptime: 99.99, downtime: 3 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    2: [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    3: [
      { month: "Январь", uptime: 99.93, downtime: 30 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    5: [
      { month: "Январь", uptime: 99.95, downtime: 21 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    6: [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    7: [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    9: [
      { month: "Январь", uptime: 0, downtime: 0 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    10: [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    11: [
      { month: "Январь", uptime: 99.99, downtime: 3 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    12: [
      { month: "Январь", uptime: 99.97, downtime: 15 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    13: [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    14: [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    15: [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    18: [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    19: [
      { month: "Январь", uptime: 99.98, downtime: 9 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    20: [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    21: [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    22: [
      { month: "Январь", uptime: 99.96, downtime: 18 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    23: [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    32: [
      { month: "Январь", uptime: 99.99, downtime: 6 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
    49: [
      { month: "Январь", uptime: 100, downtime: 0 },
      { month: "Февраль", uptime: 0, downtime: 0 },
      { month: "Март", uptime: 0, downtime: 0 },
      { month: "Апрель", uptime: 0, downtime: 0 },
      { month: "Май", uptime: 0, downtime: 0 },
      { month: "Июнь", uptime: 0, downtime: 0 },
      { month: "Июль", uptime: 0, downtime: 0 },
      { month: "Август", uptime: 0, downtime: 0 },
      { month: "Сентябрь", uptime: 0, downtime: 0 },
      { month: "Октябрь", uptime: 0, downtime: 0 },
      { month: "Ноябрь", uptime: 0, downtime: 0 },
      { month: "Декабрь", uptime: 0, downtime: 0 },
    ],
  };

  return monthlyData[providerId] || [];
};

export const getMonthlyData = (providerId: number, year: number = 2025) => {
  if (year === 2025) {
    return get2025Data(providerId);
  } else if (year === 2026) {
    return get2026Data(providerId);
  }
  return [];
};

export const calculateTotalDowntime = (
  providerId: number,
  year: number = 2025,
): number => {
  const monthlyData = getMonthlyData(providerId, year);
  if (!monthlyData || !Array.isArray(monthlyData) || monthlyData.length === 0)
    return 0;
  return monthlyData.reduce((sum, month) => sum + month.downtime, 0);
};

export const UptimeProviderCard: React.FC<UptimeProviderCardProps> = ({
  provider,
  index,
  isExpanded,
  onToggleExpand,
  onProviderClick,
  getDowntimeMinutes,
  isTopThree,
  place,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const getUptimeColorClass = (uptime: number) => {
    if (uptime >= 99.99) return "text-green-400";
    if (uptime >= 99.9) return "text-green-300";
    if (uptime >= 99.5) return "text-yellow-400";
    if (uptime >= 99) return "text-orange-400";
    return "text-red-400";
  };

  const getUptimeBarColorClass = (uptime: number) => {
    if (uptime >= 99.99) return "bg-green-500";
    if (uptime >= 99.9) return "bg-green-400";
    if (uptime >= 99.5) return "bg-yellow-400";
    if (uptime >= 99) return "bg-orange-400";
    return "bg-red-500";
  };

  const monthlyData = getMonthlyData(provider.id, selectedYear);
  const uptime = provider.uptime30days ?? 0;
  const totalDowntime = calculateTotalDowntime(provider.id, selectedYear);

  const shouldShowGraph =
    provider.id === 1 ||
    provider.id === 2 ||
    provider.id === 3 ||
    provider.id === 5 ||
    provider.id === 6 ||
    provider.id === 7 ||
    provider.id === 9 ||
    provider.id === 10 ||
    provider.id === 11 ||
    provider.id === 12 ||
    provider.id === 13 ||
    provider.id === 14 ||
    provider.id === 15 ||
    provider.id === 18 ||
    provider.id === 19 ||
    provider.id === 20 ||
    provider.id === 21 ||
    provider.id === 22 ||
    provider.id === 23 ||
    provider.id === 32 ||
    provider.id === 49;

  // Получаем цвет для текста uptime
  const getUptimeTextColor = (uptimeValue: number) => {
    if (uptimeValue >= 99.95) return "text-green-500";
    if (uptimeValue >= 99.5) return "text-orange-500";
    return "text-red-500";
  };

  const uptimeTextColor = getUptimeTextColor(uptime);

  return (
    <div
      key={provider.id}
      className={`group bg-background border border-border rounded-lg md:rounded-xl p-3 md:p-4 hover:border-primary/50 transition-all relative ${
        isExpanded ? "md:col-span-2" : ""
      }`}
    >
      {isTopThree && place && (
        <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg">
          <div className="relative flex items-center justify-center">
            <Icon
              name="Cloud"
              size={32}
              className={
                place === 1
                  ? "text-yellow-500 md:w-[37px] md:h-[37px]"
                  : place === 2
                    ? "text-gray-400 md:w-[37px] md:h-[37px]"
                    : "text-amber-700 md:w-[37px] md:h-[37px]"
              }
              style={{
                filter:
                  place === 1
                    ? "drop-shadow(0 0 10px rgba(234, 179, 8, 0.7))"
                    : place === 2
                      ? "drop-shadow(0 0 10px rgba(156, 163, 175, 0.7))"
                      : "drop-shadow(0 0 10px rgba(180, 83, 9, 0.7))",
              }}
            />
            <span
              className={`absolute text-[10px] md:text-xs font-bold ${
                place === 1
                  ? "text-yellow-600"
                  : place === 2
                    ? "text-gray-500"
                    : "text-amber-800"
              }`}
              style={{ marginTop: "2px", marginLeft: "-10%" }}
            >
              {place}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 md:gap-3 flex-1 min-w-0"
          style={{ marginLeft: isTopThree ? "28px" : "0" }}
        >
          <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden bg-white border border-primary/10 flex items-center justify-center">
            <img
              src={provider.logo}
              alt={provider.name}
              className="w-6 h-6 md:w-8 md:h-8 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <button
              onClick={onProviderClick}
              className="text-sm md:text-base font-bold text-foreground truncate hover:text-primary transition-colors flex items-center gap-1 group/name"
            >
              {provider.name}
              <Icon
                name="ExternalLink"
                size={12}
                className="opacity-0 group-hover/name:opacity-100 transition-opacity md:w-[14px] md:h-[14px]"
              />
            </button>
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
              <span>SLA: {provider.serviceGuarantees.uptimeSLA}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className={`text-base md:text-xl font-black ${uptimeTextColor}`}>
            {uptime.toFixed(2)}%
          </div>
          <button
            onClick={onToggleExpand}
            className="p-1 md:p-1.5 hover:bg-accent rounded-lg transition-colors"
          >
            <Icon
              name={isExpanded ? "ChevronUp" : "ChevronDown"}
              size={16}
              className="text-muted-foreground md:w-[18px] md:h-[18px]"
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border space-y-3 md:space-y-4">
          <div className="text-[11px] md:text-xs text-muted-foreground">
            <div className="flex justify-between py-1">
              <span>SLA гарантия:</span>
              <span className="font-semibold text-foreground">
                {provider.serviceGuarantees.uptimeSLA}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Время ответа поддержки:</span>
              <span className="font-semibold text-foreground">
                {provider.serviceGuarantees.supportResponseTime}
              </span>
            </div>
            {totalDowntime > 0 && (
              <div className="flex justify-between py-1">
                <span>Суммарное время простоя за {selectedYear}:</span>
                <span className="font-semibold text-foreground">
                  {totalDowntime} мин
                </span>
              </div>
            )}
          </div>

          {/* Селектор года */}
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">
              Выберите год:
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedYear(2025)}
                className={`px-3 py-1 text-xs md:text-sm font-medium rounded-lg transition-colors ${
                  selectedYear === 2025
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                2025
              </button>
              <button
                onClick={() => setSelectedYear(2026)}
                className={`px-3 py-1 text-xs md:text-sm font-medium rounded-lg transition-colors ${
                  selectedYear === 2026
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                2026
              </button>
            </div>
          </div>

          {shouldShowGraph && isExpanded && monthlyData.length > 0 && (
            <MonthlyUptimeGraph
              data={monthlyData}
              providerId={provider.id}
              year={selectedYear}
            />
          )}

          {shouldShowGraph && monthlyData.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Данные за {selectedYear} год пока недоступны
            </div>
          )}
        </div>
      )}
    </div>
  );
};
