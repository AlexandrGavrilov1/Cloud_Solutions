const INDEXNOW_KEY = '7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c';
const SITE_URL = 'https://topcloudhub.ru';

export const submitToIndexNow = async (urls: string[]) => {
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

  return results;
};

export const notifyPageUpdate = (path: string) => {
  if (typeof window !== 'undefined') {
    submitToIndexNow([path]).catch(err => 
      console.debug('IndexNow notification:', err)
    );
  }
};
