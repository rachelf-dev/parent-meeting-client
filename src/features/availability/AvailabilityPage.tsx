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
      const payload = {
        parentId: Number(data.parentId),
        // הוספת שניות לפורמט הזמן עבור TimeSpan ב-C#
        startTime: `${data.startTime}:00`, 
        endTime: `${data.endTime}:00`,
        isAvailable: data.isAvailable,
        // המרת התאריך שנבחר לפורמט ISO תקני
        meetingDate: new Date(data.meetingDate).toISOString(),
        schoolId: Number(localStorage.getItem('schoolId')) || 0
      };

      await availabilityService.addParentAvailability(payload);
      
      setShowSuccessNote(true);
      reset(); 
      setTimeout(() => setShowSuccessNote(false), 3000);
    } catch (err) {
      console.error("שגיאה בשמירה:", err);
      alert("לא ניתן לשמור את הנתונים. ודא שהתחברת למערכת ושהשרת רץ.");
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
      alert("שגיאה בתהליך יצירת השיבוץ");
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

            {/* שדה תאריך חדש */}
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