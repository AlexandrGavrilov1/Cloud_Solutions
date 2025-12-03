const INDEXNOW_KEY = '7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c';
const SITE_URL = 'https://topcloudhub.ru';

const isProduction = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'topcloudhub.ru';
};

export const submitToIndexNow = async (urls: string[]) => {
  if (!isProduction()) {
    console.debug('IndexNow: отключен для preview-версии');
    return [];
  }

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://yandex.com/indexnow',
    'https://www.bing.com/indexnow'
  ];

  const payload = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/indexnow-key.txt`,
    urlList: urls.map(url => url.startsWith('http') ? url : `${SITE_URL}${url}`)
  };

  const results = await Promise.allSettled(
    endpoints.map(endpoint =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    )
  );

  const successCount = results.filter(r => r.status === 'fulfilled').length;
  console.debug(`IndexNow: отправлено в ${successCount}/${endpoints.length} поисковиков`, urls);

  return results;
};

export const notifyPageUpdate = (path: string) => {
  if (typeof window !== 'undefined') {
    submitToIndexNow([path]).catch(err => 
      console.debug('IndexNow notification error:', err)
    );
  }
};

export const notifyMultiplePages = (paths: string[]) => {
  if (typeof window !== 'undefined' && paths.length > 0) {
    submitToIndexNow(paths).catch(err => 
      console.debug('IndexNow batch notification error:', err)
    );
  }
};

export const notifySitemapUpdate = () => {
  if (typeof window !== 'undefined') {
    submitToIndexNow(['/sitemap.xml']).catch(err => 
      console.debug('IndexNow sitemap notification error:', err)
    );
  }
};