import { useForm } from 'react-hook-form';
import { authService } from '../features/auth/authService';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await authService.register(data);
      alert("נרשמתם בהצלחה!");
      navigate('/login');
    } catch (err) {
      alert("שגיאה ברישום.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', direction: 'rtl', textAlign: 'center' }}>
      <h1>רישום בית ספר חדש</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input {...register("name")} placeholder="שם בית הספר" style={{ padding: '10px' }} required />
        <input {...register("password")} type="password" placeholder="סיסמה" style={{ padding: '10px' }} required />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>הירשם</button>
      </form>
      <p>כבר רשומים? <Link to="/login">חזרה להתחברות</Link></p>
    </div>
  );
}