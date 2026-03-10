"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../api/client';

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login'); // 'login' or 'register'

    useEffect(() => {
        // align with api/client.js which clears 'user' on logout
        const storedUser = localStorage.getItem('user');

        // We don't need to manually check tokens here because api/client.js 
        // initializes itself from localStorage. 
        // If the token is invalid, the first API call will trigger logout().

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/customers/login', { email, password });
            // API returns { user, accessToken, refreshToken }
            const { user, accessToken, refreshToken } = response.data || response;

            // Update user state
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));

            // Delegate token storage to API client
            if (api.setTokens) {
                api.setTokens(accessToken, refreshToken);
            } else {
                console.warn('API client missing setTokens method');
            }

            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            await api.post('/customers/register', userData);
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Registration failed'
            };
        }
    };

    const openAuthModal = (view = 'login') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const logout = async () => {
        // Use API client's logout to hit server endpoint and clear all keys
        if (api.logout) {
            await api.logout();
        } else {
            // Fallback if client method missing
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        setUser(null);
    };

    return (
        <CustomerAuthContext.Provider value={{
            user, login, register, logout, loading,
            isAuthModalOpen, authModalView, openAuthModal, closeAuthModal
        }}>
            {children}
        </CustomerAuthContext.Provider>
    );
};

export const useCustomerAuth = () => {
    const context = useContext(CustomerAuthContext);
    if (!context) {
        throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
    }
    return context;
};

export const ProtectedRoute = ({ children }) => {
    const { user, loading, openAuthModal } = useCustomerAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            openAuthModal('login');
        }
    }, [user, loading, openAuthModal]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 pt-20">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-secondary">Authentication Required</h2>
                <p className="text-gray-500 max-w-md text-center">You need to be logged in to view this page. Please sign in to continue.</p>
                <div className="flex gap-3 mt-4">
                    <button onClick={() => openAuthModal('login')} className="px-6 py-2.5 bg-primary hover:bg-primary-dark transition-colors text-white rounded-xl font-bold text-sm">
                        Sign In
                    </button>
                    <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 rounded-xl font-bold text-sm">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return children;
};
