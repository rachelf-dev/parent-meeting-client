import api from '../../api/axiosInstance';

export const schoolService = {
  // פונקציה שמביאה את הסטטוס הנוכחי של בית הספר
  getSchoolStatus: async (schoolId: string) => {
    try {
      // אנחנו שולחים בקשת GET לשרת עם ה-ID של בית הספר
      // השרת אמור להחזיר אובייקט שמכיל את כמות התלמידים והאם יש פגישה
      const response = await api.get(`/School/${schoolId}/status`);
      
      // המבנה שהשרת מחזיר אמור להיות משהו כזה:
      // { studentCount: 10, hasActiveMeeting: true }
      return response.data; 
    } catch (error) {
      console.error("Error fetching school status:", error);
      throw error;
    }
  }
};