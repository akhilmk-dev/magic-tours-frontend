import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import logo from '../../assets/logo.png';
import aiIcon from '../../assets/humbleicons_ai.png';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! How can I help you today?' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Stack AI API Call
            // Updated to the standard inference endpoint
            const response = await fetch('https://api.stack-ai.com/inference/v0/run/abaa1861-519e-46da-80a7-0b1f4f763282/6971cf4085ed6086eb46f09b', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk__QKK9jPTZ-cSzj-QuBShzNvjQbxm5NWFl7P6DaQpPYI',
                },
                body: JSON.stringify({ "in-0": input }),
            });

            const data = await response.json();

            // Extract the message from the complex output structure
            let botResponse = data?.outputs?.['out-0'] || data?.outputs?.out_0 || data?.['out-0'] || data?.out_0 || data?.message || "I'm sorry, I couldn't process that.";

            // Clean up citations (e.g., [^48318.0.1])
            botResponse = botResponse.replace(/\[\^[\d.]+\]/g, '').trim();

            setMessages((prev) => [...prev, { role: 'bot', content: botResponse }]);
        } catch (error) {
            console.error('Stack AI Error:', error);
            setMessages((prev) => [...prev, { role: 'bot', content: 'Sorry, there was an error connecting to the agent.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[calc(100vw-2rem)] xs:w-[350px] sm:w-[450px] md:w-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[500px] sm:h-[600px] md:h-[650px] max-h-[70vh] sm:max-h-[80vh] md:max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-indigo-100 p-1.5 shadow-inner">
                                    <img src={aiIcon} alt="AI Assistant" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Magic Assistant</h3>
                                    <p className="text-xs text-indigo-100">Always active</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-indigo-500 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[90%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none whitespace-pre-wrap'
                                            : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.role === 'user' ? (
                                            msg.content
                                        ) : (
                                            <div className="prose prose-sm max-w-none prose-slate prose-p:my-0.5 prose-headings:mb-1 prose-headings:mt-3 first:prose-headings:mt-0">
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({ node, jsx, ...props }) => <h1 className="font-bold text-base" {...props} />,
                                                        h2: ({ node, jsx, ...props }) => <h2 className="font-bold text-sm underline" {...props} />,
                                                        h3: ({ node, jsx, ...props }) => <h3 className="font-bold text-xs uppercase tracking-wider" {...props} />,
                                                        li: ({ node, jsx, ...props }) => <li className="list-disc ml-4 mb-1" {...props} />,
                                                        ul: ({ node, jsx, ...props }) => <ul className="my-2" {...props} />,
                                                        strong: ({ node, jsx, ...props }) => <strong className="font-bold text-indigo-900" {...props} />
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white text-slate-700 shadow-sm border border-slate-100 rounded-2xl rounded-tl-none px-4 py-4">
                                        <div className="flex gap-1.5 items-center h-2">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{
                                                        y: [0, -4, 0],
                                                        opacity: [0.4, 1, 0.4]
                                                    }}
                                                    transition={{
                                                        duration: 1.2,
                                                        repeat: Infinity,
                                                        delay: i * 0.2,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-white border border-slate-200 text-indigo-600 rounded-full shadow-xl flex items-center justify-center hover:bg-slate-50 transition-colors overflow-hidden p-3"
            >
                {isOpen ? (
                    <X size={28} />
                ) : (
                    <img src={aiIcon} alt="AI Chat" className="w-full h-full object-contain" />
                )}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
