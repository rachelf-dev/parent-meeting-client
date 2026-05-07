import api from '../../api/axiosInstance'; 

export interface ParentAvailability {
  id: number;
  parentId: number | null;
  parentIdentity: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  schoolId: number;
}

export const availabilityService = {
  // שמירת אילוץ זמינות בודד
  addParentAvailability: async (payload: any) => {
    return await api.post('/ParentAvailability', payload);
  },

  // קבלת כל האילוצים של בית הספר
  getAvailabilities: async (): Promise<ParentAvailability[]> => {
    const response = await api.get('/ParentAvailability');
    return response.data;
  },

  // מחיקת אילוץ
  deleteAvailability: async (id: number) => {
    return await api.delete(`/ParentAvailability/${id}`);
  },

  // הפעלת אלגוריתם השיבוץ
  generateFinalSchedule: async () => {
    return await api.post('/Scheduling/generate');
  }
};