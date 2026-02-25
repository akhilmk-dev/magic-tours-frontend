import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, MapPin, Phone, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import logo from '../../assets/logo.png';

const TopBar = () => {
    return (
        <div className="bg-[#fcfcfc] border-b border-gray-100 py-1.5 hidden lg:block">
            <div className="px-4 md:px-6 flex justify-between items-center text-[12px] text-gray-500 font-medium w-full">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" />
                        <span>Doha, Qatar</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-gray-200 pl-6">
                        <Phone size={14} className="text-gray-400" />
                        <span>+974 444 8888</span>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">
                        <img src="https://flagcdn.com/w20/qa.png" alt="Qatar" className="w-4 h-auto rounded-sm" />
                        <span>QAR</span>
                        <ChevronDown size={12} />
                    </div>
                    <div className="w-px h-3 bg-gray-200" />
                    <Link to="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
                    <div className="w-px h-3 bg-gray-200" />
                    <Link to="/support" className="hover:text-gray-900 transition-colors">Support</Link>
                    <div className="w-px h-3 bg-gray-200" />
                    <Link to="/login" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                        Sign In / Register
                        <User size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const { user, logout } = useCustomerAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are on the home page
    const isHomePage = location.pathname === '/';

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
        { name: 'Private Jets', path: '/private-jets' },
        { name: 'Sports', path: '/sports' },
        { name: 'Contact Us', path: '/contact' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    return (
        <header className={clsx(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm"
        )}>
            <TopBar />
            <nav className="py-4 md:py-5">
                <div className="px-4 md:px-6 flex items-center justify-between w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                        <img src={logo} alt="Magic Tours Logo" className="h-10 md:h-12 w-auto object-contain" />
                        <span className="font-bold text-xl md:text-2xl text-[#4A4A4A] tracking-tight uppercase">Magic Tours</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={clsx(
                                    "text-[14px] font-medium transition-all flex items-center gap-1 py-1 relative",
                                    location.pathname === link.path
                                        ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-gray-800"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                {link.name}
                                {link.dropdown && <ChevronDown size={12} />}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-gray-800"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-4 lg:hidden flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={clsx(
                                    "text-gray-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors",
                                    location.pathname === link.path && "bg-gray-50 text-gray-900 font-bold"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    );
}
