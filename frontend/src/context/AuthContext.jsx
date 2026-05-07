import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore user from localStorage on mount and verify
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authService.verify()
                .then(res => {
                    const data = res.data;
                    const verifiedUser = {
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        avatarUrl: data.avatarUrl,
                        department: data.department,
                        joined: data.joined || data.joinedAt
                    };
                    setUser(verifiedUser);
                    localStorage.setItem('user', JSON.stringify(verifiedUser));
                })
                .catch(err => {
                    console.error('Session verification failed:', err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const updateUser = (data) => {
        setUser(prev => ({ ...prev, ...data }));
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            const data = response.data;
            
            localStorage.setItem('token', data.token);
            const loggedInUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatarUrl: data.avatarUrl,
                department: data.department,
                joined: data.joinedAt
            };
            
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            navigate('/dashboard');
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
            
            localStorage.setItem('token', data.token);
            const loggedInUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatarUrl: data.avatarUrl,
                department: data.department,
                joined: data.joinedAt
            };
            
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            navigate('/admin/dashboard');
            return loggedInUser;
        } catch (err) {
            const errorMsg = err.message || err.response?.data?.message || 'Admin login failed';
            toast.error(errorMsg);
            throw err;
        }
    };

    const register = async (fullName, email, password, department) => {
        try {
            const response = await authService.register({ name: fullName, email, password, department });
            const data = response.data;
            
            localStorage.setItem('token', data.token);
            const registeredUser = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatarUrl: data.avatarUrl,
                department: data.department,
                joined: data.joinedAt
            };
            
            localStorage.setItem('user', JSON.stringify(registeredUser));
            setUser(registeredUser);
            navigate('/dashboard');
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
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
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
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, avatarUrl };
            localStorage.setItem('user', JSON.stringify(updatedUser));
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, loginAdmin, register, logout, updateUser, updateProfile, uploadAvatar, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

/* Note: useAuth hook has been moved to src/hooks/useAuth.js for HMR compatibility. */
