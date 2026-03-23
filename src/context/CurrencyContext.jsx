"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState({ code: 'QAR', symbol: 'QAR', qar_rate: 1, name: 'Qatari Riyal' });
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const resp = await api.get('/currencies');
                const data = resp.data || resp;
                
                // Ensure QAR is the base and always present
                const baseCurrency = { code: 'QAR', symbol: 'QAR', qar_rate: 1, name: 'Qatari Riyal' };
                
                // Map API data (handling aed_rate fallback to qar_rate if needed)
                const mappedCurrencies = data.map(c => ({
                    ...c,
                    qar_rate: c.qar_rate || c.aed_rate || 1 // Use aed_rate if qar_rate is missing from API
                }));

                const finalCurrencies = [
                    baseCurrency,
                    ...mappedCurrencies.filter(c => c.code !== 'QAR')
                ];
                
                setCurrencies(finalCurrencies);
                
                // Load from localStorage if exists
                const stored = localStorage.getItem('selectedCurrency');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    // Refresh the rate from the latest API data if possible
                    const updated = finalCurrencies.find(c => c.code === parsed.code) || parsed;
                    setSelectedCurrency(updated);
                }
            } catch (err) {
                console.error("Failed to fetch currencies:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrencies();
    }, []);

    const changeCurrency = useCallback((currency) => {
        setSelectedCurrency(currency);
        localStorage.setItem('selectedCurrency', JSON.stringify(currency));
    }, []);

    const convertPrice = useCallback((priceInBase) => {
        if (!selectedCurrency || selectedCurrency.code === 'QAR') return priceInBase;
        const rate = selectedCurrency.qar_rate || 1;
        return (priceInBase / rate).toFixed(2);
    }, [selectedCurrency]);

    const formatPrice = useCallback((priceInBase) => {
        const converted = convertPrice(priceInBase);
        const symbol = selectedCurrency?.symbol || selectedCurrency?.code || 'QAR';
        return `${symbol} ${Number(converted).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }, [convertPrice, selectedCurrency]);

    return (
        <CurrencyContext.Provider value={{ 
            selectedCurrency, 
            currencies, 
            changeCurrency, 
            convertPrice, 
            formatPrice,
            loading 
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
