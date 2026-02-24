import React from 'react';
import { ArrowRight } from 'lucide-react';

const services = [
    {
        title: "Corporate Ticketing",
        description: "End-to-end managed travel solutions for global businesses.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"
    },
    {
        title: "Leisure",
        description: "Hand-picked luxury vacations and bespoke experiences.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2673&auto=format&fit=crop"
    },
    {
        title: "M.I.C.E",
        description: "Premium planning for Meetings, Incentives, and Events.",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "DMC",
        description: "Expert local destination management across the UAE.",
        image: "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?q=80&w=2573&auto=format&fit=crop"
    }
];

const Services = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-secondary mb-4 relative inline-block">
                        Our Services
                        <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-yellow-400 rounded-full"></span>
                    </h2>
                </div>
                <p className="text-gray-500 max-w-md text-right md:text-right mt-4 md:mt-0">
                    Tailored travel management solutions designed to exceed the expectations of the modern traveler.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                    <div key={index} className="group cursor-pointer">
                        <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500 z-10"></div>
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;
