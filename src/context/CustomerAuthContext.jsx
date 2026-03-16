"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../api/client';

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login'); // 'login' or 'register'

    const openAuthModal = useCallback((view = 'login') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => {
        setIsAuthModalOpen(false);
    }, []);

    const fetchFavorites = useCallback(async () => {
        if (!user) return;
        setLoadingFavorites(true);
        try {
            const response = await api.get('/customers/favorites/');
            // Expecting data to be an array of packages or IDs
            const favIds = (response.data || response || []).map(p => p.id || p.package_id || p);
            setFavorites(favIds);
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        } finally {
            setLoadingFavorites(false);
        }
    }, [user]);

    const toggleFavorite = useCallback(async (packageId) => {
        if (!user) {
            openAuthModal('login');
            return;
        }

        const isFavorited = favorites.includes(packageId);
        
        // Optimistic update
        setFavorites(prev => 
            isFavorited ? prev.filter(id => id !== packageId) : [...prev, packageId]
        );

        try {
            if (isFavorited) {
                // If the API supports toggle or specific delete
                await api.delete(`/customers/favorites/${packageId}`);
            } else {
                await api.post('/customers/favorites/', { package_id: packageId });
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            // Rollback on error
            setFavorites(prev => 
                isFavorited ? [...prev, packageId] : prev.filter(id => id !== packageId)
            );
        }
    }, [user, favorites, openAuthModal]);

    useEffect(() => {
        // align with api/client.js which clears 'user' on logout
        const storedUser = localStorage.getItem('user');

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

    useEffect(() => {
        if (user) {
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [user, fetchFavorites]);

    const login = useCallback(async (email, password) => {
        try {
            const response = await api.post('/customers/login', { email, password });
            const { user, accessToken, refreshToken } = response.data || response;

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));

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
    }, []);

    const register = useCallback(async (userData) => {
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
    }, []);

    const logout = useCallback(async () => {
        if (api.logout) {
            await api.logout();
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        setUser(null);
    }, []);

    return (
        <CustomerAuthContext.Provider value={{
            user, login, register, logout, loading,
            favorites, loadingFavorites, toggleFavorite,
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
    const { user, loading, isAuthModalOpen, openAuthModal } = useCustomerAuth();
    const router = useRouter();
    const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            if (!isAuthModalOpen && !hasAttemptedAuth) {
                openAuthModal('login');
                setHasAttemptedAuth(true); // Mark that we've prompted them
            } else if (!isAuthModalOpen && hasAttemptedAuth) {
                // If they closed the modal without logging in, send them to home
                router.push('/');
            }
        }
    }, [user, loading, isAuthModalOpen, hasAttemptedAuth, openAuthModal, router]);

    // Show a blank loading screen while evaluating or bouncing back to home
    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return children;
};
