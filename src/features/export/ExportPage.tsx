import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportToExcel, exportToPDF } from './ExportService';
import api from '../../api/axiosInstance'; 
import './ExportPage.css';

export interface ParentMeetingDto {
  studentId: number;
  studentName: string; 
  parentName: string;
  teacherName: string;
  className: string;
  startTime: string;
  endTime: string;
  meetingDate: string;
}

// Service פנימי לניהול הקריאות ל-API
export const exportService = {
  getAllMeetings: async (): Promise<ParentMeetingDto[]> => {
    // שים לב: הנתיב צריך להיות תואם ל-Controller ב-C#
    const response = await api.get('/ParentMeeting'); 
    return response.data;
  }
};

export default function ExportPage() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<ParentMeetingDto[]>([]);
  const [loading, setLoading] = useState(false);

  // טעינת הנתונים בטעינת הדף
  const loadMeetings = async () => {
    setLoading(true);
    try {
      const data = await exportService.getAllMeetings();
      setMeetings(data);
    } catch (err) {
      console.error("שגיאה בטעינת פגישות לייצוא", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  // פונקציות עזר לייצוא
  const handleExcelExport = () => {
    const schoolName = localStorage.getItem('schoolName') || 'בית ספר';
    exportToExcel(meetings, `לו"ז פגישות - ${schoolName}`);
  };

  const handlePdfExport = (type: 'class' | 'all') => {
    if (type === 'class') {
      // ייצוא מרוכז לפי כיתות
      exportToPDF(meetings, 'דוח_כיתות', 'ריכוז פגישות הורים לפי כיתה');
    } else {
      // ייצוא כללי
      exportToPDF(meetings, 'כל_הפגישות', 'ריכוז פגישות הורים כללי');
    }
  };

  return (
    <div className="export-container">
      <div className="nav-bar">
        <button onClick={() => navigate('/dashboard')} className="nav-btn-back">
          🏠 חזור לדף הבית
        </button>
      </div>

      <h1 className="page-title">מרכז ייצוא דוחות ולו"ז</h1>

      <div className="content-layout">
        <section className="action-box fade-in">
          <h2>אפשרויות ייצוא</h2>
          <p>כאן ניתן להוריד את תוצאות השיבוץ הסופי בפורמטים שונים.</p>
          
          {loading ? (
            <div className="loading-spinner">טוען נתונים...</div>
          ) : (
            <div className="export-buttons-grid">
              <div className="export-card">
                <h3>📊 ריכוז מלא (Excel)</h3>
                <p>קובץ המכיל את כל הפגישות בבית הספר, כולל תאריכים ושעות.</p>
                <button 
                  onClick={handleExcelExport} 
                  className="export-btn btn-excel"
                  disabled={meetings.length === 0}
                >
                  הורד קובץ Excel
                </button>
              </div>

              <div className="export-card">
                <h3>🏫 לו"ז כיתתי (PDF)</h3>
                <p>ייצוא המותאם להדפסה ותלייה בלוח המודעות של הכיתה.</p>
                <button 
                  onClick={() => handlePdfExport('class')} 
                  className="export-btn btn-pdf"
                  disabled={meetings.length === 0}
                >
                  הורד PDF לכיתות
                </button>
              </div>
            </div>
          )}

          {meetings.length === 0 && !loading && (
            <div className="no-data-msg">
              ⚠️ לא נמצאו פגישות לשיבוץ. וודא שהפעלת את הליך השיבוץ בדף הזמינות.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}