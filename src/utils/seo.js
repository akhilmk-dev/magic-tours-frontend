export async function getSeoData() {
    try {
        const response = await fetch('https://magic-apis.staff-b0c.workers.dev/settings/seo', {
            next: { revalidate: 3600 } // Revalidate every hour
        });
        if (!response.ok) throw new Error('Failed to fetch SEO data');
        const json = await response.json();
        return json.data || {};
    } catch (error) {
        console.error('SEO Data Fetch Error:', error);
        return {};
    }
}

export async function generatePageMetadata(pageKey) {
    const seoData = await getSeoData();
    const pageSeo = seoData[pageKey] || seoData['home'] || {};

    return {
        title: pageSeo.title || 'Magic Tours - Luxury Travel Experiences',
        description: pageSeo.description || 'Experience the magic of travel with our curated luxury tours, cruises, and personalized travel solutions.',
        keywords: pageSeo.keywords || 'tours, travel, adventure, luxury',
        viewport: 'width=device-width, initial-scale=1',
        // You can add more default meta tags here
    };
}
