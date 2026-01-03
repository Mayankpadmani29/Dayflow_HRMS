export const formatDate = (date, options = {}) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

export const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return `${formatDate(date)} ${formatTime(date)}`
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount || 0)
}

export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0) || ''
  const last = lastName?.charAt(0) || ''
  return `${first}${last}`.toUpperCase()
}

export const getStatusColor = (status) => {
  const colors = {
    present: 'badge-success',
    absent: 'badge-danger',
    'half-day': 'badge-warning',
    leave: 'badge-info',
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger',
    paid: 'badge-success',
    processed: 'badge-info',
  }
  return colors[status] || 'badge-info'
}

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str
  return `${str.substring(0, length)}...`
}

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const getMonthName = (month) => {
  return monthNames[month - 1] || ''
}

export const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate()
}

export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '0h 0m'
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diff = end - start
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

export const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = end - start
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const d = new Date(date)
  const diff = now - d
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export const isToday = (date) => {
  if (!date) return false
  const today = new Date()
  const d = new Date(date)
  return d.toDateString() === today.toDateString()
}

export const isWeekend = (date) => {
  const d = new Date(date)
  return d.getDay() === 0 || d.getDay() === 6
}

export const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
