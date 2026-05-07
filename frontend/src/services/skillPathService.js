import api from '../api/axiosInstance';

export const skillPathService = {
    getAll: () => api.get('/skillpaths'),
    getById: (id) => api.get(`/skillpaths/${id}`),
    getLevels: (pathId) => api.get(`/levels/${pathId}`),
    getLevelsWithModules: (pathId) => api.get(`/levels/path/${pathId}/details`),
    getModulesByLevel: (levelId) => api.get(`/modules/${levelId}`),
    getModuleDetail: (moduleId) => api.get(`/modules/detail/${moduleId}`),
};

export default skillPathService;
