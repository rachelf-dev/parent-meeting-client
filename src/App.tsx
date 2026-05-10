import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import SetupMeetingPage from './features/setup-meeting/SetupPage'; 
import RegisterPage from './pages/RegisterPage';
import AvailabilityPage from './features/availability/AvailabilityPage';
import ExportPage from './features/export/ExportPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={ <ProtectedRoute> <DashboardPage /> </ProtectedRoute> } />        

        <Route path="/setup-meeting" element={ <ProtectedRoute> <SetupMeetingPage /> </ProtectedRoute> } /> 

        <Route path="/availability" element={ <ProtectedRoute> <AvailabilityPage /> </ProtectedRoute> } />        

        {/* <Route path="/export" element={ <ProtectedRoute> <ExportPage /> </ProtectedRoute> } />         */}
        <Route path="/export" element={ <ProtectedRoute> <ExportPage /> </ProtectedRoute> } />        


      </Routes>
    </Router>
  );
}

export default App;