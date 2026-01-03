import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

export const getNotifications = createAsyncThunk(
  'notifications/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications')
    }
  }
)

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/notifications/${id}/read`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read')
    }
  }
)

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put('/notifications/read-all')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read')
    }
  }
)

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification')
    }
  }
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload.data
        state.unreadCount = action.payload.unreadCount
        state.pagination = action.payload.pagination
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n._id === action.payload.data._id)
        if (index !== -1) {
          state.notifications[index] = action.payload.data
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      // Mark All as Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }))
        state.unreadCount = 0
      })
      // Delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n._id === action.payload)
        state.notifications = state.notifications.filter((n) => n._id !== action.payload)
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
  },
})

export const { clearError } = notificationSlice.actions
export default notificationSlice.reducer
