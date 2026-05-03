import { useEffect } from "react";
import Layout from "@/components/tool/Layout";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const FACTORS = [
  {
    id: "price",
    label: "Price",
    weight: "20%",
    formula: "1 / log₂(2 + price/median)",
    why: "Люди воспринимают цену нелинейно. Разница 5→10₽ ощущается сильнее, чем 100→105₽. Логарифм — стандартная модель психологии цен (Weber-Fechner law).",
    icon: "Wallet",
  },
  {
    id: "performance",
    label: "Performance",
    weight: "20%",
    formula: "sigmoid(perf/price - 1)",
    why: "Считаем performance per ruble: cpu × 0.6 + ram × 0.4, делим на нормализованную цену. Sigmoid даёт diminishing returns — сверх-мощный сервер за бешеные деньги не лучше адекватного.",
    icon: "Zap",
  },
  {
    id: "latency",
    label: "Latency",
    weight: "15%",
    formula: "exp(-latency_ms / 100)",
    why: "Экспоненциальный штраф после ~100ms. До 50ms — практически идеал, после 200ms приложение ощущается медленным. Критично для real-time, бесполезно для batch.",
    icon: "Gauge",
  },
  {
    id: "simplicity",
    label: "Simplicity",
    weight: "15%",
    formula: "0.5·UX + 0.3·setup + 0.2·docs",
    why: "Time-to-deploy — главный скрытый фактор. 70% MVP проектов умирают не от плохой инфры, а от того что разработчик потерял неделю на конфиг. Учитываем API, Docker, marketplace.",
    icon: "Sparkles",
  },
  {
    id: "reliability",
    label: "Reliability",
    weight: "20%",
    formula: "0.6·SLA + 0.4·rating",
    why: "SLA на бумаге ≠ реальный uptime. Комбинируем заявленный uptime30days с реальным rating пользователей. При rating < 3.5 применяется штраф 0.7 — реальные инциденты весомее обещаний.",
    icon: "Shield",
  },
  {
    id: "ecosystem",
    label: "Ecosystem",
    weight: "10%",
    formula: "Σ feature_weight",
    why: "K8s (0.25), Docker (0.15), API (0.15), AI (0.15), backups (0.1), DDoS (0.1), IPv6 (0.05), 152-ФЗ (0.05). Чем больше готовых интеграций — тем меньше боли в проде.",
    icon: "Boxes",
  },
];

const RISKS = [
  {
    type: "billing",
    label: "Billing risk",
    trigger: "rating < 4 + reviews < 50",
    penalty: "до −15%",
    why: "Низкий рейтинг при малом количестве отзывов часто означает скрытые комиссии за egress, network, snapshots.",
  },
  {
    type: "downtime",
    label: "Downtime risk",
    trigger: "uptime < 99.9%",
    penalty: "до −20%",
    why: "Каждые 0.1% ниже SLA — это часы даунтайма в год. Для production это деньги.",
  },
  {
    type: "support",
    label: "Support risk",
    trigger: "rating < 4.2",
    penalty: "до −10%",
    why: "Качество поддержки видно только когда упало в 3 ночи. Низкий rating — сигнал.",
  },
  {
    type: "lock-in",
    label: "Vendor lock-in",
    trigger: "нет k8s/docker",
    penalty: "−3%",
    why: "Без контейнеризации миграция = переписывание. Скрытая стоимость на годы вперёд.",
  },
  {
    type: "complexity",
    label: "Region complexity",
    trigger: "регион не в RU/EU/US",
    penalty: "−5%",
    why: "Экзотические регионы = высокий latency + сложности с биллингом и compliance.",
  },
];

const PRESETS = [
  {
    id: "mvp",
    label: "MVP",
    weights: { price: 30, simplicity: 30, latency: 20, reliability: 5 },
    why: "Быстро запустить и проверить идею. Цена и time-to-deploy решают всё.",
  },
  {
    id: "saas",
    label: "SaaS",
    weights: { performance: 20, latency: 20, reliability: 20, price: 15 },
    why: "Сбалансированный профиль для растущего продукта.",
  },
  {
    id: "highload",
    label: "Highload",
    weights: { performance: 30, latency: 25, reliability: 20, ecosystem: 10 },
    why: "Производительность и низкий latency приоритетнее цены.",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    weights: { reliability: 35, ecosystem: 25, performance: 15, support: 10 },
    why: "Стабильность, поддержка, compliance. Цена — последний фактор.",
  },
  {
    id: "pet",
    label: "Pet project",
    weights: { price: 45, simplicity: 25, ecosystem: 10 },
    why: "Минимальный бюджет, простота, забить и забыть.",
  },
];

