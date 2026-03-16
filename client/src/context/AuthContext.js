import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe, logout as apiLogout } from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const queryClient = useQueryClient();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (storedToken && storedRefreshToken) {
            setToken(storedToken);
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await getMe();
            setUser(data);
        } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setToken(null);
            setUser(null);
            queryClient.clear();
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const { data } = await apiRegister(userData);

            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            setToken(data.accessToken);
            setUser(data.user);

            return { success: true };
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            return { success: false, error: err.response?.data?.error };
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const { data } = await apiLogin(credentials);

            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            setToken(data.accessToken);
            setUser(data.user);

            return { success: true };
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            return { success: false, error: err.response?.data?.error };
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await apiLogout(refreshToken);
            }
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setToken(null);
            setUser(null);
            queryClient.clear();
        }
    };

    const value = {
        user,
        token,
        loading,
        error,
        register,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};