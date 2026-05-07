import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getAdminStats();
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Students', value: stats?.totalUsers?.toLocaleString() || '0', trend: '+12%', color: 'from-blue-500 to-blue-600' },
        { label: 'Active Paths', value: stats?.totalSkillPaths || '0', trend: 'Stable', color: 'from-purple-500 to-purple-600' },
        { label: 'Certificates', value: stats?.totalCertificates || '0', trend: '+5%', color: 'from-emerald-500 to-emerald-600' },
        { label: 'Announcements', value: stats?.totalAnnouncements || '0', trend: 'Live', color: 'from-slate-700 to-slate-800' }
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Welcome back, {user?.name || 'Admin'}!</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg overflow-hidden relative transition-transform hover:scale-[1.02]`}>
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl font-bold"></div>
                        <p className="text-white/80 font-bold tracking-wider text-xs uppercase mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black mb-2">{stat.value}</h3>
                        <p className="text-white/60 text-xs font-semibold">{stat.trend}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 min-h-[400px]">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Platform Overview</h2>
                <div className="flex items-center justify-center h-64 text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-xl">
                    Detailed Activity Metrics Coming Soon
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
