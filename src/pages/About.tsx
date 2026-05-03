import { useEffect } from "react";
import Layout from "@/components/tool/Layout";
import Icon from "@/components/ui/icon";

const features = [
  {
    icon: "Filter",
    title: "Фильтрация",
    text: "По цене, RAM, региону и фичам. Быстро и без лишних кликов.",
  },
  {
    icon: "Trophy",
    title: "Scoring",
    text: "Алгоритм ранжирует провайдеров под твой use-case: SaaS, pet, highload.",
  },
  {
    icon: "Calculator",
    title: "Калькулятор",
    text: "Считает стоимость по нагрузке и периоду. Топ-3 решения сразу видны.",
  },
  {
    icon: "Zap",
    title: "Latency",
    text: "Учитываем географию серверов в скоринге.",
  },
];

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <section className="mb-12 max-w-3xl">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Icon name="Info" size={12} />
          <span>о проекте</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight mb-4">
          cloudpicker — это <span className="text-primary">инструмент</span>, а не каталог
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Большинство сайтов о хостинге — статичные списки. Мы делаем по-другому:
          фильтры, scoring, калькулятор. Ты задаёшь параметры — получаешь топ.
          Никаких "топ-10 в 2025" с проплаченными местами.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-4xl">
        {features.map((f) => (
          <div
            key={f.title}
            className="p-5 rounded-lg border border-border bg-card hover:border-primary transition-colors"
          >
            <Icon name={f.icon} size={20} className="text-primary mb-3" />
            <h3 className="font-medium mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>

      <section className="max-w-3xl">
        <h2 className="text-2xl font-light mb-4">Что дальше</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <Icon name="Check" size={14} className="text-primary mt-0.5" />
            Real latency через edge-функции
          </li>
          <li className="flex gap-3">
            <Icon name="Check" size={14} className="text-primary mt-0.5" />
            ML-скоринг на реальных данных использования
          </li>
          <li className="flex gap-3">
            <Icon name="Check" size={14} className="text-primary mt-0.5" />
            A/B тесты разных весов в скоринге
          </li>
          <li className="flex gap-3">
            <Icon name="Check" size={14} className="text-primary mt-0.5" />
            API для встраивания в свои проекты
          </li>
        </ul>
      </section>
    </Layout>
  );
};

export default About;
