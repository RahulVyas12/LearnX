import api from '../api/axiosInstance';

export const announcementService = {
    getAll: () => api.get('/announcements'),
    getLatest: () => api.get('/announcements/latest'),
};

export default announcementService;
