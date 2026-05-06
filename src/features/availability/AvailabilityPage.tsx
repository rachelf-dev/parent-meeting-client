import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SuccessModal from '../../components/SuccessModal';
import './AvailabilityPage.css';
import { availabilityService } from './availabilityService'; 

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [showSuccessNote, setShowSuccessNote] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onAddAvailability = async (data: any) => {
    setLoading(true);
    try {
      // יצירת אובייקט התואם בדיוק ל-DTO ב-C#
      const payload = {
        // המרת המזהה למספר
        ParentId: data.parentId ? Number(data.parentId) : null,
        ParentIdentity: data.parentId.toString(),
        // המרת התאריך לפורמט ISO שהשרת מצפה לו
        MeetingDate: new Date(data.meetingDate).toISOString(),
        // משיכת מזהה בית הספר מה-LocalStorage
        SchoolId: Number(localStorage.getItem('schoolId')) || 0,
        // פורמט TimeSpan עבור C# (שעות:דקות:שניות)
        StartTime: `${data.startTime}:00`, 
        EndTime: `${data.endTime}:00`,
        // הבטחת ערך בוליאני
        IsAvailable: Boolean(data.isAvailable)
      };

      // קריאה לפונקציית השירות
      await availabilityService.addParentAvailability(payload);
      
      setShowSuccessNote(true);
      reset(); 
      setTimeout(() => setShowSuccessNote(false), 3000);
    } catch (err) {
      // במקרה של שגיאת 400, מומלץ לבדוק את ה-Response ב-Network Tab
      console.error("שגיאה בשמירה:", err);
      alert("חלה שגיאה בשמירת הנתונים. וודא שכל השדות מלאים כראוי.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSchedule = async () => {
    setLoading(true);
    try {
      await availabilityService.generateFinalSchedule();
      setIsModalOpen(true); 
    } catch (err) {
      console.error("שגיאה ביצירת שיבוץ:", err);
      alert("לא ניתן היה ליצור שיבוץ כרגע.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="availability-container">
      <div className="nav-bar">
        <button onClick={() => navigate('/dashboard')} className="nav-btn-back">
          🏠 חזור לדף הבית
        </button>
      </div>

      <h1 className="page-title">ניהול זמינות ושיבוץ פגישות</h1>

      <div className="content-layout">
        <section className="availability-form-section">
          <h2>הגדרת זמינות הורה</h2>
          <form onSubmit={handleSubmit(onAddAvailability)} className="availability-form">
            
            <div className="input-group">
              <label>מזהה הורה (ID)</label>
              <input type="number" {...register("parentId")} required placeholder="הכנס קוד הורה" />
            </div>

            <div className="input-group">
              <label>תאריך הפגישה</label>
              <input type="date" {...register("meetingDate")} required />
            </div>

            <div className="time-range">
              <div className="input-group">
                <label>שעת התחלה</label>
                <input type="time" {...register("startTime")} required />
              </div>
              <div className="input-group">
                <label>שעת סיום</label>
                <input type="time" {...register("endTime")} required />
              </div>
            </div>

            <div className="checkbox-group">
              <label className="switch-label">
                <input type="checkbox" {...register("isAvailable")} defaultChecked />
                <span>הורה זמין בשעות אלו</span>
              </label>
            </div>

            <button type="submit" className="btn-save-item" disabled={loading}>
              {loading ? "שומר..." : "שמור זמינות והוסף עוד +"}
            </button>

            {showSuccessNote && (
              <p className="success-note">✅ הזמינות נשמרה בהצלחה!</p>
            )}
          </form>
        </section>

        <section className="generate-section">
          <div className="action-box">
            <h3>יצירת לוח פגישות סופי</h3>
            <p>לאחר הזנת כל זמני הזמינות, לחץ כאן כדי להריץ את השיבוץ האוטומטי.</p>
            <button 
              onClick={handleGenerateSchedule} 
              className="btn-generate-final"
              disabled={loading}
            >
              הפעל יצירת שיבוץ 🚀
            </button>
          </div>
        </section>
      </div>

      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}