import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from './dashboardService';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [hasStudents, setHasStudents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const schoolName = localStorage.getItem('schoolName') || 'אורח';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await dashboardService.getSchoolStatus();
        if (response && response.data) {
          setHasStudents(response.data.studentCount > 0);
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
    navigate('/login');
  };

  if (loading) return <div className="loading-state">טוען נתונים...</div>;

  return (
    <div className="dashboard-container">
      {/* סרגל עליון עם כפתור התנתקות בלבד */}
      <div className="dashboard-nav-bar" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleLogout} className="logout-btn">
          יציאה והתנתקות ⬅️
        </button>
      </div>

      <header className="dashboard-header">
        <p className="dashboard-title">מערכת אסיפת הורים</p>
      </header>
      
      <div className="dashboard-grid">
        <div className="menu-card primary" onClick={() => navigate('/setup-meeting')}>
          <span className="card-icon">⚙️</span>
          <h2 className="card-title">הגדרת / עדכון פגישה</h2>
          <p className="card-desc">קביעת תאריכים, שעות והעלאת אקסל תלמידים</p>
        </div>

        <div className={`menu-card ${!hasStudents ? 'disabled' : ''}`} 
             onClick={() => hasStudents && navigate('/constraints')}>
          <span className="card-icon">📝</span>
          <h2 className="card-title">הוספת אילוצים</h2>
          {!hasStudents && <span className="lock-badge">🔒 נעול</span>}
        </div>

        <div className={`menu-card ${!hasStudents ? 'disabled' : ''}`}
             onClick={() => hasStudents && navigate('/export')}>
          <span className="card-icon">📊</span>
          <h2 className="card-title">ייצוא קבצי פגישות</h2>
          {!hasStudents && <span className="lock-badge">🔒 נעול</span>}
        </div>
      </div>
    </div>
  );
}