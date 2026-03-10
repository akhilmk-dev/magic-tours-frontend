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
            router.replace('/'); // Redirect to home so the protected page doesn't break
        }
    }, [user, loading, router, openAuthModal]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return children;
};
