import api from '../../api/axiosInstance';

export const authService = {
  login: async (data: any) => {
    const response = await api.post('/School/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/School/register', data);
    return response.data;
  }
};