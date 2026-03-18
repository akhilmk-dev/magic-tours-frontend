import { generatePageMetadata } from '../../utils/seo';

export async function generateMetadata() {
    return await generatePageMetadata('corporate');
}

export default function CorporateLayout({ children }) {
    return <>{children}</>;
}
