import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SuccessModal from '../../components/SuccessModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { availabilityService,type ParentAvailability } from './availabilityService'; // ייבוא תקין
import './AvailabilityPage.css';

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState<ParentAvailability[]>([]);
  const [showList, setShowList] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: number | null, name: string}>({
    isOpen: false, id: null, name: ''
  });

  const loadAvailabilities = async () => {
    setLoading(true);
    try {
      const data = await availabilityService.getAvailabilities();
      setAvailabilities(data);
    } catch (err) {
      console.error("שגיאה בטעינת נתונים", err);
    } finally {
      setLoading(false);
    }
  };

  const onAddAvailability = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        ParentId: data.parentId ? Number(data.parentId) : null,
        ParentIdentity: data.parentId.toString(),
        MeetingDate: new Date(data.meetingDate).toISOString(),
        SchoolId: Number(localStorage.getItem('schoolId')) || 0,
        StartTime: `${data.startTime}:00`, 
        EndTime: `${data.endTime}:00`,
        IsAvailable: Boolean(data.isAvailable)
      };

      await availabilityService.addParentAvailability(payload);
      reset(); 
      if (showList) loadAvailabilities();
    } catch (err) {
      alert("חלה שגיאה בשמירת הנתונים.");
    } finally {
      setLoading(false);
    }
  };

  const toggleList = () => {
    if (!showList) loadAvailabilities();
    setShowList(!showList);
  };

const confirmDelete = async () => {
  console.log("Confirming delete for ID:", deleteModal.id); // בדיקה
  if (deleteModal.id !== null) {
    try {
      await availabilityService.deleteAvailability(deleteModal.id);
      // עדכון הסטייט המקומי כדי שהשורה תיעלם מיד
      setAvailabilities(prev => prev.filter(a => (a.id || (a as any).Id) !== deleteModal.id));
      console.log("Delete successful");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("שגיאה במחיקה מהשרת");
    } finally {
      setDeleteModal({ isOpen: false, id: null, name: '' });
    }
  } else {
    console.warn("No ID found to delete");
  }
};

  return (
    <div className="availability-container">
      <div className="nav-bar">
        <button onClick={() => navigate('/dashboard')} className="nav-btn-back">🏠 חזור לדף הבית</button>
      </div>

      <h1 className="page-title">ניהול זמינות ושיבוץ פגישות</h1>

      <div className="content-layout">
        {/* צד ימין: טופס ורשימה */}
        <section className="right-section">
          <div className="availability-form-section">
            <h2>הגדרת זמינות הורה</h2>
            <form onSubmit={handleSubmit(onAddAvailability)} className="availability-form">
              <div className="input-group">
                <label>תעודת זהות הורה</label>
                <input type="text" {...register("parentId")} required placeholder="הכנס תעודת זהות" />
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
            </form>
          </div>

          <button onClick={toggleList} className="btn-toggle-list">
            {showList ? "הסתר רשימת אילוצים 🔼" : "הצג אילוצים קיימים 🔽"}
          </button>

          {showList && (
            <div className="availabilities-list fade-in">
              {availabilities.map((item, index) => (
  /* שימוש ב-id מהשרת, ואם הוא חסר - שימוש באינדקס כדי להשקיט את האזהרה */
  <div key={item.id || index} className="availability-card">
    <div className="card-info">
      <strong>👤 הורה: {item.parentIdentity}</strong>
      <span>📅 {new Date(item.meetingDate).toLocaleDateString('he-IL')}</span>
      <span>⏰ {item.startTime.substring(0, 5)} - {item.endTime.substring(0, 5)}</span>
   <small > {item.isAvailable ? " זמין " : " לא זמין "} </small>
    </div>
    <button 
  className="btn-delete-trash" 
  onClick={() => {
    setDeleteModal({ 
      isOpen: true, 
      id: item.id || (item as any).Id, // תמיכה גם ב-Id גדולה מה-C#
      name: item.parentIdentity 
    });
  }}
>
  🗑️
</button>
  </div>
))}
            </div>
          )}
        </section>

        {/* צד שמאל: שיבוץ */}
        <section className="left-section">
          <div className="action-box">
            <h3>יצירת לוח פגישות סופי</h3>
            <p>לאחר הזנת כל זמני הזמינות, לחץ כאן כדי להריץ את השיבוץ האוטומטי.</p>
            <br></br>
            <button onClick={async () => {
              setLoading(true);
              try {
                await availabilityService.generateFinalSchedule();
                setIsSuccessModalOpen(true);
              } catch { alert("שגיאה בשיבוץ"); }
              finally { setLoading(false); }
            }} className="btn-generate-final" disabled={loading}>
              הפעל יצירת שיבוץ 🚀
            </button>
          </div>
        </section>
      </div>

      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} />
      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })} 
        onConfirm={confirmDelete}
        title={deleteModal.name}
      />
    </div>
  );
}