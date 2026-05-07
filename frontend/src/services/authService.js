import api from '../api/axiosInstance';

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verify: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    uploadAvatar: (formData) => api.post('/auth/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default authService;
