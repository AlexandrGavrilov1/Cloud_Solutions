import { Helmet } from 'react-helmet-async';
import { PROVIDERS_LABEL } from '@/utils/providersCount';

interface OpenGraphProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  siteName?: string;
  locale?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export const OpenGraph = ({
  title = `Рейтинг VPS хостинга ${new Date().getFullYear()} — Сравнение ${PROVIDERS_LABEL} провайдеров`,
  description = 'Независимый рейтинг VPS провайдеров. Актуальные цены, реальные отзывы, калькулятор стоимости, uptime статистика.',
  url = 'https://top-vds.com',
  image = 'https://cdn.poehali.dev/files/8f328ff2-4310-4457-a129-5e42f69ef566.png',
  type = 'website',
  siteName = 'top-vds',
  locale = 'ru_RU',
  article
}: OpenGraphProps) => {
  return (
    <Helmet>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />

      {type === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map((tag, idx) => (
            <meta key={idx} property="article:tag" content={tag} />
          ))}
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@top_vds" />

      <meta property="vk:image" content={image} />
      
      <meta name="telegram:channel" content="@top_vds_com" />

      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="ru" href={url} />
    </Helmet>
  );
};