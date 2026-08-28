import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OperationsDashboard from './pages/OperationsDashboard';
import WardsBedsManagement from './pages/WardsBedsManagement';

// New Pages
import PatientDirectory from './pages/PatientDirectory';
import WaitingList from './pages/WaitingList';
import PatientProfile from './pages/PatientProfile';
import Admissions from './pages/Admissions';
import PatientTransfers from './pages/PatientTransfers';
import Analytics from './pages/Analytics';
import WardLogs from './pages/WardLogs';
import CapacityOptimization from './pages/CapacityOptimization';
import AlertsReports from './pages/AlertsReports';
import SystemSettings from './pages/SystemSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Core Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<OperationsDashboard />} />
        <Route path="/wards-beds" element={<WardsBedsManagement />} />

        {/* Module Routes */}
        <Route path="/patients" element={<PatientDirectory />} />
        <Route path="/waiting-list" element={<WaitingList />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path="/admissions" element={<Admissions />} />

        {/* Below module's are currently under development*/}
        <Route path="/transfers" element={<PatientTransfers />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ward-logs" element={<WardLogs />} />
        <Route path="/capacity" element={<CapacityOptimization />} />
        <Route path="/alerts" element={<AlertsReports />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
