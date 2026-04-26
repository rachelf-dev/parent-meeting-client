// src/features/setup-meeting/services/setupService.ts
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import api from '../../api/axiosInstance';

export const downloadTemplate = async () => {
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

    worksheet.addRow(['רחל', 'כהן', '328369350', "א'1", 'מיכל לוי', '21372966', 'אסתר כהן', 'e0583215063@gmail.com']);
    
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3498DB' } };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'School_Template.xlsx');
};

export const uploadExcelFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // שליחה לנתיב המעודכן ב-C#
    return api.post('/School/import-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};