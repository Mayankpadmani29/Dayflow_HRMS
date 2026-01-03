import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ClockIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import Card, { StatCard } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { TableSkeleton } from '../../components/ui/Skeleton'
import {
  getMyAttendance,
  checkIn,
  checkOut,
  getAttendanceStats,
} from '../../store/slices/attendanceSlice'
import { formatDate, formatTime, calculateDuration } from '../../utils/helpers'
import toast from 'react-hot-toast'

const Attendance = () => {
  const dispatch = useDispatch()
  const { attendance, todayAttendance, stats, loading } = useSelector(
    (state) => state.attendance
  )
  const [currentTime, setCurrentTime] = useState(new Date())
  const [view, setView] = useState('list') // list or calendar

  useEffect(() => {
    dispatch(getMyAttendance())
    dispatch(getAttendanceStats())

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [dispatch])

  const handleCheckIn = async () => {
    const result = await dispatch(checkIn())
    if (checkIn.fulfilled.match(result)) {
      toast.success('Checked in successfully!')
    } else {
      toast.error(result.payload || 'Failed to check in')
    }
  }

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut())
    if (checkOut.fulfilled.match(result)) {
      toast.success('Checked out successfully!')
    } else {
      toast.error(result.payload || 'Failed to check out')
    }
  }

  const isCheckedIn = todayAttendance?.checkIn && !todayAttendance?.checkOut
  const isCheckedOut = todayAttendance?.checkIn && todayAttendance?.checkOut

  const getStatusBadge = (status) => {
    const variants = {
      present: 'success',
      absent: 'danger',
      late: 'warning',
      'half-day': 'info',
      holiday: 'secondary',
      weekend: 'secondary',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your daily attendance and work hours
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('list')}
          >
            List View
          </Button>
          <Button
            variant={view === 'calendar' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('calendar')}
          >
            Calendar
          </Button>
        </div>
      </div>

      {/* Today's Status */}
      <Card className="p-6 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left text-white">
            <p className="text-sm opacity-80">Today's Date</p>
            <p className="text-2xl font-bold">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-4xl font-mono mt-2">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            {!todayAttendance?.checkIn ? (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleCheckIn}
                loading={loading}
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                <ClockIcon className="w-5 h-5 mr-2" />
                Check In
              </Button>
            ) : !todayAttendance?.checkOut ? (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleCheckOut}
                loading={loading}
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                <ClockIcon className="w-5 h-5 mr-2" />
                Check Out
              </Button>
            ) : (
              <div className="text-center text-white">
                <p className="text-sm opacity-80">Today's Work</p>
                <p className="text-2xl font-bold">
                  {calculateDuration(todayAttendance.checkIn, todayAttendance.checkOut)}
                </p>
              </div>
            )}
            {todayAttendance?.checkIn && (
              <div className="flex gap-6 text-white text-sm">
                <div className="text-center">
                  <p className="opacity-80">Check In</p>
                  <p className="font-semibold">{formatTime(todayAttendance.checkIn)}</p>
                </div>
                {todayAttendance?.checkOut && (
                  <div className="text-center">
                    <p className="opacity-80">Check Out</p>
                    <p className="font-semibold">{formatTime(todayAttendance.checkOut)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Present Days"
          value={stats?.presentDays || 0}
          icon={CalendarDaysIcon}
          trend={{ value: 95, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Absent Days"
          value={stats?.absentDays || 0}
          icon={CalendarDaysIcon}
          color="red"
        />
        <StatCard
          title="Late Days"
          value={stats?.lateDays || 0}
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="Avg. Work Hours"
          value={stats?.avgWorkHours || '0h'}
          icon={ChartBarIcon}
          color="blue"
        />
      </div>

      {/* Attendance Records */}
      {view === 'list' ? (
        loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <Card>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Work Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length > 0 ? (
                    attendance.map((record) => (
                      <tr key={record._id}>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.checkIn ? formatTime(record.checkIn) : '-'}</td>
                        <td>{record.checkOut ? formatTime(record.checkOut) : '-'}</td>
                        <td>
                          {record.checkIn && record.checkOut
                            ? calculateDuration(record.checkIn, record.checkOut)
                            : '-'}
                        </td>
                        <td>{getStatusBadge(record.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : (
        <Card className="p-6">
          <CalendarView attendance={attendance} />
        </Card>
      )}
    </div>
  )
}

// Calendar View Component
const CalendarView = ({ attendance }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const getAttendanceForDay = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return attendance.find((record) => {
      const recordDate = new Date(record.date)
      return recordDate.toDateString() === date.toDateString()
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      present: 'bg-green-500',
      absent: 'bg-red-500',
      late: 'bg-yellow-500',
      'half-day': 'bg-blue-500',
      holiday: 'bg-gray-300',
      weekend: 'bg-gray-200',
    }
    return colors[status] || 'bg-gray-100'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
              )
            }
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            ←
          </button>
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
              )
            }
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}

        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {days.map((day) => {
          const record = getAttendanceForDay(day)
          const isToday =
            new Date().toDateString() ===
            new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString()

          return (
            <div
              key={day}
              className={`aspect-square p-2 rounded-lg border ${
                isToday
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">{day}</div>
              {record && (
                <div
                  className={`w-2 h-2 rounded-full mt-1 ${getStatusColor(record.status)}`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6">
        {['present', 'absent', 'late', 'half-day'].map((status) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Attendance
