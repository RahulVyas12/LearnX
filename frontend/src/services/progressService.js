import api from '../api/axiosInstance';

export const progressService = {
    getDashboard: () => api.get('/progress/dashboard'),
    getEnrolledPaths: () => api.get('/progress/enrolled'),
    getPathProgress: (pathId) => api.get(`/progress/path/${pathId}`),
    getLevelStatus: (pathId) => api.get(`/progress/levels/${pathId}`),
    markModuleAsRead: (moduleId) => api.post(`/progress/module/${moduleId}/read`),
    submitTest: (data) => api.post('/progress/test/submit', data),
    enroll: (pathId) => api.post(`/progress/enroll/${pathId}`),
    unenroll: (pathId) => api.delete(`/progress/unenroll/${pathId}`),
    getLevelUnlockStatus: (skillPathId) => api.get(`/progress/levels/unlock-status/${skillPathId}`),
};

export default progressService;
