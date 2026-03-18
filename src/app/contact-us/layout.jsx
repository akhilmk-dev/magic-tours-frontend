import { generatePageMetadata } from '../../utils/seo';

export async function generateMetadata() {
    return await generatePageMetadata('contact');
}

export default function ContactLayout({ children }) {
    return <>{children}</>;
}
