import api from './axiosInstance';

export const authApi = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
    verify: () => api.get('/auth/me'),
};
