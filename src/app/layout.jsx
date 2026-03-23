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

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${philosopher.variable} ${elMessiri.variable} ${plusJakartaSans.variable} ${figtree.variable}`}>
            <body className="font-sans text-slate-900 antialiased min-h-screen flex flex-col">
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
                        </CustomerAuthProvider>
                    </CurrencyProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
