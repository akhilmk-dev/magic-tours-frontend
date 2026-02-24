import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import logo from '../../assets/logo.png';

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
        { name: 'Home', path: '/' },
        { name: 'Packages', path: '/packages' },
        { name: 'Visa Application', path: '/visa-application' },
        { name: 'Corporate', path: '/corporate' },
    ];

    // Determine navbar styling based on page and scroll
    const getNavbarClass = () => {
        if (isHomePage) {
            return isScrolled ? "bg-white shadow-md py-3 text-slate-800" : "bg-transparent py-5 text-white";
        }
        // Non-home pages always have white background
        return "bg-white shadow-md py-3 text-slate-800";
    };

    const getLogoClass = () => {
        if (isHomePage) {
            return isScrolled ? "text-[#0F1E32]" : "text-white";
        }
        return "text-[#0F1E32]";
    };

    const getLinkClass = (isActive) => {
        const baseClass = "text-sm font-medium transition-colors hover:text-[#FFA500]";

        if (isActive) return "text-[#FFA500] font-bold";

        if (isHomePage) {
            return isScrolled ? "text-slate-600" : "text-white/90";
        }
        return "text-slate-600";
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={clsx(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            getNavbarClass()
        )}>
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="h-12 w-auto flex items-center justify-center p-1 bg-white rounded-lg shadow-sm">
                        <img src={logo} alt="Magic Tours Logo" className="h-full w-auto object-contain" />
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={getLinkClass(location.pathname === link.path)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA / Auth */}
                <div className="hidden lg:flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className={clsx(
                                    "flex items-center gap-2 text-sm font-bold transition-all p-1 pr-3 rounded-full",
                                    isHomePage && !isScrolled ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <div className="w-8 h-8 rounded-full bg-[#0F1E32] text-white flex items-center justify-center border-2 border-white/20">
                                    <User size={14} />
                                </div>
                                <span className="hidden xl:inline">{user.name}</span>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700 text-sm font-medium"
                                    >
                                        <User size={16} className="text-slate-400" />
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 text-sm font-medium border-t border-slate-50"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className={clsx(
                                    "text-sm font-bold px-4 py-2 transition-colors",
                                    isHomePage && !isScrolled ? "text-white hover:text-[#FFA500]" : "text-slate-600 hover:text-[#0F1E32]"
                                )}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-[#0F1E32] hover:bg-[#1a3355] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2"
                >
                    {isMobileMenuOpen ? (
                        <X size={24} className={isHomePage && !isScrolled ? "text-white" : "text-slate-800"} />
                    ) : (
                        <Menu size={24} className={isHomePage && !isScrolled ? "text-white" : "text-slate-800"} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-4 lg:hidden flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={clsx(
                                "text-slate-600 font-bold py-3 px-4 rounded-lg hover:bg-slate-50 hover:text-[#0F1E32] transition-colors",
                                location.pathname === link.path && "bg-slate-50 text-[#0F1E32]"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#0F1E32] text-white flex items-center justify-center">
                                        <User size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">{user.name}</span>
                                        <span className="text-xs text-slate-500">View Profile</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 w-full py-3 text-red-500 font-bold hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex justify-center py-3 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex justify-center py-3 rounded-lg bg-[#0F1E32] text-white font-bold hover:bg-[#1a3355]"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
