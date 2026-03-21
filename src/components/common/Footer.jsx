import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Twitter } from 'lucide-react';
import Link from 'next/link';

// Import assets
import logo from '../../assets/logo.png';
import iataLogo from '../../assets/IATA.png';

const FaPinterest = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.621 0 11.988-5.367 11.988-11.988C24.005 5.367 18.638 0 12.017 0z" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-white text-secondary pt-16 border-t border-gray-100">
            <div className="container mx-auto px-4 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="flex flex-col gap-8">
                        <Link href="/" className="flex items-center">
                            <img src={logo.src} alt="Magic Tours Logo" className="h-16 w-auto object-contain" />
                        </Link>

                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all">
                                <FaPinterest />
                            </a>
                        </div>
                    </div>

                    {/* Say Hello */}
                    <div>
                        <h4 className="text-xl font-bold text-secondary mb-8 font-heading">Say Hello</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="mailto:contact@pbmit.com" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">
                                    contact@pbmit.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+02574328301" className="text-secondary hover:text-primary transition-colors text-lg font-bold">
                                    +(02) 574 - 328 - 301
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-bold text-secondary mb-8 font-heading">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-500 hover:text-primary transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/services" className="text-gray-500 hover:text-primary transition-colors text-sm">Our Services</Link></li>
                            <li><Link href="/tours" className="text-gray-500 hover:text-primary transition-colors text-sm">Tour Packages</Link></li>
                            <li><Link href="/faq" className="text-gray-500 hover:text-primary transition-colors text-sm">FAQ</Link></li>
                            <li><Link href="/contact-us" className="text-gray-500 hover:text-primary transition-colors text-sm">Get In Touch</Link></li>
                        </ul>
                    </div>

                    {/* Trust & Support */}
                    <div>
                        <h4 className="text-xl font-bold text-secondary mb-8 font-heading">Trust & Support</h4>
                        <div className="space-y-6">
                            <div>
                                <h5 className="text-sm font-bold text-secondary mb-1">Support Hours</h5>
                                <p className="text-gray-400 text-xs">24/7 Premium Assistance</p>
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-secondary mb-1">Emergency Contact</h5>
                                <p className="text-secondary font-bold text-sm">+974 445 77 300</p>
                            </div>
                            <div className="pt-2">
                                <img src={iataLogo.src} alt="IATA logo" className="h-10 w-auto object-contain opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-500 text-xs text-center md:text-left">
                        Copyright - ©2026 Design & Developed with intertoons
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-[11px] font-bold text-secondary uppercase tracking-wider">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                        <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
                        <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
                        <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
                        <Link href="/contact-us" className="hover:text-primary transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

