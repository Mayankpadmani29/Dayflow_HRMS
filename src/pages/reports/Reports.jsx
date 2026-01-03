import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import Card, { StatCard } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import { formatCurrency } from '../../utils/helpers'

const Reports = () => {
  const { user } = useSelector((state) => state.auth)
  const [reportType, setReportType] = useState('overview')
  const [period, setPeriod] = useState('monthly')

  const isHRorAdmin = user?.role === 'hr' || user?.role === 'admin'

  // Sample data - In production, this would come from API
  const overviewStats = {
    totalEmployees: 156,
    activeEmployees: 148,
    onLeave: 8,
    newHires: 12,
  }

  const attendanceData = [
    { month: 'Jan', present: 92, absent: 5, late: 3 },
    { month: 'Feb', present: 95, absent: 3, late: 2 },
    { month: 'Mar', present: 88, absent: 8, late: 4 },
    { month: 'Apr', present: 94, absent: 4, late: 2 },
    { month: 'May', present: 90, absent: 6, late: 4 },
    { month: 'Jun', present: 93, absent: 5, late: 2 },
  ]

  const departmentDistribution = [
    { name: 'Engineering', value: 45, color: '#6366f1' },
    { name: 'Design', value: 20, color: '#f59e0b' },
    { name: 'Marketing', value: 25, color: '#10b981' },
    { name: 'Sales', value: 35, color: '#ef4444' },
    { name: 'HR', value: 15, color: '#8b5cf6' },
    { name: 'Finance', value: 16, color: '#06b6d4' },
  ]

  const payrollTrend = [
    { month: 'Jan', amount: 450000 },
    { month: 'Feb', amount: 465000 },
    { month: 'Mar', amount: 478000 },
    { month: 'Apr', amount: 485000 },
    { month: 'May', amount: 492000 },
    { month: 'Jun', amount: 510000 },
  ]

  const leaveStats = [
    { type: 'Casual', taken: 125, remaining: 175 },
    { type: 'Sick', taken: 85, remaining: 215 },
    { type: 'Annual', taken: 180, remaining: 320 },
    { type: 'Others', taken: 45, remaining: 155 },
  ]

  const employeeGrowth = [
    { month: 'Jan', employees: 140 },
    { month: 'Feb', employees: 145 },
    { month: 'Mar', employees: 148 },
    { month: 'Apr', employees: 152 },
    { month: 'May', employees: 155 },
    { month: 'Jun', employees: 156 },
  ]

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  const reportTypes = [
    { value: 'overview', label: 'Overview' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'leaves', label: 'Leaves' },
  ]

  const periods = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ]

  if (!isHRorAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-8 text-center">
          <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Reports are only accessible to HR and Admin users.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Comprehensive insights into your organization
          </p>
        </div>
        <Button variant="primary" icon={ArrowDownTrayIcon}>
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="w-40">
            <Select
              options={reportTypes}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            />
          </div>
          <div className="w-32">
            <Select
              options={periods}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={overviewStats.totalEmployees}
          icon={UsersIcon}
          trend={{ value: 8, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Active Employees"
          value={overviewStats.activeEmployees}
          icon={UsersIcon}
          trend={{ value: 5, isPositive: true }}
          color="green"
        />
        <StatCard
          title="On Leave"
          value={overviewStats.onLeave}
          icon={CalendarDaysIcon}
          color="yellow"
        />
        <StatCard
          title="New Hires (This Month)"
          value={overviewStats.newHires}
          icon={UsersIcon}
          trend={{ value: 20, isPositive: true }}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Attendance Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Department Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Payroll Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payroll Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={payrollTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => [formatCurrency(value), 'Amount']}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                fill="url(#colorAmount)"
              />
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Leave Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Leave Statistics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="type" type="category" stroke="#9ca3af" width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="taken" name="Taken" fill="#ef4444" radius={[0, 4, 4, 0]} />
              <Bar dataKey="remaining" name="Remaining" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Employee Growth */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Employee Growth
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={employeeGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Line
              type="monotone"
              dataKey="employees"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Stats Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Department Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Department
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Employees
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg. Attendance
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg. Salary
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {departmentDistribution.map((dept) => (
                <tr key={dept.name} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {dept.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{dept.value}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {Math.floor(Math.random() * 10) + 90}%
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {formatCurrency(Math.floor(Math.random() * 30000) + 50000)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.floor(Math.random() * 20) + 80}%`,
                            backgroundColor: dept.color,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.floor(Math.random() * 20) + 80}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Reports
