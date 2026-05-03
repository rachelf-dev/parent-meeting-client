import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from './dashboardService';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [hasStudents, setHasStudents] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false); // מצב חדש לבדיקת קיום שיבוץ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const schoolName = localStorage.getItem('schoolName') || 'אורח';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await dashboardService.getSchoolStatus();
        if (response && response.data) {
          // עדכון המצבים לפי הנתונים מהשרת
          setHasStudents(response.data.studentCount > 0);
          setHasSchedule(response.data.isScheduleGenerated); 
        }
        setError(false);
      } catch (err) {
        console.error("שגיאה בשליפת סטטוס:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('schoolName');
    localStorage.removeItem('schoolId');
    navigate('/login');
  };

  if (loading) return <div className="loading-state">טוען נתונים...</div>;

  return (
    <div className="dashboard-container">
      {/* סרגל עליון */}
      <div className="dashboard-nav-bar" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleLogout} className="logout-btn">
          יציאה והתנתקות ⬅️
        </button>
      </div>

      <header className="dashboard-header">
        <h1 className="dashboard-title">מערכת ניהול אסיפת הורים</h1>
        <br></br>
      </header>
      
      <div className="dashboard-grid">
        {/* שלב 1: תמיד פעיל */}
        <div className="menu-card primary" onClick={() => navigate('/setup-meeting')}>
          <span className="card-icon">⚙️</span>
          <h2 className="card-title">הגדרת / עדכון פגישה</h2>
          <p className="card-desc">קביעת תאריכים, שעות והעלאת אקסל תלמידים</p>
        </div>

        {/* שלב 2: פעיל רק אם יש תלמידים */}
        <div 
          className={`menu-card ${!hasStudents ? 'disabled' : ''}`} 
          onClick={() => hasStudents && navigate('/availability')}
        >
          <span className="card-icon">📝</span>
          <h2 className="card-title">הוספת אילוצים ושיבוץ</h2>
          <p className="card-desc">הזנת זמינות הורים והפעלת אלגוריתם השיבוץ</p>
          {!hasStudents && <span className="lock-badge">🔒 דרוש אקסל תלמידים</span>}
        </div>

        {/* שלב 3: פעיל רק אם בוצע שיבוץ סופי */}
        <div 
          className={`menu-card ${(!hasStudents || !hasSchedule) ? 'disabled' : ''}`}
          onClick={() => (hasStudents && hasSchedule) && navigate('/export')}
        >
          <span className="card-icon">📊</span>
          <h2 className="card-title">ייצוא קבצי פגישות</h2>
          <p className="card-desc">הורדת לוח הפגישות הסופי למורה ולהורים</p>
          {!hasStudents ? (
            <span className="lock-badge">🔒 נעול</span>
          ) : !hasSchedule ? (
            <span className="lock-badge">🔒 דרוש ביצוע שיבוץ</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}