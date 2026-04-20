import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('learnx_token');
        const savedUser = localStorage.getItem('learnx_user');
        if (token && savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (e) {
                return null;
            }
        }
        return null; // Ensure Guest view is the default
    });
    const [loading, setLoading] = useState(true);

    // 1. Session Verification: Fetch fresh profile data in background
    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('learnx_token');

            if (token) {
                try {
                    const response = await authService.verify();
                    setUser(response.data);
                } catch (err) {
                    console.error('Session verification failed:', err);
                    localStorage.removeItem('learnx_user');
                    localStorage.removeItem('learnx_token');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        verifyAuth();
    }, []);

    // 2. Sync user state back to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('learnx_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('learnx_user');
        }
    }, [user]);

    const updateUser = (data) => {
        setUser(prev => ({ ...prev, ...data }));
    };
    const login = async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            const data = response.data;
            localStorage.setItem('learnx_token', data.token);
            const loggedInUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatarUrl: data.avatarUrl,
                department: data.department,
                joined: data.joinedAt
            };
            setUser(loggedInUser);
            return loggedInUser;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Login failed';
            toast.error(errorMsg);
            throw err;
        }
    };

    const loginAdmin = async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            const data = response.data;
            if (data.role !== 'admin') {
                throw new Error('Access denied. This account does not have admin privileges.');
            }
            localStorage.setItem('learnx_token', data.token);
            const loggedInUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatarUrl: data.avatarUrl,
                department: data.department,
                joined: data.joinedAt
            };
            setUser(loggedInUser);
            return loggedInUser;
        } catch (err) {
            const errorMsg = err.message || err.response?.data?.message || 'Admin login failed';
            toast.error(errorMsg);
            throw err;
        }
    };

    const register = async (fullName, email, password) => {
        try {
            const response = await authService.register({ name: fullName, email, password });
            const data = response.data;
            localStorage.setItem('learnx_token', data.token);
            const registeredUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatarUrl: data.avatarUrl,
                department: data.department,
                joined: data.joinedAt
            };
            setUser(registeredUser);
            return registeredUser;
        } catch (err) {
            console.error(err.response?.data);
            const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
            toast.error(errorMsg);
            throw err;
        }
    };

    const updateProfile = async (data) => {
        try {
            await authService.updateProfile(data);
            setUser(prev => ({ ...prev, ...data }));
            toast.success('Profile updated successfully');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to update profile';
            toast.error(errorMsg);
            throw err;
        }
    };

    const uploadAvatar = async (formData) => {
        try {
            const response = await authService.uploadAvatar(formData);
            const { avatarUrl } = response.data;
            setUser(prev => ({ ...prev, avatarUrl }));
            toast.success('Avatar updated successfully');
            return avatarUrl;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Avatar upload failed';
            toast.error(errorMsg);
            throw err;
        }
    };

    const isAuthenticated = !!user;

    const logout = () => {
        localStorage.removeItem('learnx_token');
        localStorage.removeItem('learnx_user');
        setUser(null);
        window.location.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, loginAdmin, register, logout, updateUser, updateProfile, uploadAvatar, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


/* Note: useAuth hook has been moved to src/hooks/useAuth.js for HMR compatibility. */
