import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/account', '/api/', '/cart', '/saved'],
        },
        sitemap: 'https://palshop.app/sitemap.xml',
    };
}
