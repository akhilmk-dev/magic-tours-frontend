"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../api/client';
import { useToast } from './ToastContext';

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [favoriteIdsMap, setFavoriteIdsMap] = useState({}); // packageId -> favoriteId
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login');
    const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
    const { success: toastSuccess } = useToast();
    const router = useRouter();

    const openAuthModal = useCallback((view = 'login') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => {
        setIsAuthModalOpen(false);
    }, []);

    const openProfileEditModal = useCallback(() => {
        setIsProfileEditModalOpen(true);
    }, []);

    const closeProfileEditModal = useCallback(() => {
        setIsProfileEditModalOpen(false);
    }, []);

    const updateUser = useCallback((newData) => {
        setUser(prev => {
            if (!prev) return newData;
            
            // Check if anything actually changed to avoid infinite re-render loops
            const isDifferent = Object.keys(newData).some(key => 
                newData[key] !== undefined && newData[key] !== prev[key]
            );

            if (!isDifferent) return prev;

            const updated = { ...prev, ...newData };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const fetchProfile = useCallback(async () => {
        // Use a stored version of the user ID or check the token directly via api client
        // to avoid dependency on the 'user' object itself which causes loops
        try {
            const response = await api.get('/customers/profile');
            const profileData = response.data || response;
            if (profileData && profileData.name) {
                // Update user state only, don't return a new user object if data is identical 
                // (though updateUser already does a functional update)
                updateUser(profileData);
            }
            return profileData;
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            return null;
        }
    }, [updateUser]); // Removed 'user' dependency to break the loop

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
                const favIds = [];
                const favMap = {};
                
                data.forEach(p => {
                    const packageId = p.package_id || (typeof p === 'object' ? p.id : (typeof p === 'string' || typeof p === 'number' ? p : null));
                    const favoriteId = p.id; // The unique ID for the favorite record
                    
                    if (packageId) {
                        const pidStr = String(packageId);
                        favIds.push(pidStr);
                        if (favoriteId) {
                            favMap[pidStr] = favoriteId;
                        }
                    }
                });
                
                setFavorites(favIds);
                setFavoriteIdsMap(favMap);
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
                const favoriteId = favoriteIdsMap[pid];
                // Use favorite ID if available, fallback to package ID if not (should not happen with sync)
                await api.delete(`/customers/favorites/${favoriteId || packageId}`);
                
                setFavoriteIdsMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[pid];
                    return newMap;
                });
            } else {
                const response = await api.post(`/customers/favorites/${packageId}`);
                const newFav = response.data || response;
                // If the API returns the new favorite record, store its ID
                if (newFav && newFav.id) {
                    setFavoriteIdsMap(prev => ({ ...prev, [pid]: newFav.id }));
                }
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            // Rollback on error
            setFavorites(prev => 
                isFavorited ? [...prev, pid] : prev.filter(id => id !== pid)
            );
            // Re-fetch to ensure sync if something went wrong
            fetchFavorites();
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
        toastSuccess("Logged out successfully");
        router.push('/login');
    }, [router, toastSuccess]);

    return (
        <CustomerAuthContext.Provider value={{
            user, login, register, logout, loading,
            favorites, loadingFavorites, toggleFavorite,
            isAuthModalOpen, authModalView, openAuthModal, closeAuthModal,
            isProfileEditModalOpen, openProfileEditModal, closeProfileEditModal,
            updateUser, fetchProfile,
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
    useEffect(() => {
        if (!loading && !user) {
            openAuthModal('login');
        }
    }, [user, loading, openAuthModal]);

    // Show a blank loading screen while evaluating or bouncing back to home
    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return children;
};
