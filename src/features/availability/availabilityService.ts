import api from '../../api/axiosInstance'; 

export const availabilityService = {
  // שמירת אילוץ זמינות בודד
  addParentAvailability: async (payload: any) => {
    // הכתובת כפי שמופיעה בצילום ה-Network שלך
    return await api.post('/ParentAvailability', payload);
  },

  // הפעלת אלגוריתם השיבוץ
  generateFinalSchedule: async () => {
    return await api.post('/Scheduling/generate');
  }
};