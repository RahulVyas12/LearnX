import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ requiredRole }) => {
    const { user, loading } = useAuth();

    console.log('ProtectedRoute - User:', user, 'Required Role:', requiredRole, 'Loading:', loading);

    // Still verifying session — don't redirect yet
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-500">Loading...</span>
                </div>
            </div>
        );
    }

    // Not logged in → redirect to appropriate login page
    if (!user) {
        console.log('ProtectedRoute - No user, redirecting to login');
        if (requiredRole === 'admin') {
            return <Navigate to="/admin/login" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role → redirect to their own dashboard
    if (requiredRole && user.role !== requiredRole) {
        console.log('ProtectedRoute - Role mismatch. User role:', user.role, 'Required:', requiredRole);
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    console.log('ProtectedRoute - All good, rendering Outlet');
    return <Outlet />;
};

export default ProtectedRoute;
