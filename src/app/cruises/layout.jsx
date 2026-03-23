export const runtime = 'edge';

import { generatePageMetadata } from '../../utils/seo';

export async function generateMetadata() {
    return await generatePageMetadata('cruises');
}

export default function CruiseLayout({ children }) {
    return <>{children}</>;
}
