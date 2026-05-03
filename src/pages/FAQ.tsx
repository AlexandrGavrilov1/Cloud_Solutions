import { useEffect, useState } from "react";
import Layout from "@/components/tool/Layout";
import Icon from "@/components/ui/icon";

const faqItems = [
  {
    q: "Что такое VDS и чем отличается от хостинга?",
    a: "VDS — виртуальный выделенный сервер с гарантированными ресурсами. В отличие от обычного хостинга, ты получаешь root-доступ и изолированные CPU, RAM, диск.",
  },
  {
    q: "Какую конфигурацию выбрать?",
    a: "Маленькие сайты: 1-2 vCPU, 1-2 GB RAM. Магазины: 2-4 vCPU, 4-8 GB. Highload: 4+ vCPU, 8+ GB, NVMe.",
  },
  {
    q: "Что такое 152-ФЗ?",
    a: "Закон о персональных данных. Провайдеры с соответствием 152-ФЗ могут законно хранить данные граждан РФ.",
  },
  {
    q: "SSD vs NVMe — что выбрать?",
    a: "NVMe в 5-10 раз быстрее SSD. Для БД и highload — обязателен. Для блогов хватит SSD.",
  },
  {
    q: "Можно перенести сайт с другого хостинга?",
    a: "Да. Большинство провайдеров делают миграцию бесплатно. Занимает от пары часов до одного дня.",
  },
  {
    q: "KVM vs OpenVZ vs VMware?",
    a: "KVM — полная виртуализация, универсален. OpenVZ — дешевле, с ограничениями. VMware — для корпораций.",
  },
  {
    q: "Нужна ли DDoS защита?",
    a: "Для магазинов и популярных сайтов — обязательна. Многие провайдеры включают базовую в тариф.",
  },
  {
    q: "Как работают автобэкапы?",
    a: "Провайдер ежедневно копирует сервер и хранит несколько дней. Восстановление — пара минут через панель.",
  },
  {
    q: "Что такое тестовый период?",
    a: "Бесплатное время (3-30 дней) для теста сервера без оплаты. Нужна только регистрация.",
  },
  {
    q: "Можно увеличить ресурсы?",
    a: "Да, все провайдеры поддерживают вертикальное масштабирование. Занимает 5-10 минут с перезагрузкой.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <section className="mb-10 max-w-3xl">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
          <Icon name="HelpCircle" size={12} />
          <span>10 вопросов</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight mb-3">FAQ</h1>
        <p className="text-muted-foreground text-sm">
          Коротко о главном — без воды.
        </p>
      </section>

      <div className="max-w-3xl flex flex-col gap-2">
        {faqItems.map((item, i) => (
          <div
            key={i}
            className="border border-border rounded-lg bg-card overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-background transition-colors"
            >
              <span className="font-medium text-sm">{item.q}</span>
              <Icon
                name={open === i ? "Minus" : "Plus"}
                size={14}
                className="text-muted-foreground flex-shrink-0 ml-4"
              />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-muted-foreground">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default FAQ;
