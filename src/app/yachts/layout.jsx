import { generatePageMetadata } from '../../utils/seo';

export async function generateMetadata() {
    return await generatePageMetadata('yachts');
}

export default function YachtsLayout({ children }) {
    return <>{children}</>;
}
