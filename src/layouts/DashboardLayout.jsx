import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  UserGroupIcon,
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'
import { logout } from '../store/slices/authSlice'
import { toggleTheme } from '../store/slices/themeSlice'
import { getNotifications } from '../store/slices/notificationSlice'
import Avatar from '../components/ui/Avatar'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const { mode } = useSelector((state) => state.theme)
  const { unreadCount } = useSelector((state) => state.notifications)

  useEffect(() => {
    dispatch(getNotifications({ limit: 5 }))
  }, [dispatch])

  useEffect(() => {
    // Apply theme on mount
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/signin')
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'hr'

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    ...(isAdmin
      ? [{ name: 'Employees', href: '/employees', icon: UserGroupIcon }]
      : []),
    { name: 'Attendance', href: '/attendance', icon: ClockIcon },
    { name: 'Leaves', href: '/leaves', icon: CalendarDaysIcon },
    { name: 'Payroll', href: '/payroll', icon: CurrencyDollarIcon },
    ...(isAdmin
      ? [{ name: 'Reports', href: '/reports', icon: ChartBarIcon }]
      : []),
    { name: 'Notifications', href: '/notifications', icon: BellIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">D</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Dayflow</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link-active' : 'sidebar-link'
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.name === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Avatar name={`${user?.firstName} ${user?.lastName}`} src={user?.avatar} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Bars3Icon className="w-6 h-6 text-gray-500" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {location.pathname.split('/')[1] || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {mode === 'dark' ? (
                  <SunIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BellIcon className="w-5 h-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Avatar name={`${user?.firstName} ${user?.lastName}`} src={user?.avatar} size="sm" />
                </button>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    >
                      <button
                        onClick={() => {
                          setProfileDropdown(false)
                          navigate('/profile')
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <UserCircleIcon className="w-4 h-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdown(false)
                          navigate('/settings')
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Cog6ToothIcon className="w-4 h-4" />
                        Settings
                      </button>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
