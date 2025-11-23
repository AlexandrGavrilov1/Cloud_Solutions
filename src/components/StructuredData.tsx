import { Helmet } from 'react-helmet-async';
import { providers } from '@/data/providers';
import { blogPosts } from '@/data/blog-posts';

interface StructuredDataProps {
  type?: 'website' | 'article' | 'product';
  data?: any;
}

export const StructuredData = ({ type = 'website', data }: StructuredDataProps) => {
  const getWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TopCloudHub",
    "alternateName": "VPS Rating",
    "url": "https://topcloudhub.ru",
    "description": "Независимый рейтинг VPS хостинга с актуальными ценами. Сравните 30+ провайдеров с реальными отзывами",
    "inLanguage": "ru",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://topcloudhub.ru/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  });

  const getOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TopCloudHub",
    "alternateName": "VPS Rating",
    "url": "https://topcloudhub.ru",
    "logo": {
      "@type": "ImageObject",
      "url": "https://cdn.poehali.dev/files/c1628b77-0a28-40ba-80b6-1ef1218418b6.png",
      "width": 512,
      "height": 512
    },
    "description": "Независимое сравнение VPS хостинг провайдеров с реальными отзывами и актуальными ценами",
    "sameAs": [
      "https://t.me/top_vds_com"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["Russian", "English"]
    }
  });

  const getItemListSchema = () => {
    const topProviders = providers.slice(0, 10);
    
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Рейтинг VPS провайдеров 2025",
      "description": "Топ-10 VPS хостинг провайдеров с реальными отзывами и актуальными ценами",
      "numberOfItems": topProviders.length,
      "itemListElement": topProviders.map((provider, index) => {
        const avgRating = provider.reviews.reduce((sum, r) => sum + r.rating, 0) / provider.reviews.length;
        
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": `${provider.name} VPS`,
            "description": provider.pros.join('. '),
            "brand": {
              "@type": "Brand",
              "name": provider.name
            },
            "image": provider.logo,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": avgRating.toFixed(1),
              "bestRating": "5",
              "worstRating": "1",
              "ratingCount": provider.reviews.length
            },
            "offers": {
              "@type": "Offer",
              "price": provider.basePrice,
              "priceCurrency": "RUB",
              "availability": "https://schema.org/InStock",
              "url": provider.url,
              "priceValidUntil": "2025-12-31"
            },
            "review": provider.reviews.slice(0, 3).map(review => ({
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": "5",
                "worstRating": "1"
              },
              "author": {
                "@type": "Person",
                "name": review.author
              },
              "datePublished": review.date,
              "reviewBody": review.text
            }))
          }
        };
      })
    };
  };

  const getFAQSchema = () => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Что такое VPS и чем он отличается от обычного хостинга?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "VPS (Virtual Private Server) — это виртуальный выделенный сервер с гарантированными ресурсами. В отличие от shared-хостинга, VPS предоставляет полный контроль над сервером, root-доступ и изолированные ресурсы CPU, RAM и диска."
        }
      },
      {
        "@type": "Question",
        "name": "Какой VPS провайдер лучший в России в 2025 году?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "По нашему независимому рейтингу, топ-3 провайдера: Timeweb Cloud (9.8/10) — лучшая поддержка и NVMe диски, REG.RU (9.5/10) — надёжность и compliance, Selectel (9.4/10) — для enterprise проектов. Выбор зависит от требований вашего проекта."
        }
      },
      {
        "@type": "Question",
        "name": "Нужен ли мне 152-ФЗ для моего сайта?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "152-ФЗ обязателен если вы собираете персональные данные граждан РФ: ФИО, адреса, телефоны, email, паспортные данные. Это касается интернет-магазинов, CRM-систем, образовательных платформ, медицинских сервисов и HR-платформ."
        }
      },
      {
        "@type": "Question",
        "name": "NVMe или SSD - что выбрать для VPS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NVMe в 3-10 раз быстрее обычных SSD в реальных задачах. Для production проектов с базами данных, e-commerce и SaaS обязательно выбирайте NVMe. Переплата 30-50% полностью оправдана увеличением производительности."
        }
      },
      {
        "@type": "Question",
        "name": "Сколько стоит VPS в месяц в 2025 году?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Минимальная конфигурация от 150₽/мес (1 vCPU, 1 GB RAM, 10 GB SSD). Средняя конфигурация 500-1000₽/мес (2-4 vCPU, 4-8 GB RAM, 40-80 GB NVMe). Production сервер от 2000₽/мес (4-8 vCPU, 8-16 GB RAM, 100+ GB NVMe)."
        }
      }
    ]
  });

  const getBlogPostingSchema = (post: typeof blogPosts[0]) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "datePublished": post.datePublished || post.date,
    "dateModified": post.dateModified || post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "TopCloudHub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cdn.poehali.dev/files/c1628b77-0a28-40ba-80b6-1ef1218418b6.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://topcloudhub.ru/blog/${post.slug}`
    },
    "keywords": post.tags.join(', '),
    "articleSection": post.category,
    "wordCount": post.content.split(' ').length,
    "timeRequired": post.readTime
  });

  const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  });

  const schemas = [];

  if (type === 'website') {
    schemas.push(
      getWebsiteSchema(),
      getOrganizationSchema(),
      getItemListSchema(),
      getFAQSchema()
    );
  }

  if (type === 'article' && data) {
    schemas.push(
      getOrganizationSchema(),
      getBlogPostingSchema(data),
      getBreadcrumbSchema([
        { name: 'Главная', url: 'https://topcloudhub.ru' },
        { name: 'Блог', url: 'https://topcloudhub.ru/blog' },
        { name: data.title, url: `https://topcloudhub.ru/blog/${data.slug}` }
      ])
    );
  }

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
