import api from '../../api/axiosInstance';

type Data = {
  name: string;
  password: string;
}

export const authService = {
  login: async (data: Data) => {
    const response = await api.post('/School/login', data);
    return response.data;
  },
  register: async (data: Data) => {
    const response = await api.post('/School/register', data);
    return response.data;
  }
};