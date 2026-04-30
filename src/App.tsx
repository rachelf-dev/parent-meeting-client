import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import SetupMeetingPage from './features/setup-meeting/SetupPage'; // וודאי שהנתיב נכון

function App() {
  return (
    <Router>
      <Routes>
        {/* כשהאתר עולה, נשלח ללוגין */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<LoginPage />} />
        
        {/* הנתיב של הדף החדש */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* הנתיב של דף ההגדרות */}
        <Route path="/setup-meeting" element={<SetupMeetingPage />} />
      </Routes>
    </Router>
  );
}

export default App;