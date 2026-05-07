import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to load user list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'student' : 'admin';
        try {
            await adminService.updateUserRole(userId, newRole);
            toast.success(`User role updated to ${newRole}`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user role');
        }
    };

    const filteredUsers = users.filter(user => {
        const nameMatch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
        const emailMatch = user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
        const matchesSearch = nameMatch || emailMatch;
        const matchesRole = roleFilter === 'All' || user.role?.toLowerCase() === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Access Control & Users</h1>
                <p className="text-slate-500 font-medium mt-1">Manage permissions, monitor student progress, and audit accounts.</p>
            </div>

            {/* Filters Bar */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium" 
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Admin', 'Student'].map(role => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${roleFilter === role ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            {role}s
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex py-20 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200/60">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Identity</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Access Level</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Engagement</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm border border-indigo-200">
                                                    {(u.name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{u.name || 'Unknown User'}</div>
                                                    <div className="text-slate-400 text-xs font-medium">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[11px] font-black rounded-lg uppercase tracking-wider ${u.role?.toLowerCase() === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                    {u.enrollmentCount || 0} Enrollments
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                    {u.completedModules || 0} Lessons Finished
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                            {u.joinedDate ? new Date(u.joinedDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleUpdateRole(u.id, u.role)}
                                                className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                {u.role?.toLowerCase() === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            No users matched your query.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
