import { generatePageMetadata } from '../../utils/seo';

export async function generateMetadata() {
    return await generatePageMetadata('private_jets');
}

export default function PrivateJetsLayout({ children }) {
    return <>{children}</>;
}
