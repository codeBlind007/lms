import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { CreateLeadPage } from './pages/CreateLeadPage'
import { EditLeadPage } from './pages/EditLeadPage'
import { LeadDetailsPage } from './pages/LeadDetailsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
  
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

   
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/leads/create" element={<CreateLeadPage />} />
        <Route path="/leads/:id" element={<LeadDetailsPage />} />
        <Route path="/leads/:id/edit" element={<EditLeadPage />} />
      </Route>

     
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
