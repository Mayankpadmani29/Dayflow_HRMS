import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './store/slices/authSlice'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Auth Pages
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard'
import Profile from './pages/profile/Profile'
import Employees from './pages/employees/Employees'
import EmployeeDetails from './pages/employees/EmployeeDetails'
import Attendance from './pages/attendance/Attendance'
import Leaves from './pages/leaves/Leaves'
import Payroll from './pages/payroll/Payroll'
import Reports from './pages/reports/Reports'
import Notifications from './pages/notifications/Notifications'
import Settings from './pages/settings/Settings'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import LoadingScreen from './components/ui/LoadingScreen'

function App() {
  const dispatch = useDispatch()
  const { loading, isAuthenticated, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(loadUser())
    }
  }, [dispatch, token])

  // Only show loading if we have a token and are verifying it
  if (loading && token) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn />
        } />
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/:id" element={<EmployeeDetails />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
