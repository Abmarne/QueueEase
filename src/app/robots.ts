import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Prevents Google from trying to index private dashboards
    },
    sitemap: 'https://queue-ease-umber.vercel.app/sitemap.xml',
  };
}