const Methodology = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Методология скоринга | cloudpicker";
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="mb-16 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <Icon name="ArrowLeft" size={14} />
          Назад к подбору
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 text-xs text-muted-foreground mb-6">
          <Icon name="FlaskConical" size={12} />
          <span>Открытая методология · v2.0</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-4">
          <span className="block text-foreground">Как мы считаем</span>
          <span className="block gradient-text">скоринг провайдеров.</span>
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed">
          Решения о выборе облака принимаются не рационально, а через
          компромиссы. Поэтому мы не используем простую сумму баллов —
          а вероятностную модель, которая учитывает уверенность в данных
          и скрытые риски.
        </p>
      </section>

      {/* Final formula */}
      <section className="mb-16">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">
            <Icon name="Sigma" size={12} />
            Итоговая формула
          </div>
          <div className="font-mono text-lg md:text-2xl text-foreground mb-6 leading-relaxed">
            <span className="text-muted-foreground">score</span> ={" "}
            <span className="text-blue-500">utility</span>
            <span className="text-muted-foreground"> × </span>
            <span className="text-purple-500">confidence</span>
            <span className="text-muted-foreground"> × </span>
            <span className="text-pink-500">risk</span>
            <span className="text-muted-foreground"> + </span>
            <span className="text-amber-500">brand_bias</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-blue-500 font-medium mb-1">Utility</div>
              <div className="text-muted-foreground text-xs">
                Насколько подходит — sigmoid от взвешенной суммы 6 факторов
              </div>
            </div>
            <div>
              <div className="text-purple-500 font-medium mb-1">Confidence</div>
              <div className="text-muted-foreground text-xs">
                Насколько мы уверены — log от количества отзывов + полнота данных
              </div>
            </div>
            <div>
              <div className="text-pink-500 font-medium mb-1">Risk</div>
              <div className="text-muted-foreground text-xs">
                Штраф за скрытые проблемы из отзывов и метрик
              </div>
            </div>
            <div>
              <div className="text-amber-500 font-medium mb-1">Brand bias</div>
              <div className="text-muted-foreground text-xs">
                ±0.05 — реальное поведение людей при выборе облака
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Factors */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-1">
              6 факторов utility
            </h2>
            <p className="text-sm text-muted-foreground">
              Каждый фактор нормализован в [0..1] и нелинейный
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FACTORS.map((f) => (
            <div
              key={f.id}
              className="rounded-xl border border-border bg-card p-5 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon
                      name={f.icon}
                      size={14}
                      className="text-foreground"
                    />
                  </div>
                  <div>
                    <div className="font-semibold tracking-tight">
                      {f.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Базовый вес {f.weight}
                    </div>
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs text-foreground/80 bg-secondary/50 rounded-md px-3 py-2 mb-3 border border-border">
                {f.formula}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.why}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Confidence */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">
          Confidence Score
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Если у нас мало данных — мы не уверены, и понижаем итоговый балл
        </p>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="font-mono text-sm text-foreground/80 bg-secondary/50 rounded-md px-4 py-3 mb-5 border border-border">
            confidence = 0.6 × log₁₀(1 + reviews) / 3 + 0.4 × completeness
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-md border border-border p-3">
              <div className="text-xs text-muted-foreground mb-1">
                10 отзывов
              </div>
              <div className="text-2xl font-semibold tabular-nums">~35%</div>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="text-xs text-muted-foreground mb-1">
                100 отзывов
              </div>
              <div className="text-2xl font-semibold tabular-nums">~67%</div>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="text-xs text-muted-foreground mb-1">
                1000+ отзывов
              </div>
              <div className="text-2xl font-semibold tabular-nums">~100%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Adjustment */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">
          Risk Adjustment
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Скрытые проблемы, о которых не пишут на лендингах провайдеров
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-secondary/30">
            <div className="col-span-3">Тип риска</div>
            <div className="col-span-4">Триггер</div>
            <div className="col-span-2">Штраф</div>
            <div className="col-span-3">Объяснение</div>
          </div>
          {RISKS.map((r, i) => (
            <div
              key={r.type}
              className={`grid grid-cols-12 gap-3 px-5 py-4 text-sm ${
                i < RISKS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="col-span-3 font-medium text-foreground">
                {r.label}
              </div>
              <div className="col-span-4 font-mono text-xs text-muted-foreground">
                {r.trigger}
              </div>
              <div className="col-span-2 tabular-nums text-pink-500">
                {r.penalty}
              </div>
              <div className="col-span-3 text-xs text-muted-foreground">
                {r.why}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Presets */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">
          Персонализация: пресеты весов
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Веса факторов меняются в зависимости от типа проекта — потому что MVP
          и Enterprise выбирают облако по разным критериям
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESETS.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold tracking-tight text-base">
                  {p.label}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  preset
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                {Object.entries(p.weights).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground w-24 capitalize">
                      {k}
                    </span>
                    <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-foreground/70"
                        style={{ width: `${v * 2}%` }}
                      />
                    </div>
                    <span className="text-[11px] tabular-nums text-foreground w-10 text-right">
                      {v}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {p.why}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Bias */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">
          Honest disclosure: brand bias
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Мы не притворяемся, что люди выбирают чисто рационально. Известные
          бренды получают небольшую надбавку — это реальность поведения
        </p>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              { name: "AWS / GCP / Azure", bias: "+5%" },
              { name: "Yandex Cloud", bias: "+4%" },
              { name: "Selectel / VK", bias: "+3%" },
              { name: "Hetzner", bias: "−2%" },
            ].map((b) => (
              <div
                key={b.name}
                className="rounded-md border border-border p-3"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {b.name}
                </div>
                <div className="text-lg font-semibold tabular-nums">
                  {b.bias}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Это компенсация за реальный фактор — экосистему, найм специалистов,
            доверие команды. Влияние ограничено ±5%, не перевешивает другие
            факторы.
          </p>
        </div>
      </section>

      {/* Pipeline */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">
          Полный pipeline
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Как считается финальный score для одного провайдера
        </p>
        <div className="space-y-3">
          {[
            {
              step: "1",
              label: "Маппинг",
              desc: "Извлекаем регион, latency, features из сырых данных провайдера",
            },
            {
              step: "2",
              label: "Component scores",
              desc: "Считаем 6 факторов utility (price, perf, latency, simplicity, reliability, ecosystem)",
            },
            {
              step: "3",
              label: "Weighted sum",
              desc: "Применяем веса из выбранного use-case пресета",
            },
            {
              step: "4",
              label: "Sigmoid",
              desc: "Нелинейная агрегация → utility ∈ [0..1]. Так моделируем компромиссы",
            },
            {
              step: "5",
              label: "Confidence",
              desc: "Умножаем на уверенность в данных (log от reviews + completeness)",
            },
            {
              step: "6",
              label: "Risk penalty",
              desc: "Сканируем риски, понижаем score (billing, downtime, support, lock-in)",
            },
            {
              step: "7",
              label: "Brand bias",
              desc: "Прибавляем ±5% за известность бренда — реальность поведения",
            },
            {
              step: "8",
              label: "Clamp & scale",
              desc: "Ограничиваем [0..1] и умножаем на 100 → итоговый score",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 font-mono text-sm font-medium">
                {s.step}
              </div>
              <div>
                <div className="font-semibold mb-0.5">{s.label}</div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mb-8">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h3 className="text-2xl font-semibold tracking-tight mb-2">
            Открытая модель · открытые веса
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Все формулы и веса лежат в публичном репозитории. Если ты считаешь
            что мы неправы — давай обсудим.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 transition-all"
            >
              Попробовать подбор
              <Icon name="ArrowRight" size={14} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md border border-border text-foreground hover:bg-secondary transition-all"
            >
              О проекте
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Methodology;
