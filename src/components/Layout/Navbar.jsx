import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Phone, Menu, X, User } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const Navbar = () => {
    const { user, logout } = useCustomerAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-primary-dark font-bold text-lg leading-tight">AL TAYER</span>
                            <span className="text-secondary-light text-xs tracking-wider uppercase">Travel Agency</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-secondary font-medium hover:text-primary transition-colors">Services</Link>
                        <Link to="/outbound" className="text-secondary font-medium hover:text-primary transition-colors">Packages</Link>
                        <Link to="/corporate" className="text-secondary font-medium hover:text-primary transition-colors">Corporate</Link>
                        <Link to="/visa-application" className="text-secondary font-medium hover:text-primary transition-colors">Visa</Link>
                        <Link to="/about" className="text-secondary font-medium hover:text-primary transition-colors">About</Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button className="flex items-center gap-2 text-secondary px-3 py-2 rounded-full border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-all text-sm font-medium">
                            <Globe size={16} />
                            <span>EN/AED</span>
                        </button>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-full transition-all border border-transparent hover:border-gray-100"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User size={16} />
                                    </div>
                                    <span className="text-secondary font-medium text-sm hidden sm:block">{user.name}</span>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsProfileOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                                <p className="text-sm font-bold text-secondary truncate">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2.5 text-sm text-secondary hover:bg-gray-50 hover:text-primary transition-colors font-medium"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                My Account
                                            </Link>
                                            <Link
                                                to="/visa-application"
                                                className="block px-4 py-2.5 text-sm text-secondary hover:bg-gray-50 hover:text-primary transition-colors font-medium"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Visa Application
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsProfileOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-secondary hover:text-primary font-bold text-sm transition-colors">
                                    Log In
                                </Link>
                                <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-secondary hover:text-primary transition-colors p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 animate-in slide-in-from-top-2">
                    <div className="px-4 pt-4 pb-6 space-y-4 shadow-xl">
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-lg text-base font-medium text-secondary hover:bg-blue-50 hover:text-primary transition-colors"
                        >
                            Services
                        </Link>
                        <Link
                            to="/outbound"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-lg text-base font-medium text-secondary hover:bg-blue-50 hover:text-primary transition-colors"
                        >
                            Packages
                        </Link>
                        <Link
                            to="/corporate"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-lg text-base font-medium text-secondary hover:bg-blue-50 hover:text-primary transition-colors"
                        >
                            Corporate
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-lg text-base font-medium text-secondary hover:bg-blue-50 hover:text-primary transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to="/visa-application"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-lg text-base font-medium text-secondary hover:bg-blue-50 hover:text-primary transition-colors"
                        >
                            Visa
                        </Link>

                        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 text-secondary px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-all w-full font-medium"
                                    >
                                        <User size={16} />
                                        <span>My Account ({user.name})</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="bg-red-50 text-red-600 px-4 py-3 rounded-lg font-bold shadow-sm flex items-center justify-center gap-2 w-full hover:bg-red-100 transition-colors"
                                    >
                                        <span>Log Out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 text-secondary px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-all w-full font-medium"
                                    >
                                        <span>Log In</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-primary text-white px-4 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 w-full"
                                    >
                                        <span>Sign Up</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
