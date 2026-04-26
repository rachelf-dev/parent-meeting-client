import api from '../../api/axiosInstance'; 
import type { Parent } from './parent.types';

export const getParents = async (): Promise<Parent[]> => {
  const response = await api.get<Parent[]>('/Parent'); 
  return response.data;
};