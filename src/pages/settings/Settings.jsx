import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {
  SunIcon,
  MoonIcon,
  BellIcon,
  LockClosedIcon,
  UserCircleIcon,
  GlobeAltIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Select } from '../../components/ui/Input'
import { toggleTheme } from '../../store/slices/themeSlice'
import { updatePassword } from '../../store/slices/authSlice'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const Settings = () => {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((state) => state.theme)
  const { loading } = useSelector((state) => state.auth)
  const [activeSection, setActiveSection] = useState('appearance')

  const sections = [
    { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: LockClosedIcon },
    { id: 'language', label: 'Language', icon: GlobeAltIcon },
  ]

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain uppercase letter')
        .matches(/[a-z]/, 'Must contain lowercase letter')
        .matches(/[0-9]/, 'Must contain number')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(
        updatePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      )
      if (updatePassword.fulfilled.match(result)) {
        toast.success('Password updated successfully')
        resetForm()
      } else {
        toast.error(result.payload || 'Failed to update password')
      }
    },
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    leaveReminders: true,
    attendanceAlerts: true,
    payrollNotifications: true,
    announcements: true,
  })

  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    toast.success('Notification settings updated')
  }

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your preferences and account settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <Card className="p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'appearance' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Appearance
              </h2>
              <div className="space-y-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {darkMode ? (
                      <MoonIcon className="w-6 h-6 text-primary-600" />
                    ) : (
                      <SunIcon className="w-6 h-6 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Switch between light and dark themes
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={darkMode}
                    onChange={() => dispatch(toggleTheme())}
                  />
                </div>

                {/* Theme Cards */}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => !darkMode || dispatch(toggleTheme())}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        !darkMode
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-16 bg-white rounded-md border border-gray-200 mb-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Light</p>
                    </button>
                    <button
                      onClick={() => darkMode || dispatch(toggleTheme())}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        darkMode
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-16 bg-gray-900 rounded-md mb-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Dark</p>
                    </button>
                    <button className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed">
                      <div className="w-full h-16 bg-gradient-to-r from-white to-gray-900 rounded-md mb-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">System</p>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  {
                    key: 'emailNotifications',
                    label: 'Email Notifications',
                    description: 'Receive notifications via email',
                  },
                  {
                    key: 'pushNotifications',
                    label: 'Push Notifications',
                    description: 'Receive push notifications in browser',
                  },
                  {
                    key: 'leaveReminders',
                    label: 'Leave Reminders',
                    description: 'Get reminded about pending leave requests',
                  },
                  {
                    key: 'attendanceAlerts',
                    label: 'Attendance Alerts',
                    description: 'Alerts for check-in/check-out reminders',
                  },
                  {
                    key: 'payrollNotifications',
                    label: 'Payroll Notifications',
                    description: 'Notifications about salary and payslips',
                  },
                  {
                    key: 'announcements',
                    label: 'Announcements',
                    description: 'Company-wide announcements and updates',
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={notificationSettings[item.key]}
                      onChange={() => handleNotificationChange(item.key)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Change Password
              </h2>
              <form onSubmit={passwordFormik.handleSubmit} className="space-y-4 max-w-md">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordFormik.values.currentPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={passwordFormik.errors.currentPassword}
                  touched={passwordFormik.touched.currentPassword}
                />
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={passwordFormik.errors.newPassword}
                  touched={passwordFormik.touched.newPassword}
                />
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={passwordFormik.errors.confirmPassword}
                  touched={passwordFormik.touched.confirmPassword}
                />
                <div className="pt-4">
                  <Button type="submit" variant="primary" loading={loading}>
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeSection === 'language' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Language & Region
              </h2>
              <div className="space-y-6 max-w-md">
                <Select
                  label="Language"
                  options={[
                    { value: 'en', label: 'English (US)' },
                    { value: 'en-gb', label: 'English (UK)' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' },
                    { value: 'ja', label: 'Japanese' },
                  ]}
                  value="en"
                  onChange={() => toast.success('Language preference saved')}
                />
                <Select
                  label="Date Format"
                  options={[
                    { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
                    { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
                    { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
                  ]}
                  value="mm/dd/yyyy"
                  onChange={() => toast.success('Date format preference saved')}
                />
                <Select
                  label="Time Zone"
                  options={[
                    { value: 'utc', label: 'UTC' },
                    { value: 'est', label: 'Eastern Time (US & Canada)' },
                    { value: 'pst', label: 'Pacific Time (US & Canada)' },
                    { value: 'gmt', label: 'London (GMT)' },
                    { value: 'ist', label: 'India Standard Time' },
                  ]}
                  value="utc"
                  onChange={() => toast.success('Timezone preference saved')}
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
