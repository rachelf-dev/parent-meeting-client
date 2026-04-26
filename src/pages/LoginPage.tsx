import { useForm } from 'react-hook-form';
import { authService } from '../features/auth/authService'; // ודאי שהנתיב מדויק
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

const onSubmit = async (data: any) => {
    try {
      const response = await authService.login(data);
      
      // שמירת הנתונים שהשרת מחזיר
      localStorage.setItem('token', response.token);
      localStorage.setItem('schoolName', response.name);
      
      // הוספת השורה הזו היא קריטית:
      localStorage.setItem('schoolId', response.id); 
      
      navigate('/setup'); 
    } catch (err) {
      alert("שגיאה בהתחברות. בדקו את שם בית הספר והסיסמה.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', direction: 'rtl', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>כניסת בית ספר</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input {...register("name")} placeholder="שם בית הספר" style={{ padding: '10px' }} required />
        <input {...register("password")} type="password" placeholder="סיסמה" style={{ padding: '10px' }} required />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}>התחבר</button>
      </form>
      <p>אין לכם חשבון? <Link to="/register">הירשמו כאן</Link></p>
    </div>
  );
}