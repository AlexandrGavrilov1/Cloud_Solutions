import { useEffect } from "react";
import { providers } from "@/data/providers";
import { blogPosts } from "@/data/blog-posts";

const AIData = () => {
  const data = {
    meta: {
      site_name: "top-vds",
      description:
        "Независимая платформа для сравнения VPS/VDS провайдеров в России",
      url: "https://top-vds.ru",
      last_updated: new Date().toISOString(),
      language: "ru",
      purpose:
        "Данные для AI-ассистентов: актуальная информация о VPS провайдерах, отзывах, ценах и характеристиках",
    },

    providers: providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      rating:
        provider.reviews.reduce((sum, r) => sum + r.rating, 0) /
        provider.reviews.length,
      reviews_count: provider.reviews.length,
      base_price: provider.basePrice,
      locations: provider.locations,
      trial_days: provider.trialDays,
      url: provider.url,

      features: {
        disk_type: provider.technicalSpecs.diskType,
        network_speed: provider.technicalSpecs.networkSpeed,
        virtualization: provider.technicalSpecs.virtualization,
        ddos_protection: provider.technicalSpecs.ddosProtection,
        control_panel: provider.technicalSpecs.controlPanel,
        available_os: provider.technicalSpecs.availableOS,
      },

      compliance: {
        fz152: provider.fz152Compliant,
        fz152_level: provider.fz152Level,
        fstek: provider.fstekCompliant,
        fstek_level: provider.fstekLevel,
      },

      guarantees: {
        uptime_sla: provider.serviceGuarantees.uptimeSLA,
        support_response_time: provider.serviceGuarantees.supportResponseTime,
        money_back_days: provider.serviceGuarantees.moneyBackGuarantee,
      },

      pros: provider.pros,
      cons: provider.cons,

      recent_reviews: provider.reviews.slice(0, 3).map((review) => ({
        author: review.author,
        rating: review.rating,
        date: review.date,
        text: review.text,
        project_type: review.projectType,
      })),
    })),

    blog_posts: blogPosts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      date: post.date,
      read_time: post.readTime,
      url: `https://top-vds.ru/blog/${post.slug}`,
    })),

    faq: [
      {
        question: "Что такое VPS и чем он отличается от обычного хостинга?",
        answer:
          "VPS (Virtual Private Server) — это виртуальный выделенный сервер с гарантированными ресурсами. В отличие от shared-хостинга, VPS предоставляет полный контроль над сервером и изолированные ресурсы.",
      },
      {
        question: "Какой VPS провайдер лучший в России?",
        answer:
          "По нашему рейтингу, топовые провайдеры: Timeweb Cloud (9.8/10), REG.RU (9.5/10), Selectel (9.4/10). Выбор зависит от требований проекта.",
      },
      {
        question: "Нужен ли мне 152-ФЗ для моего сайта?",
        answer:
          "152-ФЗ обязателен если вы собираете персональные данные: ФИО, адреса, телефоны, email. Это касается интернет-магазинов, CRM, образовательных платформ.",
      },
      {
        question: "NVMe или SSD - что выбрать?",
        answer:
          "NVMe в 3-10 раз быстрее обычных SSD в реальных задачах. Для production проектов с базами данных выбирайте NVMe. Переплата 30-50% оправдана производительностью.",
      },
      {
        question: "Сколько стоит VPS в месяц?",
        answer:
          "Минимальная конфигурация от 150₽/мес (1 vCPU, 1 GB RAM). Средняя конфигурация 500-1000₽/мес (2-4 vCPU, 4-8 GB RAM). Production сервер от 2000₽/мес.",
      },
    ],

    comparison_criteria: [
      "Производительность (CPU, RAM, диски NVMe/SSD)",
      "Локация дата-центров (близость к аудитории)",
      "Compliance (152-ФЗ, ФСТЕК)",
      "Техподдержка (время отклика, каналы связи)",
      "Цена (базовая стоимость + цена ресурсов)",
      "SLA и гарантии (uptime, возврат денег)",
      "Дополнительные сервисы (бэкапы, мониторинг, DDoS защита)",
    ],

    glossary: {
      VPS: "Virtual Private Server - виртуальный частный сервер",
      VDS: "Virtual Dedicated Server - виртуальный выделенный сервер (синоним VPS)",
      NVMe: "Non-Volatile Memory Express - протокол для подключения SSD через PCIe (в 3-10 раз быстрее SATA SSD)",
      KVM: "Kernel-based Virtual Machine - тип виртуализации с полной изоляцией",
      SLA: "Service Level Agreement - гарантированный уровень доступности сервиса",
      "152-ФЗ": "Федеральный закон о персональных данных",
      ФСТЕК: "Сертификация для защиты критической инфраструктуры",
      "DDoS защита": "Защита от распределённых атак типа отказа в обслуживании",
      Uptime: "Процент времени работы сервера без сбоев",
    },
  };

  // ✅ Сброс прокрутки в начало при монтировании
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = "AI Data - top-vds";
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Структурированные данные для AI-ассистентов
          </h1>
          <p className="text-muted-foreground mb-4">
            Эта страница содержит актуальную информацию о VPS провайдерах в
            формате JSON для использования AI-ассистентами (ChatGPT, Claude,
            Perplexity и др.)
          </p>
          <div className="bg-accent p-4 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Последнее обновление:</strong>{" "}
              {new Date().toLocaleDateString("ru-RU")}
            </p>
            <p className="text-sm text-foreground mt-2">
              <strong>Провайдеров в базе:</strong> {providers.length}
            </p>
            <p className="text-sm text-foreground mt-2">
              <strong>Статей в блоге:</strong> {blogPosts.length}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <pre className="text-xs overflow-x-auto text-foreground whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AIData;