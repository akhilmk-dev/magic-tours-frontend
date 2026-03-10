"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, MapPin, Phone, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import logo from '../../assets/logo.png';
import logoWhite from '../../assets/logowhite.png';

const TopBar = ({ isTransparent, user, onLogout, onOpenAuthModal }) => {
    return (
        <div className={clsx(
            "border-b transition-all duration-300",
            isTransparent ? "bg-transparent border-white/10 text-white/80" : "bg-[#fcfcfc] border-gray-100 text-gray-500"
        )}>
            <div className="px-3 sm:px-4 md:px-6 flex justify-between items-center text-[11px] sm:text-[12px] font-medium w-full py-1.5">
                {/* Left: Location & Phone */}
                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="hidden sm:flex items-center gap-1.5">
                        <MapPin size={13} className={isTransparent ? "text-white/60" : "text-gray-400"} />
                        <span>Doha, Qatar</span>
                    </div>
                    <div className={clsx("flex items-center gap-1.5 sm:border-l sm:pl-6", isTransparent ? "border-white/10" : "border-gray-200")}>
                        <Phone size={13} className={isTransparent ? "text-white/60" : "text-gray-400"} />
                        <span>+974 444 8888</span>
                    </div>
                </div>
                {/* Right: Currency, FAQ, etc. */}
                <div className="flex items-center gap-3 sm:gap-5">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="https://flagcdn.com/w20/qa.png" alt="Qatar" className="w-4 h-auto rounded-sm" />
                        <span>QAR</span>
                        <ChevronDown size={12} />
                    </div>
                    <div className={clsx("w-px h-3 hidden sm:block", isTransparent ? "bg-white/10" : "bg-gray-200")} />
                    <Link href="/faq" className={clsx("transition-colors hidden sm:block", isTransparent ? "hover:text-white" : "hover:text-[#0D0D0C]")}>FAQ</Link>
                    <div className={clsx("w-px h-3 hidden md:block", isTransparent ? "bg-white/10" : "bg-gray-200")} />
                    <Link href="/support" className={clsx("transition-colors hidden md:block", isTransparent ? "hover:text-white" : "hover:text-[#0D0D0C]")}>Support</Link>
                    <div className={clsx("w-px h-3 hidden lg:block", isTransparent ? "bg-white/10" : "bg-gray-200")} />
                    {user ? (
                        <button onClick={onLogout} className={clsx("items-center gap-1.5 transition-colors hidden lg:flex", isTransparent ? "hover:text-white" : "hover:text-[#0D0D0C]")}>
                            Sign Out
                            <LogOut size={14} />
                        </button>
                    ) : (
                        <button onClick={() => onOpenAuthModal('login')} className={clsx("items-center gap-1.5 transition-colors hidden lg:flex", isTransparent ? "hover:text-white" : "hover:text-[#0D0D0C]")}>
                            Sign In / Register
                            <User size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout, openAuthModal } = useCustomerAuth();

    // Check if we are on pages that should have a transparent navbar initially
    const isTransparentPage = pathname === '/' || pathname === '/tours';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', dropdown: true },
        { name: 'Destinations', path: '/packages' },
        { name: 'Cruise', path: '/cruise' },
        { name: 'Hotels', path: '/hotels' },
        { name: 'Tours', path: '/tours' },
        { name: 'Visa Services', path: '/visa-application' },
        { name: 'IDL', path: '/idl' },
        { name: 'Private Jets', path: '/private-jets' },
        { name: 'Contact Us', path: '/contact' },
    ];

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
    };

    const isTransparent = isTransparentPage && !isScrolled;

    return (
        <header className={clsx(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isTransparent ? "bg-transparent" : "bg-white shadow-sm"
        )}>
            <TopBar isTransparent={isTransparent} user={user} onLogout={handleLogout} onOpenAuthModal={openAuthModal} />
            <nav className="py-3 sm:py-4 md:py-5">
                <div className="px-3 sm:px-4 md:px-6 flex items-center justify-between w-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <img src={isTransparent ? logoWhite.src : logo.src} alt="Magic Tours Logo" className="h-8 sm:h-10 md:h-12 w-auto object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={clsx(
                                    "text-[14px] font-medium transition-all flex items-center gap-1 py-1 relative",
                                    (pathname === link.path ? "text-[#0D0D0C]" : "text-[#0D0D0C] hover:text-[#0D0D0C]/80")
                                )}
                            >
                                {link.name}
                                {link.dropdown && <ChevronDown size={12} />}
                                {(pathname === link.path && !isTransparent) && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0D0D0C]" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={clsx(
                            "lg:hidden p-2 transition-colors",
                            isTransparent ? "text-white" : "text-[#0D0D0C]"
                        )}
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl lg:hidden flex flex-col animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
                        <div className="p-3 sm:p-4 flex flex-col gap-0.5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={clsx(
                                        "text-[#0D0D0C] font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-[14px]",
                                        pathname === link.path && "bg-gray-50 text-[#0D0D0C] font-bold"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        {/* Utility Links for Mobile */}
                        <div className="border-t border-gray-100 p-3 sm:p-4 flex flex-col gap-0.5">
                            <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 text-[13px]">FAQ</Link>
                            <Link href="/support" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 text-[13px]">Support</Link>
                            {user ? (
                                <button onClick={handleLogout} className="text-gray-500 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 text-[13px] flex items-center gap-2 w-full text-left">
                                    <LogOut size={14} />
                                    Sign Out
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        openAuthModal('login');
                                    }}
                                    className="text-gray-500 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 text-[13px] flex items-center gap-2 w-full text-left"
                                >
                                    <User size={14} />
                                    Sign In / Register
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

