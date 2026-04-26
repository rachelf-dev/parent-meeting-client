// src/features/setup-meeting/SetupPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { downloadTemplate, uploadExcelFile } from './setupService';
import './SetupPage.css';

export default function SetupPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      await uploadExcelFile(selectedFile);
      alert("הקובץ הועלה ונותח בהצלחה!");
      setSelectedFile(null);
    } catch (err) {
      alert("שגיאה בהעלאה. ודאי שהשרת מופעל ושהנתיב import-excel מוגדר כ-POST.");
    } finally {
      setIsUploading(false);
    }
  };


const onAvailabilitySubmit = async (data: any) => {
  try {
    const payload = {
  parentId: parseInt(data.ParentId), 
  meetingDate: data.MeetingDate,
  startTime: data.StartTime + ":00",
  endTime: data.EndTime + ":00",
  isAvailable: data.IsAvailable === 'true'
};

    console.log("Sending payload to server:", payload);
    
    // ודאי שהנתיב תואם ל-Controller (לפעמים זה /api/ParentAvailability ולפעמים /api/Parent/availability)
    await api.post('/ParentAvailability', payload); 
    
    alert("האילוץ נשמר בהצלחה!");
    reset();
  } catch (err: any) {
    console.error("Full Server Error Object:", err.response?.data);
    
    // חילוץ הודעת השגיאה הספציפית מהשרת
    const serverErrors = err.response?.data?.errors;
    if (serverErrors) {
      const errorMessages = Object.values(serverErrors).flat().join('\n');
      alert("שגיאת אימות מהשרת:\n" + errorMessages);
    } else {
      alert("שגיאה כללית בשמירה. בדקי את ה-Console.");
    }
  }
};

  return (
    <div className="setup-container">
      <header className="setup-header">
        <h1>הגדרות יום הורים</h1>
        <button onClick={() => {localStorage.clear(); navigate('/login');}} className="btn-logout">התנתק</button>
      </header>

      <section className="setup-section">
        <h3>1. ניהול נתוני אקסל</h3>
        <div className="file-upload-zone">
          <button onClick={downloadTemplate} className="btn-secondary">הורד תבנית ריקה</button>
          <input type="file" onChange={onFileSelect} accept=".xlsx" className="setup-input" />
          <button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="btn-primary"
          >
            {isUploading ? 'מעבד נתונים...' : 'שלח קובץ לניתוח'}
          </button>
        </div>
      </section>

      <section className="setup-section">
        <h3>2. הגדרת אילוצי הורים</h3>
        <form onSubmit={handleSubmit(onAvailabilitySubmit)} className="setup-grid">
          <input {...register("ParentId")} placeholder="תעודת זהות הורה" className="setup-input" required />
          <input type="date" {...register("MeetingDate")} className="setup-input" required />
          <input type="time" {...register("StartTime")} className="setup-input" required />
          <input type="time" {...register("EndTime")} className="setup-input" required />
          <select {...register("IsAvailable")} className="setup-input">
            <option value="true">זמין בשעות אלו</option>
            <option value="false">לא זמין בשעות אלו</option>
          </select>
          <button type="submit" className="btn-primary btn-success">שמור אילוץ</button>
        </form>
      </section>
    </div>
  );
}