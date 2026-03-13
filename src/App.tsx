import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Pipeline from './pages/Pipeline';
import Analytics from './pages/Analytics';
import Resumes from './pages/Resumes';
import Settings from './pages/Settings';
import Discover from './pages/Discover';
import Pricing from './pages/Pricing';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import ToastContainer from './components/Toast';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("jobrixa_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function RootRedirect() {
  const token = localStorage.getItem("jobrixa_token");
  return token ? <Navigate to="/pipeline" replace /> : <Landing />;
}

/** Inner component with access to useLocation for page transitions */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ height: "100%" }}
      >
        <Routes location={location}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
      <Router>
        <AnimatedRoutes />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
