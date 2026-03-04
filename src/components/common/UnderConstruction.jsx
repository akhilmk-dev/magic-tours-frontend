"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Construction, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const UnderConstruction = ({ title }) => {
  return (
    <div className="min-h-[70vh] flex items-start justify-center p-4 pt-20 bg-[#fcfcfc]">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
            <div className="relative bg-white p-8 rounded-full shadow-xl border border-blue-50/50">
              <Construction size={80} className="text-blue-600 animate-pulse" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFA500] rounded-lg flex items-center justify-center shadow-lg"
            >
              <div className="w-4 h-1 bg-white rounded-full rotate-45" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">
            Page Under <span className="text-[#FFA500]">Construction</span>
          </h1>
          <p className="text-xl font-bold text-blue-600 mb-6">{title}</p>
          <p className="text-gray-600 text-lg mb-12 max-w-md mx-auto leading-relaxed">
            We're working hard to bring you something magical. This section of our world-class travel platform is currently being crafted by our team of experts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
            >
              <Home size={20} />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 grayscale"
        >
          {/* Subtle decoration */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full" />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default UnderConstruction;
