import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../features/auth/authService';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setErrorMessage(null);
    try {
      await authService.register(data);
      // במקום alert, אפשר להעביר לדף התחברות עם הודעת הצלחה ב-state
      navigate('/login');
    } catch (err: any) {
      // טיפול בשגיאת "שם כבר קיים" או שגיאות כלליות
      if (err.response?.status === 409 || err.message?.includes("exists")) {
        setErrorMessage("שם בית הספר הזה כבר רשום במערכת");
      } else {
        setErrorMessage("אופס! קרתה שגיאה ברישום. נסו שוב מאוחר יותר");
      }
    }
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif', direction: 'rtl' as const },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' as const },
    errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', border: '1px solid #fecaca' },
    input: { padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' },
    button: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2ecc71', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>רישום בית ספר</h1>
        <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>יצירת חשבון חדש במערכת</p>

        {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input {...register("name")} placeholder="שם בית הספר" style={styles.input} required />
          <input {...register("password")} type="password" placeholder="סיסמה (לפחות 6 תווים)" style={styles.input} required />
          <button type="submit" style={styles.button}>הירשם עכשיו</button>
        </form>
        <div style={{ marginTop: '20px', color: '#7f8c8d' }}>
          כבר רשומים? <Link to="/login" style={{ color: '#2ecc71', textDecoration: 'none' }}>חזרה להתחברות</Link>
        </div>
      </div>
    </div>
  );
}