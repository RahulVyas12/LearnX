import { Link, Route, Routes, Navigate } from 'react-router';
import logo from './assets/learnx_logo.png';
import Announcements from './pages/Announcements';
import Certificates from './pages/Certificates';
import CheckEmail from './pages/CheckEmail';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import PracticeTestPlayer from './pages/PracticeTestPlayer';
import PracticeTests from './pages/PracticeTests';
import Profile from './pages/Profile';
import Register from './pages/Register';
import SkillPathDetail from './pages/SkillPathDetail';
import SkillPaths from './pages/SkillPaths';
import ModuleReader from './pages/ModuleReader';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import Logo from './components/ui/Logo';

// Admin Page Imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/layout/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminSkillPaths from './pages/admin/AdminSkillPaths';
import AdminSkillPathEditor from './pages/admin/AdminSkillPathEditor';
import AdminPracticeTests from './pages/admin/AdminPracticeTests';
import AdminPracticeTestEditor from './pages/admin/AdminPracticeTestEditor';

function App() {
    return (
        <AuthProvider>
            <Toaster position="top-right" toastOptions={{
                duration: 4000,
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                },
            }} />
            <Routes>
                {/* ── Admin Routes ───────────────────────────── */}
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="skill-paths" element={<AdminSkillPaths />} />
                        <Route path="skill-paths/:id" element={<AdminSkillPathEditor />} />
                        <Route path="practice-tests" element={<AdminPracticeTests />} />
                        <Route path="practice-tests/:id" element={<AdminPracticeTestEditor />} />
                        <Route path="announcements" element={<AdminAnnouncements />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Route>
                </Route>

                {/* ── Public Routes ──────────────────────────── */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/check-email" element={<CheckEmail />} />

                {/* ── User Protected Routes ──────────────────── */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/skill-paths" element={<SkillPaths />} />
                    <Route path="/skill-path/:id" element={<SkillPathDetail />} />
                    <Route path="/module/:moduleId" element={<ModuleReader />} />
                    <Route path="/certificates" element={<Certificates />} />
                    <Route path="/practice-tests" element={<PracticeTests />} />
                    <Route path="/practice-test/:id" element={<PracticeTestPlayer />} />
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

function NotFound() {
    const { user } = useAuth();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 px-4 text-center">
            <Logo size="lg" />
            <h1 className="text-7xl font-black text-slate-200 mt-6 relative">
                404
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-900">Oops!</span>
            </h1>
            <p className="text-slate-500 font-bold mt-4 max-w-xs transition-colors hover:text-slate-600">
                The page you're looking for has moved or doesn't exist.
            </p>
            <Link
                to={user ? (user.role === 'admin' ? "/admin/dashboard" : "/dashboard") : "/"}
                className="mt-8 px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-95"
            >
                {user ? "Back to Dashboard" : "Back to Home"}
            </Link>
        </div>
    );
}

export default App;
