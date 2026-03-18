import { generatePageMetadata } from '../../utils/seo';

export async function generateMetadata() {
    return await generatePageMetadata('destinations');
}

export default function DestinationsLayout({ children }) {
    return <>{children}</>;
}
