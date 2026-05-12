import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ParentMeetingDto } from './ExportPage';

export const exportToExcel = async (data: ParentMeetingDto[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('פגישות');

  // הגדרת עמודות חדשה עם שמות במקום IDs
  worksheet.columns = [
    { header: 'שם התלמיד', key: 'studentName', width: 20 },
    { header: 'שם ההורה', key: 'parentName', width: 20 },
    { header: 'מורה', key: 'teacherName', width: 20 },
    { header: 'כיתה', key: 'className', width: 10 },
    { header: 'התחלה', key: 'startTime', width: 15 },
    { header: 'סיום', key: 'endTime', width: 15 },
  ];

  worksheet.addRows(data);

  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};

export const exportToPDF = (data: ParentMeetingDto[], fileName: string, title: string) => {
  const doc = new jsPDF();
  doc.text(title, 10, 10);

  const tableRows = data.map(m => [
    m.studentId,
    m.teacherName,
    m.className,
    m.startTime,
    m.endTime
  ]);

  autoTable(doc, {
    head: [['תלמיד', 'מורה', 'כיתה', 'התחלה', 'סיום']],
    body: tableRows,
    startY: 20,
    styles: { halign: 'right' }
  });

  doc.save(`${fileName}.pdf`);
};