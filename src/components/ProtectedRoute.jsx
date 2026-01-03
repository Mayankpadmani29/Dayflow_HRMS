import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
