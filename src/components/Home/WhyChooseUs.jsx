import React from 'react';
import { ShieldCheck, Globe, Clock, Tag } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: "Unmatched Expertise",
        description: "Over 40 years of local and global travel industry experience."
    },
    {
        icon: Globe,
        title: "Global Reach",
        description: "Extensive network of partners in over 150 countries worldwide."
    },
    {
        icon: Clock,
        title: "24/7 Support",
        description: "Dedicated travel concierges available around the clock."
    },
    {
        icon: Tag,
        title: "Personalized Service",
        description: "Bespoke itineraries crafted to your specific requirements."
    }
];

const WhyChooseUs = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-secondary mb-4">Why Choose Us</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-16">
                Decades of travel expertise combined with a commitment to providing the highest standards of service.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 transition-transform hover:scale-110 duration-300">
                            <feature.icon size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-secondary mb-3">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;
