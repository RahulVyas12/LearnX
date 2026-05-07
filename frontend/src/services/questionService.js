import api from '../api/axiosInstance';

export const questionService = {
  getQuestionsByModule: (moduleId) => api.get(`/questions/${moduleId}`),
  getMasteryQuestions: (levelId) => api.get(`/questions/mastery/${levelId}`),
  getPracticeQuestions: (skillPathId) => api.get(`/questions/practice/${skillPathId}`),
};

export default questionService;
