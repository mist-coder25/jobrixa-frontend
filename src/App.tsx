import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Pipeline from './pages/Pipeline';
import Analytics from './pages/Analytics';
import Resumes from './pages/Resumes';
import Settings from './pages/Settings';
import Discover from './pages/Discover';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("jobrixa_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function RootRedirect() {
  const token = localStorage.getItem("jobrixa_token");
  return token ? <Navigate to="/pipeline" replace /> : <Navigate to="/login" replace />;
}

import ToastContainer from './components/Toast';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
