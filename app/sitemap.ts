import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://palshop.app';

    const routes = [
        '',
        '/shop',
        '/categories',
        '/about',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...routes];
}
