import React from 'react';
import { Headphones, Activity, Handshake, Shield, Monitor, FileCheck } from 'lucide-react';

const solutions = [
    {
        icon: Headphones,
        title: "24/7 VIP Support",
        description: "Round-the-clock assistance for your executives, anywhere in the world. No bots, just human experts."
    },
    {
        icon: Activity,
        title: "Predictive Analytics",
        description: "Advanced reporting dashboards to track spend, compliance, and identify untapped saving opportunities."
    },
    {
        icon: Handshake,
        title: "Corporate Negotiations",
        description: "Access to exclusive hotel rates and airline discounts that aren't available to the general public."
    },
    {
        icon: Shield,
        title: "Duty of Care",
        description: "Comprehensive risk management and real-time traveler tracking to ensure employee safety globally."
    },
    {
        icon: Monitor,
        title: "Unified Platform",
        description: "Single sign-on platform for booking, approvals, and expense management for all employees."
    },
    {
        icon: FileCheck,
        title: "VIP Concierge",
        description: "Fast-track airport clearance, luxury chauffeur services, and private jet charters at your fingertips."
    }
];

const Solutions = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-secondary mb-6">Comprehensive Travel Solutions</h2>
                    <p className="text-gray-500">
                        We provide end-to-end management that prioritizes traveler safety, cost efficiency, and seamless logistics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {solutions.map((item, index) => (
                        <div key={index} className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-secondary mb-3">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solutions;
