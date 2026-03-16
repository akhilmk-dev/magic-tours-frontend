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
            const response = await api.get('/customers/favorites');
            let data = response.data || response;
            
            // Safer array extraction (consistent with ProfilePage)
            if (!Array.isArray(data) && typeof data === 'object') {
                const arrayProp = Object.values(data).find(Array.isArray);
                if (arrayProp) data = arrayProp;
            }

            if (Array.isArray(data)) {
                // Extract IDs carefully. Check for p.package_id, p.id, or p itself.
                // If it's a join object, p.package_id is often the correct pointer.
                const favIds = data.map(p => {
                    const id = p.package_id || p.id || (typeof p === 'string' || typeof p === 'number' ? p : null);
                    return id ? String(id) : null;
                }).filter(id => id !== null);
                
                // Only update if we actually got valid IDs or if the response was an empty array (meaning intentional clear)
                setFavorites(favIds);
                // Also update localStorage immediately for consistency
                localStorage.setItem('favorites', JSON.stringify(favIds));
            }
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
            // On error, let the localStorage version persist
        } finally {
            setLoadingFavorites(false);
        }
    }, [user]);

    const toggleFavorite = useCallback(async (packageId) => {
        if (!user) {
            openAuthModal('login');
            return;
        }

        const pid = String(packageId);
        const isFavorited = favorites.includes(pid);
        
        // Optimistic update
        setFavorites(prev => 
            isFavorited ? prev.filter(id => id !== pid) : [...prev, pid]
        );

        try {
            if (isFavorited) {
                await api.delete(`/customers/favorites/${packageId}`);
            } else {
                await api.post(`/customers/favorites/${packageId}`);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            // Rollback on error
            setFavorites(prev => 
                isFavorited ? [...prev, pid] : prev.filter(id => id !== pid)
            );
        }
    }, [user, favorites, openAuthModal]);

    useEffect(() => {
        // align with api/client.js which clears 'user' on logout
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                // Also load persisted favorites
                const storedFavs = localStorage.getItem('favorites');
                if (storedFavs) {
                    setFavorites(JSON.parse(storedFavs));
                }
            } catch (e) {
                console.error("Failed to parse stored auth data", e);
                localStorage.removeItem('user');
                localStorage.removeItem('favorites');
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            // Only sync if we have something or after loading is finished to avoid clearing on mount
            if (favorites.length > 0 || !loadingFavorites) {
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        } else {
            localStorage.removeItem('favorites');
        }
    }, [favorites, user, loadingFavorites]);

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

    const forgotPassword = useCallback(async (email) => {
        try {
            await api.post('/customers/forgot-password', { email });
            return { success: true };
        } catch (error) {
            console.error('Forgot password failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to send OTP'
            };
        }
    }, []);

    const verifyOtp = useCallback(async (email, otp) => {
        try {
            await api.post('/customers/verify-otp', { email, otp });
            return { success: true };
        } catch (error) {
            console.error('OTP verification failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Invalid OTP'
            };
        }
    }, []);

    const resetPassword = useCallback(async (payload) => {
        try {
            await api.post('/customers/reset-password', payload);
            return { success: true };
        } catch (error) {
            console.error('Password reset failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to reset password'
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
        setFavorites([]);
        localStorage.removeItem('favorites');
        openAuthModal('login');
    }, [openAuthModal]);

    return (
        <CustomerAuthContext.Provider value={{
            user, login, register, logout, loading,
            favorites, loadingFavorites, toggleFavorite,
            isAuthModalOpen, authModalView, openAuthModal, closeAuthModal,
            forgotPassword, verifyOtp, resetPassword
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
