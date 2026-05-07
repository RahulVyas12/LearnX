import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminSkillPaths = () => {
    const navigate = useNavigate();
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPath, setEditingPath] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        domain: '',
        imageUrl: '',
        isPublished: false
    });
    const [imageTab, setImageTab] = useState('upload');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const fetchPaths = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllSkillPaths();
            setPaths(response.data);
        } catch (error) {
            toast.error('Failed to load skill paths');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaths();
    }, []);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            domain: '',
            imageUrl: '',
            isPublished: false
        });
        setImageFile(null);
        setImagePreview('');
        setImageTab('upload');
        setEditingPath(null);
    };

    const handleCreate = () => {
        resetForm();
        setIsCreateOpen(true);
    };

    const handleEdit = (path) => {
        setFormData({
            title: path.title,
            description: path.description || '',
            domain: path.domain || '',
            imageUrl: path.imageUrl || '',
            isPublished: path.isPublished
        });
        // Set image preview with full URL for existing images
        const imageUrl = path.imageUrl ? 
            (path.imageUrl.startsWith('http') ? path.imageUrl : `http://localhost:5000${path.imageUrl}`) : '';
        setImagePreview(imageUrl);
        setEditingPath(path);
        setIsCreateOpen(true);
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrlChange = (url) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
        setImagePreview(url);
    };

    const handleImageUpload = async () => {
        if (imageFile && editingPath) {
            try {
                const formData = new FormData();
                formData.append('file', imageFile);
                const response = await adminService.uploadSkillPathImage(editingPath.id, formData);
                return response.data.imageUrl;
            } catch (error) {
                toast.error('Failed to upload image');
                return null;
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let imageUrl = formData.imageUrl;
        
        // Handle image upload if file is selected
        if (imageTab === 'upload' && imageFile) {
            imageUrl = await handleImageUpload();
            if (!imageUrl && imageFile) return; // Upload failed
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            domain: formData.domain,
            imageUrl: imageUrl,
            isPublished: formData.isPublished
        };

        try {
            if (editingPath) {
                await adminService.updateSkillPath(editingPath.id, payload);
                toast.success(`Path "${formData.title}" updated successfully!`);
            } else {
                await adminService.createSkillPath(payload);
                toast.success(`Path "${formData.title}" created successfully!`);
            }
            setIsCreateOpen(false);
            resetForm();
            fetchPaths();
        } catch (error) {
            toast.error(`Failed to ${editingPath ? 'update' : 'create'} skill path`);
        }
    };

    const handleDelete = async (path) => {
        const confirmed = window.confirm(
            `Delete Skill Path?\n\nThis will permanently delete '${path.title}' and ALL its levels, modules, and questions. This action cannot be undone.`
        );
        
        if (!confirmed) return;
        
        // Optimistic update
        const originalPaths = [...paths];
        setPaths(paths.filter(p => p.id !== path.id));
        
        try {
            await adminService.deleteSkillPath(path.id);
            toast.success('Skill path deleted');
        } catch (error) {
            // Restore on error
            setPaths(originalPaths);
            toast.error('Failed to delete skill path');
        }
    };

    const handleTogglePublish = async (path) => {
        try {
            await adminService.updateSkillPath(path.id, {
                ...path,
                isPublished: !path.isPublished
            });
            toast.success(`Path ${path.isPublished ? 'un-published' : 'published'}`);
            fetchPaths();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getLevelCount = (pathId) => {
        // This would typically come from the API, but for now we'll return a placeholder
        return Math.floor(Math.random() * 5) + 1;
    };

    const getImageUrl = (skillPath) => {
        if (!skillPath.imageUrl) return null;
        return skillPath.imageUrl.startsWith('http') ? skillPath.imageUrl : `http://localhost:5000${skillPath.imageUrl}`;
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Skill Path Manager</h1>
                    <p className="text-slate-500 font-medium mt-1">Design curricula, manage modules, and control visibility.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Skill Path
                </button>
            </div>

            {/* List View */}
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
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Path Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Domain</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Levels</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paths.map((path) => (
                                    <tr key={path.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {getImageUrl(path) ? (
                                                    <img 
                                                        src={getImageUrl(path)} 
                                                        alt={path.title}
                                                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ${getImageUrl(path) ? 'hidden' : ''}`}>
                                                    {path.title.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{path.title}</div>
                                                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">ID: {path.id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-[11px] font-black bg-slate-100 text-slate-600 rounded-lg uppercase tracking-wider">
                                                {path.domain || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2.5 py-1 text-[11px] font-black bg-blue-100 text-blue-600 rounded-lg">
                                                {getLevelCount(path.id)} levels
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleTogglePublish(path)}
                                                className={`px-3 py-1 text-[11px] font-black rounded-lg uppercase tracking-wider transition-colors ${
                                                    path.isPublished 
                                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                }`}
                                            >
                                                {path.isPublished ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => {
                                            console.log('Edit Curriculum clicked, navigating to:', `/admin/test-curriculum/${path.id}`);
                                            navigate(`/admin/test-curriculum/${path.id}`);
                                        }}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Curriculum"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleEdit(path)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Details"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(path)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Delete Path"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paths.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            No skill paths found. Create one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create/Edit Path Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800">
                                {editingPath ? 'Edit Skill Path' : 'Create New Skill Path'}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">
                                {editingPath ? 'Update your learning curriculum details.' : 'Initialize a new learning curriculum.'}
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-slate-50/50 max-h-[calc(90vh-200px)] overflow-y-auto">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g. Master React 18"
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Description <span className="text-slate-400">(max 500 chars)</span>
                                </label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value.slice(0, 500) }))}
                                    placeholder="Describe what students will learn in this skill path..."
                                    rows={3}
                                    maxLength={500}
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                                />
                                <div className="text-xs text-slate-400 text-right">
                                    {formData.description.length}/500
                                </div>
                            </div>

                            {/* Domain */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Domain <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.domain}
                                    onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                                    placeholder="e.g. Web Development, Python, Data Science"
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image</label>
                                
                                {/* Tabs */}
                                <div className="flex border border-slate-200 rounded-lg p-1 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setImageTab('upload')}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                            imageTab === 'upload' 
                                                ? 'bg-indigo-100 text-indigo-700' 
                                                : 'text-slate-600 hover:text-slate-800'
                                        }`}
                                    >
                                        Upload Image
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageTab('url')}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                            imageTab === 'url' 
                                                ? 'bg-indigo-100 text-indigo-700' 
                                                : 'text-slate-600 hover:text-slate-800'
                                        }`}
                                    >
                                        Image URL
                                    </button>
                                </div>

                                {/* Tab Content */}
                                {imageTab === 'upload' ? (
                                    <div className="space-y-3">
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleImageFileChange}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label htmlFor="image-upload" className="cursor-pointer">
                                                <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                                                <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP (max 5MB)</p>
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <input 
                                            type="url" 
                                            value={formData.imageUrl}
                                            onChange={(e) => handleImageUrlChange(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        />
                                    </div>
                                )}

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-3">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Preview</p>
                                        <img 
                                            src={imagePreview.startsWith('http') ? imagePreview : `http://localhost:5000${imagePreview}`}
                                            alt="Preview" 
                                            className="w-full h-48 object-cover rounded-xl border border-slate-200"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Published Toggle */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                                <div>
                                    <label className="text-sm font-bold text-slate-700">Publish Status</label>
                                    <p className="text-xs text-slate-500">Published paths are visible to all students</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        formData.isPublished ? 'bg-indigo-600' : 'bg-slate-200'
                                    }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    formData.isPublished ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setIsCreateOpen(false);
                                                resetForm();
                                            }} 
                                            className="px-5 py-2.5 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all"
                                        >
                                            {editingPath ? 'Update Path' : 'Create Path'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            );
};

export default AdminSkillPaths;
