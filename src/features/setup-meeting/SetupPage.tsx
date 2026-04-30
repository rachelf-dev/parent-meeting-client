import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { setupService } from './setupService';
import SuccessModal from '../../components/SuccessModal'; // ודאי שהנתיב תואם למיקום הקובץ שיצרת
import './SetupPage.css';

export default function SetupPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // מצב לשליטה על המודאל

  const onSubmit = async (data: any) => {
    if (!selectedFile) return alert("אנא בחר קובץ אקסל");
    
    setLoading(true);
    try {
      await setupService.saveMeetingDetails(data);
      await setupService.uploadExcelFile(selectedFile);
      
      setIsModalOpen(true); 
    } catch (err) {
      alert("שגיאה בשמירת הנתונים");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container">
      {/* סרגל ניווט עליון עם כפתור חזרה */}
      <div className="setup-nav-bar" style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/dashboard')} className="nav-btn-back">
          🏠 חזור לדף הבית
        </button>
      </div>

      <h1 className="setup-title">הגדרות אסיפת הורים</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="setup-section">
          <h3>פרטי הפגישה</h3>
          <div className="setup-grid">
            <div className="input-group">
              <label htmlFor="date">תאריך האסיפה</label>
              <input id="date" type="date" {...register("date")} className="setup-input" required />
            </div>

            <div className="input-group">
              <label htmlFor="startTime">שעת התחלה</label>
              <input id="startTime" type="time" {...register("startTime")} className="setup-input" required />
            </div>

            <div className="input-group">
              <label htmlFor="endTime">שעת סיום</label>
              <input id="endTime" type="time" {...register("endTime")} className="setup-input" required />
            </div>

            <div className="input-group">
              <label htmlFor="duration">משך פגישה בודדת (בדקות)</label>
<input 
  id="duration" 
  type="number" 
  {...register("duration", { valueAsNumber: true })} className="setup-input" required />            </div>
          </div>
        </section>

        <section className="setup-section">
          <h3>העלאת תלמידים</h3>
          <div className="file-upload-zone">
            <label>בחר קובץ אקסל לעדכון רשימת התלמידים</label>
            <div className="file-actions">
              <button type="button" onClick={setupService.downloadTemplate} className="btn-secondary">
                הורד תבנית ריקה
              </button>
              <input 
                type="file" 
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
                accept=".xlsx" 
              />
            </div>
          </div>
        </section>

        <button type="submit" disabled={loading} className="btn-submit-all">
          {loading ? "מעבד נתונים..." : "סיום והגדרת אסיפה"}
        </button>
      </form>

      {/* הרכיב של המודאל המעוצב שיופיע בסיום */}
      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}