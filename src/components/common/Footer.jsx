import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#0F1E32] text-white pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0F1E32] font-bold text-xl">
                                M
                            </div>
                            <span className="text-2xl font-bold">Magic Tours</span>
                        </Link>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Discover the world's most breathtaking destinations with us. Your journey begins here.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFA500] transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFA500] transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFA500] transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFA500] transition-colors">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-slate-400 hover:text-[#FFA500] transition-colors">Home</Link></li>
                            <li><Link to="/about" className="text-slate-400 hover:text-[#FFA500] transition-colors">About Us</Link></li>
                            <li><Link to="/destinations" className="text-slate-400 hover:text-[#FFA500] transition-colors">Destinations</Link></li>
                            <li><Link to="/packages" className="text-slate-400 hover:text-[#FFA500] transition-colors">Tour Packages</Link></li>
                            <li><Link to="/contact" className="text-slate-400 hover:text-[#FFA500] transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">Our Services</h4>
                        <ul className="space-y-4">
                            <li><Link to="#" className="text-slate-400 hover:text-[#FFA500] transition-colors">Flight Booking</Link></li>
                            <li><Link to="#" className="text-slate-400 hover:text-[#FFA500] transition-colors">Hotel Reservation</Link></li>
                            <li><Link to="#" className="text-slate-400 hover:text-[#FFA500] transition-colors">Tour Planning</Link></li>
                            <li><Link to="#" className="text-slate-400 hover:text-[#FFA500] transition-colors">Car Rental</Link></li>
                            <li><Link to="#" className="text-slate-400 hover:text-[#FFA500] transition-colors">Travel Insurance</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <MapPin className="text-[#FFA500] mt-1" size={20} />
                                <span className="text-slate-400">123 Magic Street, Tourism Plaza, New York, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="text-[#FFA500]" size={20} />
                                <span className="text-slate-400">+1 (234) 567-8900</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail className="text-[#FFA500]" size={20} />
                                <span className="text-slate-400">info@magictours.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">© 2024 Magic Tours. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link to="#" className="hover:text-white">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white">Terms of Service</Link>
                        <Link to="#" className="hover:text-white">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
