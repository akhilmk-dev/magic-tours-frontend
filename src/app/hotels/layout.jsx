import { generatePageMetadata } from '../../utils/seo';

export async function generateMetadata() {
    return await generatePageMetadata('hotels');
}

export default function HotelsLayout({ children }) {
    return <>{children}</>;
}
