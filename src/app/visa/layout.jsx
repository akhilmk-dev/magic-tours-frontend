import { generatePageMetadata } from '../../utils/seo';

export async function generateMetadata() {
    return await generatePageMetadata('visa');
}

export default function VisaLayout({ children }) {
    return <>{children}</>;
}
