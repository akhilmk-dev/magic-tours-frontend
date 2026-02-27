import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, MapPin, Phone, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import logo from '../../assets/logo.png';
import logoWhite from '../../assets/logowhite.png';

const TopBar = ({ isTransparent }) => {
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
                    <Link to="/faq" className={clsx("transition-colors hidden sm:block", isTransparent ? "hover:text-white" : "hover:text-gray-900")}>FAQ</Link>
                    <div className={clsx("w-px h-3 hidden md:block", isTransparent ? "bg-white/10" : "bg-gray-200")} />
                    <Link to="/support" className={clsx("transition-colors hidden md:block", isTransparent ? "hover:text-white" : "hover:text-gray-900")}>Support</Link>
                    <div className={clsx("w-px h-3 hidden lg:block", isTransparent ? "bg-white/10" : "bg-gray-200")} />
                    <Link to="/login" className={clsx("items-center gap-1.5 transition-colors hidden lg:flex", isTransparent ? "hover:text-white" : "hover:text-gray-900")}>
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

    const isTransparent = isHomePage && !isScrolled;

    return (
        <header className={clsx(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isTransparent ? "bg-transparent" : "bg-white shadow-sm"
        )}>
            <TopBar isTransparent={isTransparent} />
            <nav className="py-3 sm:py-4 md:py-5">
                <div className="px-3 sm:px-4 md:px-6 flex items-center justify-between w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                        <img src={isTransparent ? logoWhite : logo} alt="Magic Tours Logo" className="h-8 sm:h-10 md:h-12 w-auto object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={clsx(
                                    "text-[14px] font-medium transition-all flex items-center gap-1 py-1 relative",
                                    isTransparent
                                        ? "text-white/90 hover:text-white"
                                        : (location.pathname === link.path ? "text-gray-900" : "text-gray-600 hover:text-gray-900")
                                )}
                            >
                                {link.name}
                                {link.dropdown && <ChevronDown size={12} />}
                                {(location.pathname === link.path && !isTransparent) && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gray-800" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={clsx(
                            "lg:hidden p-2 transition-colors",
                            isTransparent ? "text-white" : "text-gray-800"
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
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={clsx(
                                        "text-gray-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-[14px]",
                                        location.pathname === link.path && "bg-gray-50 text-gray-900 font-bold"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        {/* Utility Links for Mobile */}
                        <div className="border-t border-gray-100 p-3 sm:p-4 flex flex-col gap-0.5">
                            <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 text-[13px]">FAQ</Link>
                            <Link to="/support" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 text-[13px]">Support</Link>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 text-[13px] flex items-center gap-2">
                                <User size={14} />
                                Sign In / Register
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

