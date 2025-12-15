import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HeaderTabs } from './components/HeaderTabs'
import { HomePage } from './pages/HomePage'
import { ComplaintPage } from './pages/ComplaintPage'
import { CreateComplaintPage } from './pages/CreateComplaintPage'
import { MyComplaintsPage } from './pages/MyComplaintsPage'
import { ComplaintDetailPage } from './pages/ComplaintDetailPage'
import { ComplaintDashboard } from './pages/ComplaintDashboard'
import { LoginPage } from './pages/LoginPage'
import './App.css'

function AppLayout() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login';

  return (
    <>
      {!isAuthRoute && <HeaderTabs />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ComplaintDashboard />} />
        <Route path="/complaints" element={<ComplaintPage />} />
        <Route path="/complaints/create" element={<CreateComplaintPage />} />
        <Route path="/complaints/my" element={<MyComplaintsPage />} />
        <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App

