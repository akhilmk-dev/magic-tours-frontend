import { Inter, Philosopher, El_Messiri, Plus_Jakarta_Sans, Figtree, Montserrat } from 'next/font/google';
import '../index.css';
import { ToastProvider } from '../context/ToastContext';
import { CustomerAuthProvider } from '../context/CustomerAuthContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import ProfileEditModal from '../components/common/ProfileEditModal';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import AnniversaryBanner from '../components/common/AnniversaryBanner';
import { generatePageMetadata } from '../utils/seo';
import { getPublicSettings } from '../utils/settings';
import Script from 'next/script';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const philosopher = Philosopher({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-philosopher',
    display: 'swap',
});

const elMessiri = El_Messiri({
    subsets: ['latin'],
    variable: '--font-el-messiri',
    display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta-sans',
    display: 'swap',
});

const figtree = Figtree({
    subsets: ['latin'],
    variable: '--font-figtree',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
});

export async function generateMetadata() {
    return await generatePageMetadata('home');
}

export default async function RootLayout({ children }) {
    const settings = await getPublicSettings();
    const jotformSnippet = settings.jotform_chatbot_snippet;

    // The backend may send the schema wrapped in a <script type="application/ld+json"> tag.
    // Strip the wrapper so we can inject just the JSON-LD into a real <script> element.
    const schemaJsonLd = settings.schema
        ? settings.schema.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim()
        : '';

    // GTM / Google Analytics snippets come from settings as full HTML
    // (<script>/<noscript>/<iframe>). We parse them into real elements so the
    // scripts actually execute (innerHTML-injected scripts do not run).
    //
    // GTM head loader: keep only the inline JS, drop the <script> wrapper.
    const tagManagerHead = (settings.tag_manager_head || '')
        .replace(/<\/?script[^>]*>/gi, '')
        .trim();

    // GTM body: <noscript><iframe>...; pull out the iframe src for a real <noscript>.
    const tagManagerBodySrc = (settings.tag_manager_body || '').match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)?.[1] || '';

    // Google Analytics: an external gtag loader (src) + an inline config block.
    const gaSrc = (settings.google_analytics || '').match(/<script[^>]*\ssrc=["']([^"']+)["']/i)?.[1] || '';
    const gaInline = (settings.google_analytics || '')
        .match(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/i)?.[1]?.trim() || '';

    return (
        <html lang="en" className={`${inter.variable} ${philosopher.variable} ${elMessiri.variable} ${plusJakartaSans.variable} ${figtree.variable} ${montserrat.variable}`}>
            <head>
                <meta name="google-site-verification" content="WdB3WvxRcP0G0oWm0JoHQcoSz3FlNxG-2OahImYmJgM" />
                {schemaJsonLd && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: schemaJsonLd }}
                    />
                )}
                {tagManagerHead && (
                    <script dangerouslySetInnerHTML={{ __html: tagManagerHead }} />
                )}
                {gaSrc && (
                    <script async src={gaSrc} />
                )}
                {gaInline && (
                    <script dangerouslySetInnerHTML={{ __html: gaInline }} />
                )}
            </head>
            <body suppressHydrationWarning className="font-sans text-slate-900 antialiased min-h-screen flex flex-col">
                {tagManagerBodySrc && (
                    <noscript>
                        <iframe
                            src={tagManagerBodySrc}
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                        />
                    </noscript>
                )}
                <ToastProvider>
                    <CurrencyProvider>
                        <CustomerAuthProvider>
                            <ProfileEditModal />
                            <Navbar />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <Footer />
                            <FloatingButtons />
                            <AnniversaryBanner imageUrl={settings?.anniversary_banner || ''} />
                        {jotformSnippet && (() => {
                                const srcMatch = jotformSnippet.match(/src=['"]([^'"]+)['"]/);
                                return srcMatch ? (
                                    <Script
                                        id="jotform-chatbot"
                                        src={srcMatch[1]}
                                        strategy="lazyOnload"
                                    />
                                ) : null;
                            })()}
                        </CustomerAuthProvider>
                    </CurrencyProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
