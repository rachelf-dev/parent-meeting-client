// src/features/setup-meeting/setupService.ts
import api from '../../api/axiosInstance';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';

export const setupService = {
  downloadTemplate: async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');
    
    worksheet.columns = [
        { header: 'שם פרטי', key: 'firstName', width: 15 },
        { header: 'שם משפחה', key: 'lastName', width: 15 },
        { header: 'ת"ז', key: 'id', width: 15 },
        { header: 'כיתה', key: 'class', width: 10 },
        { header: 'מורה', key: 'teacher', width: 15 },
        { header: 'ת"ז הורה', key: 'parentId', width: 15 },
        { header: 'שם הורה', key: 'parentName', width: 15 },
        { header: 'מייל', key: 'email', width: 25 },
    ];

    // הוספת שורת דוגמה
    worksheet.addRow(['ישראל', 'ישראלי', '123456789', "א1", 'מיכאל לוי', '987654321', 'אברהם ישראלי', 'test@gmail.com']);

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'School_Template.xlsx');
  },

  // העלאת קובץ האקסל לשרת
  uploadExcelFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/School/import-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // שמירת פרטי הפגישה (תאריך, שעות ומשך פגישה)
  saveMeetingDetails: async (data: any) => {
    // בניית האובייקט בדיוק כפי ש-C# מצפה לקבל ב-MeetingSetupDto
    const payload = {
      Date: data.date,                         // פורמט YYYY-MM-DD
      StartTime: data.startTime + ":00",       // הוספת שניות עבור TimeSpan
      EndTime: data.endTime + ":00",           // הוספת שניות עבור TimeSpan
      Duration: Number(data.duration)          // המרה למספר (Integer)
    };

    console.log("Sending payload to server:", payload);
    return api.post('/School/setup-meeting', payload);
  }
};