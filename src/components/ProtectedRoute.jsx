import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireAdmin, requireSubAdmin }) {
  const { user, isAdmin, isSubAdmin } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (requireAdmin && !isAdmin && !isSubAdmin) return <Navigate to="/" replace />
  if (requireAdmin && requireSubAdmin === false && !isAdmin) return <Navigate to="/" replace />

  return children
}
