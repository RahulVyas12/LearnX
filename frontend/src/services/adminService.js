import api from '../api/axiosInstance';

const adminService = {
    // Dashboard Stats
    getAdminStats: () => api.get('/admin/stats'),

    // User Management
    getAllUsers: () => api.get('/users'),
    updateUserRole: (userId, role) => api.put(`/users/${userId}/role`, { role }),
    updateUser: (userId, data) => api.put(`/users/${userId}`, data),
    deleteUser: (userId) => api.delete(`/users/${userId}`),
    inviteUser: (data) => api.post('/admin/invite', data),

    // Skill Path Management
    getAllSkillPaths: () => api.get('/skillpaths/admin/all'),
    getSkillPathById: (id) => api.get(`/skillpaths/${id}`),
    createSkillPath: (data) => api.post('/skillpaths', data),
    updateSkillPath: (id, data) => api.put(`/skillpaths/${id}`, data),
    deleteSkillPath: (id) => api.delete(`/skillpaths/${id}`),

    // Level Management
    getLevels: (skillPathId) => api.get(`/levels/${skillPathId}`),
    createLevel: (data) => api.post('/levels', data),
    updateLevel: (id, data) => api.put(`/levels/${id}`, data),
    deleteLevel: (id) => api.delete(`/levels/${id}`),

    // Module Management
    getModules: (levelId) => api.get(`/modules/${levelId}`),
    getModuleDetail: (moduleId) => api.get(`/modules/detail/${moduleId}`),
    createModule: (data) => api.post('/modules', data),
    updateModule: (id, data) => api.put(`/modules/${id}`, data),
    deleteModule: (id) => api.delete(`/modules/${id}`),

    // Question Management
    getQuestionsByModule: (moduleId) => api.get(`/questions/module/${moduleId}`),
    getQuestionsByLevel: (levelId) => api.get(`/questions/mastery/${levelId}`),
    createQuestion: (data) => api.post('/questions', data),
    updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
    deleteQuestion: (id) => api.delete(`/questions/${id}`),

    // Level Mastery Test Management
    getMasteryTestByLevel: (levelId) => api.get(`/levelmasterytests/${levelId}`),
    createMasteryTest: (data) => api.post('/levelmasterytests', data),
    updateMasteryTest: (id, data) => api.put(`/levelmasterytests/${id}`, data),
    deleteMasteryTest: (id) => api.delete(`/levelmasterytests/${id}`),

    // Announcements
    getAnnouncements: () => api.get('/announcements'),
    createAnnouncement: (data) => api.post('/announcements', data),
    deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
    
    // Uploads
    uploadSkillPathImage: (id, formData) => api.post(`/uploads/skillpath/${id}`, formData)
};

export default adminService;
