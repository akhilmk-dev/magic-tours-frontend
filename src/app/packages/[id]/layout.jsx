import { api } from '../../../api/client';

export async function generateMetadata({ params }) {
    const { id } = params;
    
    try {
        // Fetch package detail for metadata
        // Note: Using the same logic as the page to get package details
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://magic-apis.staff-b0c.workers.dev'}/packages/frontend/detail/${id}`, {
            cache: 'no-store'
        });
        
        if (!response.ok) throw new Error('Failed to fetch package for metadata');
        
        const json = await response.json();
        const pkg = json.package_details || json.data || json;
        
        if (!pkg && !json.id) return { title: 'Package Not Found' };

        return {
            title: pkg.meta_title || pkg.title || 'Tour Package Detail',
            description: pkg.meta_description || pkg.description?.substring(0, 160) || 'Discover amazing travel packages with Magic Tours.',
            openGraph: {
                title: pkg.meta_title || pkg.title,
                description: pkg.meta_description || pkg.description?.substring(0, 160),
                images: pkg.image ? [pkg.image] : [],
            }
        };
    } catch (error) {
        console.error('Metadata fetch error:', error);
        return {
            title: 'Tour Package | Magic Tours',
            description: 'Explore our exclusive travel packages.'
        };
    }
}

export default function PackageLayout({ children }) {
    return <>{children}</>;
}
