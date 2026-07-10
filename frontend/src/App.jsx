import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AuthPage from './pages/AuthPage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import InstructorSurveyPage from './pages/InstructorSurveyPage';
import StudentSurveyPage from './pages/StudentSurveyPage';
import TeacherHome from './pages/TeacherHome';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminResponses from './pages/AdminResponses';
import { useAuth } from './context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen relative overflow-hidden bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative bg-[#F8FAFC]">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(#94a3b8 0.5px, transparent 0.5px)`,
                backgroundSize: '24px 24px'
              }}
            />
          </div>
          <div className="w-full max-w-screen-2xl mx-auto relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

// ── AppRoutes has access to useLocation() because it lives inside <BrowserRouter>
function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // ── NOT LOGGED IN ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/survey/student" element={<StudentSurveyPage />} />
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  }

  // ── TEACHER: home → dashboard or form ──────────────────────────────────────────
  if (user?.role === 'teacher') {
    return (
      <Routes>
        <Route path="/teacher"           element={<TeacherHome />} />
        <Route path="/teacher/form"      element={<Layout><InstructorSurveyPage /></Layout>} />
        <Route path="/teacher/dashboard" element={<Layout><TeacherDashboard /></Layout>} />
        <Route path="*"                  element={<Navigate to="/teacher" replace />} />
      </Routes>
    );
  }

  // ── ADMIN: full system access ──────────────────────────────────────────────
  if (user?.role === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
        <Route path="/responses" element={<Layout><AdminResponses /></Layout>} />
        <Route path="/logs" element={<Layout><AdminPanel /></Layout>} />
        <Route path="/upload" element={<Layout><UploadPage /></Layout>} />
        <Route path="/analysis" element={<Layout><AnalysisPage /></Layout>} />
        <Route path="/results" element={<Layout><ResultsPage /></Layout>} />
        <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // ── STUDENT / DEFAULT ──────────────────────────────────────────────────────
  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/upload" element={<Layout><UploadPage /></Layout>} />
      <Route path="/analysis" element={<Layout><AnalysisPage /></Layout>} />
      <Route path="/results" element={<Layout><ResultsPage /></Layout>} />
      <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
      <Route path="/settings" element={<Layout><Dashboard /></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
