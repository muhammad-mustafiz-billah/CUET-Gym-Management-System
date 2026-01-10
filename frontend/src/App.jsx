import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Schedule from './pages/Schedule';
import UserEquipment from './pages/UserEquipment';
import UserTrainers from './pages/UserTrainers';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Trainers from './pages/Trainers';
import Equipment from './pages/Equipment';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import ChatbotIcon from './components/ChatbotIcon';
import UserDashboard from './pages/UserDashboard';
import AdminSchedule from './pages/AdminSchedule';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ChatbotIcon />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/equipment" element={<UserEquipment />} />
          <Route path="/trainers" element={<UserTrainers />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="trainers" element={<Trainers />} />
            <Route path="equipment" element={<Equipment />} />


            <Route path="attendance" element={<Attendance />} />
            <Route path="settings" element={<Settings />} />
            <Route path="schedule" element={<AdminSchedule />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
