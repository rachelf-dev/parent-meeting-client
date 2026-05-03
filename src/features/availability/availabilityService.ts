import api from '../../api/axiosInstance'; 

export const availabilityService = {
  // שמירת אילוץ זמינות בודד
  addParentAvailability: async (payload: any) => {
    // שליחת הנתונים לכתובת ה-POST כפי שמופיעה ב-Swagger
    return await api.post('/ParentAvailability', payload);
  },

  // הפעלת אלגוריתם השיבוץ הסופי
  generateFinalSchedule: async () => {
    // שליחת בקשה לנתיב ה-Scheduling
    return await api.post('/Scheduling/generate');
  }
};