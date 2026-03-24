const BASE_URL = 'https://magic-tours-frontend.pages.dev/'; // Replace with your production domain

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/profile',
                    '/login',
                    '/admin',
                    '/api/',
                    '/test-page',
                    '/vendor-packages',
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
