import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BellIcon,
  CheckCircleIcon,
  TrashIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
} from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { CardSkeleton } from '../../components/ui/Skeleton'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../store/slices/notificationSlice'
import { formatRelativeTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

const Notifications = () => {
  const dispatch = useDispatch()
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    dispatch(getNotifications())
  }, [dispatch])

  const handleMarkAsRead = async (id) => {
    const result = await dispatch(markAsRead(id))
    if (markAsRead.fulfilled.match(result)) {
      toast.success('Marked as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    const result = await dispatch(markAllAsRead())
    if (markAllAsRead.fulfilled.match(result)) {
      toast.success('All notifications marked as read')
    }
  }

  const handleDelete = async (id) => {
    const result = await dispatch(deleteNotification(id))
    if (deleteNotification.fulfilled.match(result)) {
      toast.success('Notification deleted')
    }
  }

  const getTypeIcon = (type) => {
    const icons = {
      info: '📢',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      leave: '📅',
      attendance: '⏰',
      payroll: '💰',
      announcement: '📣',
    }
    return icons[type] || '📢'
  }

  const getTypeBadge = (type) => {
    const variants = {
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'danger',
      leave: 'purple',
      attendance: 'blue',
      payroll: 'green',
      announcement: 'primary',
    }
    return <Badge variant={variants[type] || 'secondary'}>{type}</Badge>
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.isRead
    return notification.type === filter
  })

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: `Unread (${unreadCount})` },
    { value: 'leave', label: 'Leaves' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'announcement', label: 'Announcements' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Stay updated with the latest activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            icon={CheckCircleIcon}
            onClick={handleMarkAllAsRead}
            loading={loading}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification._id}
              className={`p-4 transition-all ${
                !notification.isRead
                  ? 'border-l-4 border-l-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                  : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl flex-shrink-0">{getTypeIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        {getTypeBadge(notification.type)}
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{notification.message}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <EnvelopeOpenIcon className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <EmptyState
            icon={BellIcon}
            title="No notifications"
            description={
              filter === 'all'
                ? "You're all caught up! No new notifications."
                : `No ${filter === 'unread' ? 'unread' : filter} notifications found.`
            }
          />
        </Card>
      )}
    </div>
  )
}

export default Notifications
