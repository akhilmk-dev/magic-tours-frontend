export const runtime = 'edge';

const BASE_URL = 'https://magic-tours-frontend.pages.dev';
const API_BASE = 'https://magic-apis.staff-b0c.workers.dev';

// Static routes with their SEO metadata
const staticRoutes = [
    { url: '/', changeFrequency: 'daily', priority: 1.0 },
    { url: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/contact-us', changeFrequency: 'monthly', priority: 0.5 },
    { url: '/services', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/destinations', changeFrequency: 'weekly', priority: 0.9 },
    { url: '/tours', changeFrequency: 'daily', priority: 0.9 },
    { url: '/packages', changeFrequency: 'daily', priority: 0.9 },
    { url: '/cruises', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/hotels', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/private-jets', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/yachts', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/visa', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/idl', changeFrequency: 'monthly', priority: 0.7 },


    { url: '/faq', changeFrequency: 'monthly', priority: 0.5 },
    { url: '/support', changeFrequency: 'monthly', priority: 0.5 },
];

export default async function sitemap() {
    const now = new Date().toISOString();

    // Build static entries
    const staticEntries = staticRoutes.map(({ url, changeFrequency, priority }) => ({
        url: `${BASE_URL}${url}`,
        lastModified: now,
        changeFrequency,
        priority,
    }));

    // Fetch dynamic packages - paginate through all pages if needed
    let packageEntries = [];
    let destinationEntries = [];

    try {
        // Fetch all active packages (fetch up to 500 at once for sitemap)
        const pkgRes = await fetch(
            `${API_BASE}/packages/frontend/list?limit=500&page=1`,
            { next: { revalidate: 86400 } } // Cache for 24 hours
        );

        if (pkgRes.ok) {
            const pkgData = await pkgRes.json();
            const packages = pkgData.data || [];

            packageEntries = packages.map((pkg) => ({
                url: `${BASE_URL}/packages/${pkg.slug || pkg.id}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            }));

            // If there are more pages, fetch them too
            const totalPages = pkgData.pagination?.totalPages || 1;
            if (totalPages > 1) {
                const extraFetches = [];
                for (let page = 2; page <= totalPages; page++) {
                    extraFetches.push(
                        fetch(`${API_BASE}/packages/frontend/list?limit=500&page=${page}`, {
                            next: { revalidate: 86400 },
                        })
                            .then((r) => r.json())
                            .then((d) =>
                                (d.data || []).map((pkg) => ({
                                    url: `${BASE_URL}/packages/${pkg.slug || pkg.id}`,
                                    lastModified: now,
                                    changeFrequency: 'weekly',
                                    priority: 0.8,
                                }))
                            )
                            .catch(() => [])
                    );
                }
                const extraResults = await Promise.all(extraFetches);
                packageEntries = [...packageEntries, ...extraResults.flat()];
            }
        }
    } catch (err) {
        console.error('Sitemap: Failed to fetch packages', err);
    }

    try {
        // Fetch active destinations for destination-filtered tour URLs
        const filtersRes = await fetch(`${API_BASE}/packages/frontend/filters`, {
            next: { revalidate: 86400 },
        });

        if (filtersRes.ok) {
            const filtersData = await filtersRes.json();
            const destinations = filtersData.destinations || [];

            destinationEntries = destinations.map((dest) => ({
                url: `${BASE_URL}/tours?destination_slug=${dest.slug}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.75,
            }));
        }
    } catch (err) {
        console.error('Sitemap: Failed to fetch destinations', err);
    }

    return [...staticEntries, ...packageEntries, ...destinationEntries];
}
