import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ComplaintPage } from './pages/ComplaintPage'
import { CreateComplaintPage } from './pages/CreateComplaintPage'
import { MyComplaintsPage } from './pages/MyComplaintsPage'
import { ComplaintDetailPage } from './pages/ComplaintDetailPage'
import { ComplaintDashboard } from './pages/ComplaintDashboard'
import { LoginPage } from './pages/LoginPage'
import { AuthProvider } from './hooks/useAuth';
import { AuditLogsPage } from './pages/AuditLogsPage'
import {ProtectedRoute} from './routes/ProtectedRoute';
import { AppHeader } from './components/AppHeader';
import './App.css'

function AppLayout() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login';

  return (
    <>
      {!isAuthRoute && <AppHeader />}


      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ComplaintDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/my"
          element={
            <ProtectedRoute>
              <MyComplaintsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/create"
          element={
            <ProtectedRoute>
              <CreateComplaintPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AuditLogsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>

    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App

