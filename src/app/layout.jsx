import { Inter, Philosopher, El_Messiri, Plus_Jakarta_Sans, Figtree } from 'next/font/google';
import '../index.css';
import { ToastProvider } from '../context/ToastContext';
import { CustomerAuthProvider } from '../context/CustomerAuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ChatWidget from '../components/Chat/ChatWidget';
import AuthModal from '../components/common/AuthModal';

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

export const metadata = {
    title: 'Magic Tours - Luxury Travel Experiences',
    description: 'Experience the magic of travel with our curated luxury tours, cruises, and personalized travel solutions.',
};

export const runtime = 'edge';

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${philosopher.variable} ${elMessiri.variable} ${plusJakartaSans.variable} ${figtree.variable}`}>
            <body className="font-sans text-slate-900 antialiased min-h-screen flex flex-col">
                <ToastProvider>
                    <CustomerAuthProvider>
                        <AuthModal />
                        <Navbar />
                        <div className="flex-1">
                            {children}
                        </div>
                        <Footer />
                        <ChatWidget />
                    </CustomerAuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
