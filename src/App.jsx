import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HeaderTabs } from './components/HeaderTabs'
import { HomePage } from './pages/HomePage'
import { ComplaintPage } from './pages/ComplaintPage'
import { CreateComplaintPage } from './pages/CreateComplaintPage'
import { MyComplaintsPage } from './pages/MyComplaintsPage'
import { ComplaintDetailPage } from './pages/ComplaintDetailPage'
import { ComplaintDashboard } from './pages/ComplaintDashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <HeaderTabs />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<MyComplaintsPage />} />
            <Route path="/complaint" element={<ComplaintPage />} />
            <Route path="/complaints" element={<ComplaintPage />} />
            <Route path="/complaints/create" element={<CreateComplaintPage />} />
            <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
            <Route path="/agent/dashboard" element={<ComplaintDashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
