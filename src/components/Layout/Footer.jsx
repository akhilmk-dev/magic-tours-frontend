import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-brand-navy text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">A</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-lg leading-tight">AL TAYER</span>
                                <span className="text-gray-400 text-xs tracking-wider uppercase">Travel Agency</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            A subsidiary of the Al Tayer Group, providing world-class travel services to corporate and individual clients since 1979.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Our Services</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/corporate" className="hover:text-primary transition-colors">Corporate Travel Management</Link></li>
                            <li><Link to="/outbound" className="hover:text-primary transition-colors">Holiday Packages</Link></li>
                            <li><a href="#" className="hover:text-primary transition-colors">M.I.C.E & Events</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Visa Services</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Travel Insurance</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Latest News</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary mt-1" />
                                <span>Al Tayer Tower, Sheikh Zayed Road, Dubai, UAE</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-primary" />
                                <span>+971 4 205 7777</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-primary" />
                                <span>travel@altayer-travel.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© 2026 Al Tayer Travel Agency. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span>MEMBER OF AL TAYER GROUP</span>
                        <span>IATA ACCREDITED</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
