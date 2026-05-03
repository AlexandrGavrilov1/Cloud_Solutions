import { Helmet } from 'react-helmet';

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}

interface WebSiteData {
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'article' | 'breadcrumb' | 'faq';
  organization?: OrganizationData;
  website?: WebSiteData;
  article?: {
    headline: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified: string;
    image: string;
    url: string;
  };
  breadcrumbs?: BreadcrumbItem[];
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
}

export const StructuredData = ({ type = 'organization', organization, website, article, breadcrumbs, faqItems }: StructuredDataProps) => {
  const generateSchema = () => {
    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: organization?.name || 'top-vds',
          url: organization?.url || 'https://top-vds.ru',
          logo: organization?.logo || 'https://top-vds.ru/logo.png',
          description: organization?.description || 'Рейтинг лучших облачных VPS провайдеров России 2025',
          sameAs: organization?.sameAs || []
        };
      
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: website?.name || 'top-vds',
          url: website?.url || 'https://top-vds.ru',
          description: website?.description || 'Рейтинг облачных VPS провайдеров',
          potentialAction: website?.potentialAction || {
            '@type': 'SearchAction',
            target: 'https://top-vds.ru/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        };
      
      case 'article':
        if (!article) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.headline,
          description: article.description,
          author: {
            '@type': 'Person',
            name: article.author
          },
          datePublished: article.datePublished,
          dateModified: article.dateModified,
          image: article.image,
          url: article.url,
          publisher: {
            '@type': 'Organization',
            name: 'top-vds',
            logo: {
              '@type': 'ImageObject',
              url: 'https://top-vds.ru/logo.png'
            }
          }
        };
      
      case 'breadcrumb':
        if (!breadcrumbs || breadcrumbs.length === 0) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        };
      
      case 'faq':
        if (!faqItems || faqItems.length === 0) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer
            }
          }))
        };
      
      default:
        return null;
    }
  };

  const schema = generateSchema();
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};