import api from '../api/axiosInstance';

export const certificateService = {
  getMyCertificates: () => api.get('/certificates/my'),
  claimCertificate: (skillPathId) => api.post(`/certificates/claim/${skillPathId}`),
};

export default certificateService;
