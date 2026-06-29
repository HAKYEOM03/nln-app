import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Personal from './pages/Personal'
import PersonalSubmit from './pages/PersonalSubmit'
import Project from './pages/Project'
import ProjectBoard from './pages/ProjectBoard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminNotices from './pages/admin/AdminNotices'
import AdminSubmissions from './pages/admin/AdminSubmissions'
import AdminSubAdmins from './pages/admin/AdminSubAdmins'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/personal" element={
              <ProtectedRoute><Personal /></ProtectedRoute>
            } />
            <Route path="/personal/submit" element={
              <ProtectedRoute><PersonalSubmit /></ProtectedRoute>
            } />
            <Route path="/project" element={<Project />} />
            <Route path="/project/board" element={<ProjectBoard />} />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>
            } />
            <Route path="/admin/notices" element={
              <ProtectedRoute requireAdmin><AdminNotices /></ProtectedRoute>
            } />
            <Route path="/admin/submissions" element={
              <ProtectedRoute requireAdmin><AdminSubmissions /></ProtectedRoute>
            } />
            <Route path="/admin/sub-admins" element={
              <ProtectedRoute requireAdmin requireSubAdmin={false}><AdminSubAdmins /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
