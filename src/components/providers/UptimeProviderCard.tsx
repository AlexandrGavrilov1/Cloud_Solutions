import { Provider } from "./types";
import Icon from "@/components/ui/icon";
import { MonthlyUptimeGraph } from "./MonthlyUptimeGraph";

interface UptimeProviderCardProps {
  provider: Provider;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onProviderClick: () => void;
  getDowntimeMinutes: (uptime: number) => string;
  windowWidth: number;
  searchQuery: string;
}

export const getStaticMonthlyData = (providerId: number) => {
  // Данные за 2025 год
  const data2025 = [];
  // Данные за 2026 год
  const data2026 = [];

  // Данные за 2025 год
  if (providerId === 1) {
    data2025.push(
      { month: "Январь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Февраль", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Март", uptime: 100, downtime: 0, year: 2025 },
      { month: "Апрель", uptime: 100, downtime: 0, year: 2025 },
      { month: "Май", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Июнь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Октябрь", uptime: 99.98, downtime: 6, year: 2025 },
      { month: "Ноябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 3, year: 2025 },
    );
  } else if (providerId === 2) {
    data2025.push(
      { month: "Январь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Февраль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Март", uptime: 100, downtime: 0, year: 2025 },
      { month: "Апрель", uptime: 100, downtime: 0, year: 2025 },
      { month: "Май", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июнь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июль", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Август", uptime: 100, downtime: 0, year: 2025 },
      { month: "Сентябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Октябрь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Ноябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 6, year: 2025 },
    );
  } else if (providerId === 3) {
    data2025.push(
      { month: "Январь", uptime: 99.81, downtime: 84, year: 2025 },
      { month: "Февраль", uptime: 99.93, downtime: 30, year: 2025 },
      { month: "Март", uptime: 99.89, downtime: 48, year: 2025 },
      { month: "Апрель", uptime: 99.9, downtime: 45, year: 2025 },
      { month: "Май", uptime: 99.78, downtime: 93, year: 2025 },
      { month: "Июнь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 100, downtime: 0, year: 2025 },
      { month: "Сентябрь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Октябрь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Ноябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 6, year: 2025 },
    );
  } else if (providerId === 5) {
    data2025.push(
      { month: "Январь", uptime: 99.7, downtime: 135, year: 2025 },
      { month: "Февраль", uptime: 99.51, downtime: 195, year: 2025 },
      { month: "Март", uptime: 99.84, downtime: 69, year: 2025 },
      { month: "Апрель", uptime: 99.9, downtime: 45, year: 2025 },
      { month: "Май", uptime: 99.8, downtime: 90, year: 2025 },
      { month: "Июнь", uptime: 99.84, downtime: 69, year: 2025 },
      { month: "Июль", uptime: 99.78, downtime: 96, year: 2025 },
      { month: "Август", uptime: 99.91, downtime: 39, year: 2025 },
      { month: "Сентябрь", uptime: 99.95, downtime: 21, year: 2025 },
      { month: "Октябрь", uptime: 99.81, downtime: 84, year: 2025 },
      { month: "Ноябрь", uptime: 99.92, downtime: 33, year: 2025 },
      { month: "Декабрь", uptime: 99.95, downtime: 21, year: 2025 },
    );
  } else if (providerId === 6) {
    data2025.push(
      { month: "Январь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Февраль", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Март", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Апрель", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Май", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Июнь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Июль", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Август", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Октябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Ноябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Декабрь", uptime: 99.97, downtime: 12, year: 2025 },
    );
  } else if (providerId === 7) {
    data2025.push(
      { month: "Январь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Февраль", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Март", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Апрель", uptime: 99.86, downtime: 60, year: 2025 },
      { month: "Май", uptime: 97.9, downtime: 930, year: 2025 },
      { month: "Июнь", uptime: 99.9, downtime: 45, year: 2025 },
      { month: "Июль", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Август", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Октябрь", uptime: 99.96, downtime: 18, year: 2025 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 3, year: 2025 },
    );
  } else if (providerId === 9) {
    data2025.push(
      { month: "Январь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Февраль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Март", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Апрель", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Май", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Июнь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Июль", uptime: 99.9, downtime: 45, year: 2025 },
      { month: "Август", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Сентябрь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Октябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9, year: 2025 },
    );
  } else if (providerId === 10) {
    data2025.push(
      { month: "Январь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Февраль", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Март", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Апрель", uptime: 100, downtime: 0, year: 2025 },
      { month: "Май", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июнь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Июль", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Август", uptime: 100, downtime: 0, year: 2025 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Октябрь", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Декабрь", uptime: 99.9, downtime: 45, year: 2025 },
    );
  } else if (providerId === 11) {
    data2025.push(
      { month: "Январь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Февраль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Март", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Апрель", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Май", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июнь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июль", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Август", uptime: 100, downtime: 0, year: 2025 },
      { month: "Сентябрь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Октябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Ноябрь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Декабрь", uptime: 100, downtime: 0, year: 2025 },
    );
  } else if (providerId === 12) {
    data2025.push(
      { month: "Январь", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Февраль", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Март", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Апрель", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Май", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Июнь", uptime: 99.96, downtime: 18, year: 2025 },
      { month: "Июль", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Август", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Сентябрь", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Октябрь", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 6, year: 2025 },
    );
  } else if (providerId === 13) {
    data2025.push(
      { month: "Январь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Февраль", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Март", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Апрель", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Май", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Июнь", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 100, downtime: 0, year: 2025 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Октябрь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Декабрь", uptime: 100, downtime: 0, year: 2025 },
    );
  } else if (providerId === 14) {
    data2025.push(
      { month: "Январь", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Февраль", uptime: 99.93, downtime: 27, year: 2025 },
      { month: "Март", uptime: 99.94, downtime: 27, year: 2025 },
      { month: "Апрель", uptime: 99.96, downtime: 18, year: 2025 },
      { month: "Май", uptime: 99.93, downtime: 33, year: 2025 },
      { month: "Июнь", uptime: 99.43, downtime: 246, year: 2025 },
      { month: "Июль", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Август", uptime: 99.93, downtime: 30, year: 2025 },
      { month: "Сентябрь", uptime: 99.8, downtime: 87, year: 2025 },
      { month: "Октябрь", uptime: 99.93, downtime: 33, year: 2025 },
      { month: "Ноябрь", uptime: 99.94, downtime: 24, year: 2025 },
      { month: "Декабрь", uptime: 99.85, downtime: 66, year: 2025 },
    );
  } else if (providerId === 15) {
    data2025.push(
      { month: "Январь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Февраль", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Март", uptime: 99.87, downtime: 57, year: 2025 },
      { month: "Апрель", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Май", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Июнь", uptime: 99.68, downtime: 136, year: 2025 },
      { month: "Июль", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Август", uptime: 97.96, downtime: 903, year: 2025 },
      { month: "Сентябрь", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Октябрь", uptime: 99.95, downtime: 21, year: 2025 },
      { month: "Ноябрь", uptime: 99.42, downtime: 249, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 3, year: 2025 },
    );
  } else if (providerId === 18) {
    data2025.push(
      { month: "Январь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Февраль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Март", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Апрель", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Май", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Июнь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Сентябрь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Октябрь", uptime: 99.97, downtime: 15, year: 2025 },
      { month: "Ноябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Декабрь", uptime: 100, downtime: 0, year: 2025 },
    );
  } else if (providerId === 19) {
    data2025.push(
      { month: "Январь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Февраль", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Март", uptime: 100, downtime: 0, year: 2025 },
      { month: "Апрель", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Май", uptime: 99.96, downtime: 18, year: 2025 },
      { month: "Июнь", uptime: 99.94, downtime: 27, year: 2025 },
      { month: "Июль", uptime: 99.95, downtime: 21, year: 2025 },
      { month: "Август", uptime: 100, downtime: 0, year: 2025 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Октябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Ноябрь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 3, year: 2025 },
    );
  } else if (providerId === 20) {
    data2025.push(
      { month: "Январь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Февраль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Март", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Апрель", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Май", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Июнь", uptime: 99.78, downtime: 93, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 99.84, downtime: 72, year: 2025 },
      { month: "Сентябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Октябрь", uptime: 99.99, downtime: 9, year: 2025 },
      { month: "Ноябрь", uptime: 99.97, downtime: 12, year: 2025 },
      { month: "Декабрь", uptime: 100, downtime: 0, year: 2025 },
    );
  } else if (providerId === 21) {
    data2025.push(
      { month: "Январь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Февраль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Март", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Апрель", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Май", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июнь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 100, downtime: 0, year: 2025 },
      { month: "Сентябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Октябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Ноябрь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Декабрь", uptime: 100, downtime: 0, year: 2025 },
    );
  } else if (providerId === 22) {
    data2025.push(
      { month: "Январь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Февраль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Март", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Апрель", uptime: 100, downtime: 0, year: 2025 },
      { month: "Май", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Июнь", uptime: 99.94, downtime: 27, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 100, downtime: 0, year: 2025 },
      { month: "Сентябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Октябрь", uptime: 99.89, downtime: 48, year: 2025 },
      { month: "Ноябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 3, year: 2025 },
    );
  } else if (providerId === 23) {
    data2025.push(
      { month: "Январь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Февраль", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Март", uptime: 99.84, downtime: 72, year: 2025 },
      { month: "Апрель", uptime: 100, downtime: 0, year: 2025 },
      { month: "Май", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июнь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Сентябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Октябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Ноябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Декабрь", uptime: 99.99, downtime: 3, year: 2025 },
    );
  } else if (providerId === 32) {
    data2025.push(
      { month: "Январь", uptime: 99.99, downtime: 6, year: 2025 },
      { month: "Февраль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Март", uptime: 100, downtime: 0, year: 2025 },
      { month: "Апрель", uptime: 100, downtime: 0, year: 2025 },
      { month: "Май", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Июнь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Июль", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Август", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Сентябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Октябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Ноябрь", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Декабрь", uptime: 100, downtime: 0, year: 2025 },
    );
  } else if (providerId === 49) {
    data2025.push(
      { month: "Январь", uptime: 99.77, downtime: 102, year: 2025 },
      { month: "Февраль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Март", uptime: 100, downtime: 0, year: 2025 },
      { month: "Апрель", uptime: 99.99, downtime: 3, year: 2025 },
      { month: "Май", uptime: 100, downtime: 0, year: 2025 },
      { month: "Июнь", uptime: 99.98, downtime: 9, year: 2025 },
      { month: "Июль", uptime: 100, downtime: 0, year: 2025 },
      { month: "Август", uptime: 99.95, downtime: 24, year: 2025 },
      { month: "Сентябрь", uptime: 99.95, downtime: 21, year: 2025 },
      { month: "Октябрь", uptime: 94.85, downtime: 2280, year: 2025 },
      { month: "Ноябрь", uptime: 100, downtime: 0, year: 2025 },
      { month: "Декабрь", uptime: 100, downtime: 6, year: 2025 },
    );
  }

  // Данные за январь 2026 года
  if (providerId === 1) {
    data2026.push({ month: "Январь", uptime: 99.99, downtime: 3, year: 2026 });
  }
  if (providerId === 2) {
    data2026.push({ month: "Январь", uptime: 100, downtime: 0, year: 2026 });
  }
  if (providerId === 3) {
    data2026.push({ month: "Январь", uptime: 99.93, downtime: 30, year: 2026 });
  }
  if (providerId === 5) {
    data2026.push({ month: "Январь", uptime: 99.95, downtime: 21, year: 2026 });
  }
  if (providerId === 6) {
    data2026.push({ month: "Январь", uptime: 100, downtime: 0, year: 2026 });
  }
  if (providerId === 7) {
    data2026.push({ month: "Январь", uptime: 100, downtime: 0, year: 2026 });
  }
  if (providerId === 9) {
    data2026.push({ month: "Январь", uptime: 99.99, downtime: 3, year: 2026 });
  }
  if (providerId === 10) {
    data2026.push({ month: "Январь", uptime: 100, downtime: 0, year: 2026 });
  }
  if (providerId === 11) {
    data2026.push({ month: "Январь", uptime: 99.99, downtime: 3, year: 2026 });
  }
  if (providerId === 12) {
    data2026.push({ month: "Январь", uptime: 99.97, downtime: 15, year: 2026 });
  }
  if (providerId === 13) {
    data2026.push({ month: "Январь", uptime: 100, downtime: 0, year: 2026 });
  }
  if (providerId === 14) {
    data2026.push({ month: "Январь", uptime: 99.99, downtime: 6, year: 2026 });
  }
  if (providerId === 15) {
    data2026.push({ month: "Январь", uptime: 99.99, downtime: 6, year: 2026 });
  }
  if (providerId === 18) {
    data2026.push({ month: "Январь", uptime: 99.99, downtime: 6, year: 2026 });
  }
  if (providerId === 19) {
    data2026.push({ month: "Январь", uptime: 99.98, downtime: 9, year: 2026 });
  }
  if (providerId === 20) {
    data2026.push({ month: "Январь", uptime: 100, downtime: 0, year: 2026 });
  }
  if (providerId === 21) {
    data2026.push({ month: "Январь", uptime: 100, downtime: 0, year: 2026 });
  }
  if (providerId === 22) {
    data2026.push({ month: "Январь", uptime: 99.96, downtime: 18, year: 2026 });
  }
  if (providerId === 23) {
    data2026.push({ month: "Январь", uptime: 100, downtime: 0, year: 2026 });
  }
  if (providerId === 32) {
    data2026.push({ month: "Январь", uptime: 99.99, downtime: 6, year: 2026 });
  }
  if (providerId === 49) {
    data2026.push({ month: "Январь", uptime: 100, downtime: 0, year: 2026 });
  }

  // Собираем данные по годам
  const yearlyData = [];

  if (data2025.length > 0) {
    yearlyData.push({
      year: 2025,
      data: data2025,
    });
  }

  if (data2026.length > 0) {
    yearlyData.push({
      year: 2026,
      data: data2026,
    });
  }

  return yearlyData;
};

export const calculateTotalDowntime = (
  providerId: number,
  year?: number,
): number => {
  const yearlyData = getStaticMonthlyData(providerId);

  if (year) {
    const yearData = yearlyData.find((y) => y.year === year);
    if (
      !yearData ||
      !Array.isArray(yearData.data) ||
      yearData.data.length === 0
    )
      return 0;
    return yearData.data.reduce((sum, month) => sum + month.downtime, 0);
  }

  // Если год не указан, считаем за все годы
  return yearlyData.reduce((total, yearData) => {
    return (
      total + yearData.data.reduce((sum, month) => sum + month.downtime, 0)
    );
  }, 0);
};

export const calculateAverageUptime = (
  providerId: number,
  year?: number,
): number => {
  const yearlyData = getStaticMonthlyData(providerId);

  if (year) {
    const yearData = yearlyData.find((y) => y.year === year);
    if (
      !yearData ||
      !Array.isArray(yearData.data) ||
      yearData.data.length === 0
    )
      return 0;
    return (
      yearData.data.reduce((sum, month) => sum + month.uptime, 0) /
      yearData.data.length
    );
  }

  // Если год не указан, считаем среднее за все годы
  const allData = yearlyData.flatMap((y) => y.data);
  if (allData.length === 0) return 0;
  return allData.reduce((sum, month) => sum + month.uptime, 0) / allData.length;
};

export const UptimeProviderCard: React.FC<UptimeProviderCardProps> = ({
  provider,
  index,
  isExpanded,
  onToggleExpand,
  onProviderClick,
  getDowntimeMinutes,
  windowWidth,
  searchQuery,
}) => {
  const getUptimeColorClass = (uptime: number) => {
    if (uptime >= 99.95) return "text-green-400";
    if (uptime >= 99.9) return "text-green-300";
    if (uptime >= 99.5) return "text-yellow-400";
    if (uptime >= 99) return "text-orange-400";
    return "text-red-400";
  };

  const yearlyData = getStaticMonthlyData(provider.id);
  const uptime = provider.uptime30days ?? 0;
  const totalDowntime = calculateTotalDowntime(provider.id);
  const averageUptime = calculateAverageUptime(provider.id);

  // Проверяем, есть ли график для этого провайдера
  const shouldShowGraph =
    yearlyData.length > 0 && yearlyData.some((y) => y.data.length > 0);

  // Определяем размер экрана
  const getCardLayout = () => {
    if (windowWidth < 640) return "mobile";
    if (windowWidth < 1024) return "tablet";
    return "desktop";
  };

  const layout = getCardLayout();
  const isMobile = layout === "mobile";

  // Получаем список доступных лет
  const availableYears = yearlyData.map((y) => y.year);
  const hasMultipleYears = availableYears.length > 1;

  // Определяем, показывать ли значок с рейтингом
  const shouldShowRankingIcon = index < 3 && !searchQuery;

  return (
    <div
      key={provider.id}
      className={`group bg-background border border-border rounded-lg md:rounded-xl p-3 md:p-4 hover:border-primary/50 transition-all relative ${
        isExpanded && layout !== "mobile" ? "md:col-span-2" : ""
      } ${isExpanded ? "shadow-lg" : ""}`}
    >
      {shouldShowRankingIcon && (
        <div
          className={`absolute ${
            isMobile
              ? "-top-1 -left-1 w-6 h-6"
              : layout === "tablet"
                ? "-top-2 -left-2 w-8 h-8"
                : "-top-3 -left-3 w-12 h-12"
          } rounded-full flex items-center justify-center shadow-lg`}
        >
          <div className="relative flex items-center justify-center">
            <Icon
              name="Cloud"
              size={isMobile ? 24 : layout === "tablet" ? 28 : 32}
              className={
                index === 0
                  ? "text-yellow-500"
                  : index === 1
                    ? "text-gray-400"
                    : "text-amber-700"
              }
              style={{
                filter:
                  index === 0
                    ? "drop-shadow(0 0 8px rgba(234, 179, 8, 0.7))"
                    : index === 1
                      ? "drop-shadow(0 0 8px rgba(156, 163, 175, 0.7))"
                      : "drop-shadow(0 0 8px rgba(180, 83, 9, 0.7))",
              }}
            />
            <span
              className={`absolute ${
                isMobile
                  ? "text-[8px]"
                  : layout === "tablet"
                    ? "text-[10px]"
                    : "text-xs"
              } font-bold ${
                index === 0
                  ? "text-yellow-600"
                  : index === 1
                    ? "text-gray-500"
                    : "text-amber-800"
              }`}
              style={{
                marginTop: isMobile ? "1px" : "2px",
                marginLeft: isMobile ? "-5%" : "-10%",
              }}
            >
              {index + 1}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 md:gap-3 flex-1 min-w-0"
          style={{
            marginLeft: shouldShowRankingIcon
              ? isMobile
                ? "24px"
                : "32px"
              : "0",
          }}
        >
          <div
            className={`flex-shrink-0 ${
              isMobile
                ? "w-6 h-6"
                : layout === "tablet"
                  ? "w-8 h-8"
                  : "w-10 h-10"
            } rounded-lg overflow-hidden bg-white border border-primary/10 flex items-center justify-center`}
          >
            <img
              src={provider.logo}
              alt={provider.name}
              className={`${
                isMobile
                  ? "w-4 h-4"
                  : layout === "tablet"
                    ? "w-6 h-6"
                    : "w-8 h-8"
              } object-contain`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <button
              onClick={onProviderClick}
              className={`${
                isMobile ? "text-xs" : "text-sm md:text-base"
              } font-bold text-foreground truncate hover:text-primary transition-colors flex items-center gap-1 group/name`}
            >
              {provider.name}
              <Icon
                name="ExternalLink"
                size={isMobile ? 10 : 12}
                className="opacity-0 group-hover/name:opacity-100 transition-opacity"
              />
            </button>
            <div
              className={`flex items-center gap-2 ${
                isMobile ? "text-[9px]" : "text-[10px] md:text-xs"
              } text-muted-foreground`}
            >
              <span>SLA: {provider.serviceGuarantees.uptimeSLA}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">
                Простой: {getDowntimeMinutes(uptime)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div
            className={`${
              isMobile ? "text-sm" : "text-base md:text-xl"
            } font-black ${getUptimeColorClass(uptime)}`}
          >
            {uptime.toFixed(2)}%
          </div>
          <button
            onClick={onToggleExpand}
            className="p-1 md:p-1.5 hover:bg-accent rounded-lg transition-colors"
            aria-label={isExpanded ? "Свернуть детали" : "Развернуть детали"}
          >
            <Icon
              name={isExpanded ? "ChevronUp" : "ChevronDown"}
              size={isMobile ? 14 : 16}
              className="text-muted-foreground"
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          className={`mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border space-y-3 md:space-y-4`}
        >
          <div
            className={`${
              isMobile ? "text-[10px]" : "text-[11px] md:text-xs"
            } text-muted-foreground`}
          >
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
            <div className="flex justify-between py-1">
              <span>Текущий uptime (30 дней):</span>
              <span className="font-semibold text-foreground">
                {uptime.toFixed(2)}% ({getDowntimeMinutes(uptime)})
              </span>
            </div>
            {totalDowntime > 0 && (
              <div className="flex justify-between py-1">
                <span>Суммарный простой:</span>
                <span className="font-semibold text-foreground">
                  {totalDowntime} мин ({Math.round(totalDowntime / 60)} ч)
                </span>
              </div>
            )}
          </div>

          {/* График для всех провайдеров */}
          {shouldShowGraph ? (
            <div
              className={`${
                isMobile ? "pt-2" : "pt-4"
              } border-t border-border/50`}
            >
              <MonthlyUptimeGraph
                data={yearlyData}
                providerId={provider.id}
                isExpanded={isExpanded}
              />
            </div>
          ) : (
            <div className="bg-accent/30 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Статистика скоро появится для этого провайдера
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
