import { generatePageMetadata } from '../../utils/seo';

export async function generateMetadata() {
    return await generatePageMetadata('tours');
}

export default function ToursLayout({ children }) {
    return <>{children}</>;
}
