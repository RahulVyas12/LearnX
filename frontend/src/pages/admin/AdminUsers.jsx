import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    
    // Edit Modal State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        department: ''
    });

    // Add Modal State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: ''
    });

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

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'student',
            department: user.department || ''
        });
        setIsEditOpen(true);
    };

    const handleDelete = async (user) => {
        const confirmed = window.confirm(
            `Permanently remove user?\n\nThis will delete '${user.name}' (${user.email}) and all their progress data. This action cannot be undone.`
        );
        
        if (!confirmed) return;
        
        // Optimistic update
        const originalUsers = [...users];
        setUsers(users.filter(u => u.id !== user.id));
        
        try {
            await adminService.deleteUser(user.id);
            toast.success('User permanently removed');
        } catch (error) {
            setUsers(originalUsers);
            toast.error('Failed to remove user');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await adminService.updateUser(editingUser.id, formData);
            toast.success('User details updated');
            setIsEditOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await adminService.inviteUser(addFormData);
            toast.success('User added successfully');
            setIsAddOpen(false);
            setAddFormData({ name: '', email: '', password: '', role: 'student', department: '' });
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add user');
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Access Control & Users</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage permissions, monitor student progress, and audit accounts.</p>
                </div>
                <button 
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Student
                </button>
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
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
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
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(u)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit User"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(u)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
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

            {/* Edit User Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800">Edit User Details</h3>
                            <p className="text-sm text-slate-500 font-medium">Update profile information and access level.</p>
                        </div>
                        
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4 bg-slate-50/50">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                <input 
                                    required
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
                                    <select 
                                        value={formData.role}
                                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-xs uppercase"
                                    >
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                                    <input 
                                        type="text" 
                                        value={formData.department}
                                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200/60">
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditOpen(false)} 
                                    className="px-5 py-2.5 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800">Add New User</h3>
                            <p className="text-sm text-slate-500 font-medium">Create a new account manually.</p>
                        </div>
                        
                        <form onSubmit={handleAddUser} className="p-6 space-y-4 bg-slate-50/50">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    value={addFormData.name}
                                    onChange={(e) => setAddFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter full name"
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                    <input 
                                        required
                                        type="email" 
                                        value={addFormData.email}
                                        onChange={(e) => setAddFormData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="user@example.com"
                                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                                    <input 
                                        required
                                        type="password" 
                                        value={addFormData.password}
                                        onChange={(e) => setAddFormData(prev => ({ ...prev, password: e.target.value }))}
                                        placeholder="Min. 6 chars"
                                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
                                    <select 
                                        value={addFormData.role}
                                        onChange={(e) => setAddFormData(prev => ({ ...prev, role: e.target.value }))}
                                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-xs uppercase"
                                    >
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                                    <input 
                                        type="text" 
                                        value={addFormData.department}
                                        onChange={(e) => setAddFormData(prev => ({ ...prev, department: e.target.value }))}
                                        placeholder="Optional"
                                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200/60">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddOpen(false)} 
                                    className="px-5 py-2.5 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
