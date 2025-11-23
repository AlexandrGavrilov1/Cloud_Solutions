import { useCallback } from 'react';
import { notifyPageUpdate, notifyMultiplePages, notifySitemapUpdate } from '@/utils/indexnow';

export const useIndexNow = () => {
  const notifyPage = useCallback((path: string) => {
    notifyPageUpdate(path);
  }, []);

  const notifyPages = useCallback((paths: string[]) => {
    notifyMultiplePages(paths);
  }, []);

  const notifySitemap = useCallback(() => {
    notifySitemapUpdate();
  }, []);

  const notifyBlogPost = useCallback((slug: string) => {
    notifyMultiplePages([
      '/blog',
      `/blog/${slug}`,
      '/sitemap.xml'
    ]);
  }, []);

  const notifyProviderUpdate = useCallback(() => {
    notifyMultiplePages([
      '/',
      '/sitemap.xml'
    ]);
  }, []);

  return {
    notifyPage,
    notifyPages,
    notifySitemap,
    notifyBlogPost,
    notifyProviderUpdate
  };
};
