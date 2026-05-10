import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ParentMeetingDto } from './ExportPage';

export const exportToExcel = async (data: ParentMeetingDto[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('פגישות');

  worksheet.columns = [
    { header: 'תלמיד', key: 'studentId', width: 15 },
    { header: 'מורה', key: 'teacherName', width: 20 },
    { header: 'כיתה', key: 'className', width: 10 },
    { header: 'התחלה', key: 'startTime', width: 12 },
    { header: 'סיום', key: 'endTime', width: 12 },
  ];

  worksheet.addRows(data);

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