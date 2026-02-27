import React from 'react';
import { motion } from 'framer-motion';
import { User, MessageSquare, ArrowRight, Plane, Send } from 'lucide-react';

// Import assets
import blog1 from '../../assets/blog1.jpg';
import blog2 from '../../assets/blog2.jpg';
import blog3 from '../../assets/blog3.jpg';

const blogPosts = [
    {
        id: 1,
        image: blog1,
        date: '04',
        month: 'Nov',
        author: 'admin',
        comments: '0 Comments',
        title: 'Top 8 Amazing Places to Stay in California',
    },
    {
        id: 2,
        image: blog2,
        date: '04',
        month: 'Nov',
        author: 'admin',
        comments: '0 Comments',
        title: 'The surfing man will adventure your mind',
    },
    {
        id: 3,
        image: blog3,
        date: '04',
        month: 'Nov',
        author: 'admin',
        comments: '0 Comments',
        title: 'Top 5 destinations & adventure travel',
    },
];

export default function BlogNews() {
    return (
        <section className="bg-[#E9F7FF] py-20 px-4 sm:px-8 md:px-12 lg:px-16">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-3 bg-white px-6 py-2.5 rounded-full mb-6 shadow-sm border border-blue-50">
                        <svg className="text-brand-magic" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                        </svg>
                        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">
                            Articles
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary max-w-2xl mx-auto leading-tight">
                        Latest News & Articles from <br className="hidden sm:block" />
                        <span className="text-[#FDB338]">the Blog Posts</span>
                    </h2>
                </div>

                {/* Blog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 sm:mb-28 max-w-6xl mx-auto">
                    {blogPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full mx-auto w-full max-w-[360px]"
                        >
                            {/* Image Container */}
                            <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Date Badge */}
                                <div className="absolute bottom-4 left-4 bg-secondary text-white px-3 py-1.5 rounded-lg flex flex-col items-center">
                                    <span className="text-lg font-bold leading-none">{post.date}</span>
                                    <span className="text-[9px] uppercase font-medium">{post.month}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                {/* Meta */}
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                                        <User size={13} className="text-primary" />
                                        <span>{post.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                                        <MessageSquare size={13} className="text-primary" />
                                        <span>{post.comments}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-secondary mb-4 flex-1 group-hover:text-primary transition-colors leading-snug font-sans">
                                    {post.title}
                                </h3>

                                {/* Read More */}
                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between group/link cursor-pointer">
                                    <span className="text-xs font-bold text-gray-500 group-hover/link:text-primary transition-colors">Read More</span>
                                    <ArrowRight size={14} className="text-gray-400 group-hover/link:text-primary group-hover/link:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Subscribe Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-3 bg-white px-6 py-2.5 rounded-full mb-6 shadow-sm border border-blue-50">
                            <svg className="text-brand-magic" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                            </svg>
                            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">
                                Subscribe Now
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary">
                            Get the Latest News
                        </h2>
                    </div>

                    {/* Subscription Form */}
                    <div className="relative max-w-2xl mx-auto bg-white flex items-center h-[50px] sm:h-[65px] shadow-sm">
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="w-full h-full bg-transparent text-gray-500 px-6 sm:px-10 focus:outline-none text-sm sm:text-base"
                        />
                        <button className="flex items-center justify-center text-brand-heading hover:opacity-70 transition-all pr-6 sm:pr-10">
                            <Send size={20} className="-rotate-12" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
