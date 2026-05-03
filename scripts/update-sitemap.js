import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { blogPosts } from '../src/data/blog-posts.ts';

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const parseDate = (dateStr) => {
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  return new Date(dateStr);
};

const generateSitemap = () => {
  const baseUrl = 'https://top-vds.ru';
  const today = formatDate(new Date());

  const staticPages = [
    { loc: `${baseUrl}/`, lastmod: today, changefreq: 'daily', priority: 1.0, comment: 'Главная страница' },
    { loc: `${baseUrl}/faq`, lastmod: today, changefreq: 'weekly', priority: 0.8, comment: 'FAQ' },
    { loc: `${baseUrl}/about`, lastmod: today, changefreq: 'monthly', priority: 0.7, comment: 'О проекте' },
    { loc: `${baseUrl}/privacy`, lastmod: today, changefreq: 'monthly', priority: 0.5, comment: 'Политика конфиденциальности' },
    { loc: `${baseUrl}/uptime`, lastmod: today, changefreq: 'daily', priority: 0.9, comment: 'Uptime статистика' },
    { loc: `${baseUrl}/promo`, lastmod: today, changefreq: 'daily', priority: 0.9, comment: 'Спецпредложения' },
    { loc: `${baseUrl}/blog`, lastmod: today, changefreq: 'weekly', priority: 0.9, comment: 'Блог' }
  ];

  const blogUrls = blogPosts.map(post => {
    const postDate = post.dateModified 
      ? new Date(post.dateModified) 
      : post.datePublished 
        ? new Date(post.datePublished)
        : parseDate(post.date);

    return {
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: formatDate(postDate),
      changefreq: 'monthly',
      priority: 0.8,
      comment: `Статья: ${post.title}`
    };
  });

  const allUrls = [...staticPages, ...blogUrls];

  const urlsXml = allUrls
    .map(url => `  <!-- ${url.comment} -->
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`)
    .join('\n  \n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
${urlsXml}
  
</urlset>`;
};

const sitemapPath = resolve(process.cwd(), 'public', 'sitemap.xml');
const sitemapContent = generateSitemap();

writeFileSync(sitemapPath, sitemapContent, 'utf-8');
console.log(`✅ Sitemap обновлён: ${blogPosts.length} статей + 7 статических страниц`);
console.log(`📁 Путь: ${sitemapPath}`);