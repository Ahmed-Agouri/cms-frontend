import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HeaderTabs } from './components/HeaderTabs'
import { HomePage } from './pages/HomePage'
import { ComplaintPage } from './pages/ComplaintPage'
import { CreateComplaintPage } from './pages/CreateComplaintPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <HeaderTabs />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/complaint" element={<ComplaintPage />} />
            <Route path="/complaints" element={<ComplaintPage />} />
            <Route path="/complaints/create" element={<CreateComplaintPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
