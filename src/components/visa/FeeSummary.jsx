import React from 'react';
import { HelpCircle } from 'lucide-react';

const FeeSummary = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-6">Fee Summary</h3>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Government Visa Fee</span>
                        <span className="font-bold text-gray-900">$85.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Magic Tours Service Fee</span>
                        <span className="font-bold text-gray-900">$25.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Processing Type (Standard)</span>
                        <span className="font-bold text-green-500">Free</span>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="font-black text-2xl text-gray-900">$110.00</span>
                </div>

                <div className="bg-green-50 rounded-xl p-4 flex gap-3 text-xs text-green-700 leading-relaxed">
                    <div className="mt-0.5 shrink-0">
                        <div className="w-4 h-4 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">i</div>
                    </div>
                    <p>Fees are refundable if the application is rejected within 48 hours of submission.</p>
                </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-green-400 font-bold text-sm">
                        <HelpCircle size={16} />
                        <span>Need Help?</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                        Our AI assistant is ready to help you with any questions about the visa requirements for your destination.
                    </p>
                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-xs font-bold uppercase tracking-widest backdrop-blur-sm border border-white/10">
                        Chat with AI Assistant
                    </button>
                </div>
                {/* Decorative background element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
};

export default FeeSummary;
