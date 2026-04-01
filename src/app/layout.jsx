import { Inter, Philosopher, El_Messiri, Plus_Jakarta_Sans, Figtree } from 'next/font/google';
import '../index.css';
import { ToastProvider } from '../context/ToastContext';
import { CustomerAuthProvider } from '../context/CustomerAuthContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import AuthModal from '../components/common/AuthModal';
import ProfileEditModal from '../components/common/ProfileEditModal';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
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

export async function generateMetadata() {
    return await generatePageMetadata('home');
}

export default async function RootLayout({ children }) {
    const settings = await getPublicSettings();
    const gtmId = settings.gtm_id;
    const jotformSnippet = settings.jotform_chatbot_snippet;

    return (
        <html lang="en" className={`${inter.variable} ${philosopher.variable} ${elMessiri.variable} ${plusJakartaSans.variable} ${figtree.variable}`}>
            <head>
                {gtmId && (
                    <Script
                        id="gtm-script"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                                })(window,document,'script','dataLayer','${gtmId}');
                            `,
                        }}
                    />
                )}
            </head>
            <body suppressHydrationWarning className="font-sans text-slate-900 antialiased min-h-screen flex flex-col">
                {gtmId && (
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                        />
                    </noscript>
                )}
                <ToastProvider>
                    <CurrencyProvider>
                        <CustomerAuthProvider>
                            <AuthModal />
                            <ProfileEditModal />
                            <Navbar />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <Footer />
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
