import api from '../../api/axiosInstance';

export const dashboardService = {
  getSchoolStatus: async () => {
    return api.get('/School/status');
  }
};