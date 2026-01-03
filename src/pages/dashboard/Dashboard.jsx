import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  UserGroupIcon,
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { StatCard } from '../../components/ui/Card'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { getTodayAttendance, getAttendanceStats } from '../../store/slices/attendanceSlice'
import { getLeaveStats, getMyLeaves } from '../../store/slices/leaveSlice'
import { getEmployeeStats } from '../../store/slices/employeeSlice'
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { todayAttendance, stats: attendanceStats, loading: attendanceLoading } = useSelector(
    (state) => state.attendance
  )
  const { leaves, leaveBalance, stats: leaveStats, loading: leaveLoading } = useSelector(
    (state) => state.leaves
  )
  const { stats: employeeStats, loading: employeeLoading } = useSelector(
    (state) => state.employees
  )

  const isAdmin = user?.role === 'admin' || user?.role === 'hr'

  useEffect(() => {
    dispatch(getTodayAttendance())
    dispatch(getMyLeaves())
    if (isAdmin) {
      dispatch(getAttendanceStats())
      dispatch(getLeaveStats())
      dispatch(getEmployeeStats())
    }
  }, [dispatch, isAdmin])

  const attendanceChartData = [
    { name: 'Mon', present: 45, absent: 5 },
    { name: 'Tue', present: 48, absent: 2 },
    { name: 'Wed', present: 47, absent: 3 },
    { name: 'Thu', present: 44, absent: 6 },
    { name: 'Fri', present: 46, absent: 4 },
  ]

  const leaveTypesData = [
    { name: 'Paid', value: 40, color: '#22c55e' },
    { name: 'Sick', value: 25, color: '#f59e0b' },
    { name: 'Casual', value: 20, color: '#3b82f6' },
    { name: 'Unpaid', value: 15, color: '#ef4444' },
  ]

  const monthlyTrendData = [
    { month: 'Jan', employees: 42 },
    { month: 'Feb', employees: 45 },
    { month: 'Mar', employees: 48 },
    { month: 'Apr', employees: 47 },
    { month: 'May', employees: 50 },
    { month: 'Jun', employees: 52 },
  ]

  // Employee Dashboard
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-primary-100 mt-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Avatar
              name={`${user?.firstName} ${user?.lastName}`}
              src={user?.avatar}
              size="xl"
              className="border-4 border-white/20"
            />
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today's Status"
            value={todayAttendance?.status ? 'Checked In' : 'Not Checked In'}
            icon={ClockIcon}
            color={todayAttendance?.checkIn ? 'success' : 'warning'}
          />
          <StatCard
            title="Pending Leaves"
            value={leaves?.filter((l) => l.status === 'pending').length || 0}
            icon={CalendarDaysIcon}
            color="info"
          />
          <StatCard
            title="Leave Balance"
            value={leaveBalance?.paid?.remaining || 20}
            icon={CheckCircleIcon}
            color="success"
          />
          <StatCard
            title="This Month Attendance"
            value="22 / 25 days"
            icon={ArrowTrendingUpIcon}
            color="primary"
          />
        </div>

        {/* Attendance & Leave Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Attendance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Attendance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <ClockIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Check In</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {todayAttendance?.checkIn
                        ? new Date(todayAttendance.checkIn).toLocaleTimeString()
                        : 'Not checked in'}
                    </p>
                  </div>
                </div>
                {todayAttendance?.checkIn && (
                  <Badge variant="success">Done</Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <ClockIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Check Out</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {todayAttendance?.checkOut
                        ? new Date(todayAttendance.checkOut).toLocaleTimeString()
                        : 'Not checked out'}
                    </p>
                  </div>
                </div>
                {todayAttendance?.checkOut && (
                  <Badge variant="success">Done</Badge>
                )}
              </div>

              {todayAttendance?.workHours && (
                <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Work Hours</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {todayAttendance.workHours.toFixed(2)} hrs
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Leave Requests */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Leave Requests
            </h3>
            <div className="space-y-3">
              {leaves?.slice(0, 4).map((leave) => (
                <div
                  key={leave._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {leave.leaveType} Leave
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                    </p>
                  </div>
                  <Badge variant={leave.status === 'approved' ? 'success' : leave.status === 'pending' ? 'warning' : 'danger'}>
                    {leave.status}
                  </Badge>
                </div>
              ))}
              {(!leaves || leaves.length === 0) && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No leave requests
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Leave Balance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Leave Balance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['paid', 'sick', 'casual'].map((type) => (
              <div
                key={type}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">
                  {type} Leave
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leaveBalance?.[type]?.remaining || 0}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    / {leaveBalance?.[type]?.total || 0}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{
                      width: `${
                        ((leaveBalance?.[type]?.remaining || 0) /
                          (leaveBalance?.[type]?.total || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  // Admin/HR Dashboard
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back, {user?.firstName}! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {employeeLoading ? (
          Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Employees"
              value={employeeStats?.totalEmployees || 50}
              icon={UserGroupIcon}
              color="primary"
              change={12}
              changeType="increase"
            />
            <StatCard
              title="Present Today"
              value={attendanceStats?.today?.present || 45}
              icon={CheckCircleIcon}
              color="success"
            />
            <StatCard
              title="Pending Leaves"
              value={leaveStats?.pending || 5}
              icon={CalendarDaysIcon}
              color="warning"
            />
            <StatCard
              title="Total Payroll"
              value={formatCurrency(250000)}
              icon={CurrencyDollarIcon}
              color="info"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Attendance Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Leave Types Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Leave Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {leaveTypesData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Employee Trend & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Employee Growth Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pending Leave Requests */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Leave Requests
            </h3>
            <Badge variant="warning">{leaveStats?.pending || 5} Pending</Badge>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={`Employee ${i}`} size="sm" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Employee {i}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sick Leave • 2 days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                    <CheckCircleIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
