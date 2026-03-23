"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, MapPin, Phone, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import logo from '../../assets/logo.png';
import logoWhite from '../../assets/logowhite.png';

const getFlagCode = (currencyCode) => {
    const map = {
        'QAR': 'qa',
        'AED': 'ae',
        'USD': 'us',
        'INR': 'in',
        'AMD': 'am',
        'EUR': 'eu',
        'GBP': 'gb'
    };
    return map[currencyCode] || currencyCode.toLowerCase().slice(0, 2);
};

const CurrencyDropdown = ({ isTransparent }) => {
    const { currencies, selectedCurrency, changeCurrency } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
                <img 
                    src={`https://flagcdn.com/w20/${getFlagCode(selectedCurrency.code)}.png`} 
                    alt={selectedCurrency.code} 
                    className="w-4 h-auto rounded-sm" 
                />
                <span>{selectedCurrency.code}</span>
                <ChevronDown size={12} className={clsx("transition-transform duration-200", isOpen && "rotate-180")} />
            </div>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="py-1">
                        {currencies.map((curr) => (
                            <div
                                key={curr.code}
                                onClick={() => {
                                    changeCurrency(curr);
                                    setIsOpen(false);
                                }}
                                className={clsx(
                                    "px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors text-[12px] font-bold",
                                    selectedCurrency.code === curr.code ? "text-primary bg-primary/5" : "text-gray-700"
                                )}
                            >
                                <img 
                                    src={`https://flagcdn.com/w20/${getFlagCode(curr.code)}.png`} 
                                    alt={curr.code} 
                                    className="w-4 h-auto rounded-sm" 
                                />
                                <span>{curr.code} - {curr.symbol}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const TopBar = ({ isTransparent, user, onLogout, onOpenAuthModal }) => {
    return (
        <div className={clsx(
            "border-b transition-all duration-300",
            isTransparent ? "bg-transparent border-white/10 text-gray-500" : "bg-[#fcfcfc] border-gray-100 text-gray-500"
        )}>
            <div className="px-3 sm:px-4 md:px-6 flex justify-between items-center text-[11px] sm:text-[12px] font-medium w-full py-1.5">
                {/* Left: Location & Phone */}
                <div className="flex items-center gap-3 sm:gap-6 text-[#0D0D0C]">
                    <div className="hidden sm:flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#0D0D0C]/60" />
                        <span>Doha, Qatar</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:border-l sm:pl-6 border-gray-200">
                        <Phone size={13} className="text-[#0D0D0C]/60" />
                        <span>+974 444 8888</span>
                    </div>
                </div>
                {/* Right: Currency, FAQ, etc. */}
                <div className="flex items-center gap-3 sm:gap-5 text-[#0D0D0C]">
                    <CurrencyDropdown isTransparent={isTransparent} />
                    <div className="w-px h-3 hidden sm:block bg-gray-200" />
                    <Link href="/faq" className="transition-colors hidden sm:block hover:text-[#0D0D0C]">FAQ</Link>
                    <div className="w-px h-3 hidden md:block bg-gray-200" />
                    <Link href="/support" className="transition-colors hidden md:block hover:text-[#0D0D0C]">Support</Link>
                    <div className="w-px h-3 hidden lg:block bg-gray-200" />
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/profile" className="flex items-center gap-2 transition-all hidden lg:flex hover:text-[#0D0D0C]">
                                <div className="w-6 h-6 rounded-full bg-[#113A74] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="font-bold">{user.name?.split(' ')[0] || 'Profile'}</span>
                            </Link>
                        </div>
                    ) : (
                        <button onClick={() => onOpenAuthModal('login')} className="items-center gap-1.5 transition-colors hidden lg:flex hover:text-[#0D0D0C] font-heading font-bold">
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
    const isTransparentPage = pathname === '/' || pathname === '/tours' || pathname === '/destinations' || pathname === '/idl' || pathname === '/private-jets' || pathname === '/hotels' || pathname === '/contact-us' || pathname === '/yachts' || pathname === '/cruises' || pathname === '/visa' || pathname === '/about' || pathname === '/services' || pathname === '/faq' || pathname === '/support' || pathname === '/login';

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
        { name: 'Home', path: '/' },
        { name: 'Destinations', path: '/destinations' },
        { name: 'Hotels', path: '/hotels' },
        { name: 'Tours', path: '/tours' },
        { name: 'Visa Services', path: '/visa' },
        { name: 'IDL', path: '/idl' },
        { name: 'Cruises', path: '/cruises' },
        { name: 'Private Jets', path: '/private-jets' },
        { name: 'Yachts', path: '/yachts' },
        { name: 'Contact Us', path: '/contact-us' },

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
                        <img src={logo.src} alt="Magic Tours Logo" className="h-8 sm:h-10 md:h-12 w-auto object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-heading">
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
                                {(pathname === link.path) && (
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
                            isTransparent ? "text-[#0D0D0C]" : "text-[#0D0D0C]"
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
                                <>
                                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 text-[13px] flex items-center gap-2 w-full text-left">
                                        <div className="w-5 h-5 rounded-full bg-[#113A74] text-white flex items-center justify-center font-bold text-[10px]">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        My Profile
                                    </Link>
                                    <button onClick={handleLogout} className="text-gray-500 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 text-[13px] flex items-center gap-2 w-full text-left border-t border-gray-100 mt-1">
                                        <LogOut size={14} />
                                        Sign Out
                                    </button>
                                </>
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

