import { useState } from 'react'; // הוספת useState
import { useForm } from 'react-hook-form';
import { authService } from '../features/auth/authService';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 

  const onSubmit = async (data: any) => {
    setErrorMessage(null); 
    try {
      const response = await authService.login(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('schoolName', response.name);
      localStorage.setItem('schoolId', response.id); 
      navigate('/dashboard'); 
    } catch (err: any) {
      const msg = err.response?.data?.message || "שם בית ספר או סיסמה שגויים";
      setErrorMessage(msg);
    }
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif', direction: 'rtl' as const },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' as const },
    errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', border: '1px solid #fecaca' },
    input: { padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' },
    button: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#3498db', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>כניסת בית ספר</h1>
        
        {/* הצגת הודעת השגיאה במידה וקיימת */}
        {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input {...register("name")} placeholder="שם בית הספר" style={styles.input} required />
          <input {...register("password")} type="password" placeholder="סיסמה" style={styles.input} required />
          <button type="submit" style={styles.button}>התחבר</button>
        </form>
        <div style={{ marginTop: '20px', color: '#7f8c8d' }}>
          אין לכם חשבון? <Link to="/register" style={{ color: '#3498db', textDecoration: 'none' }}>הירשמו כאן</Link>
        </div>
      </div>
    </div>
  );
}