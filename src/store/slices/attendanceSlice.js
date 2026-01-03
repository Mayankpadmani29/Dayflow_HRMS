import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  attendance: [],
  todayAttendance: null,
  summary: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/check-in')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-in failed')
    }
  }
)

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/check-out')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-out failed')
    }
  }
)

export const getMyAttendance = createAsyncThunk(
  'attendance/getMy',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/my', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance')
    }
  }
)

export const getTodayAttendance = createAsyncThunk(
  'attendance/getToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/today')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today attendance')
    }
  }
)

export const getAllAttendance = createAsyncThunk(
  'attendance/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance')
    }
  }
)

export const getAttendanceStats = createAsyncThunk(
  'attendance/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/stats')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats')
    }
  }
)

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Check In
      .addCase(checkIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false
        state.todayAttendance = action.payload.data
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Check Out
      .addCase(checkOut.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false
        state.todayAttendance = action.payload.data
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get My Attendance
      .addCase(getMyAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMyAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.attendance = action.payload.data
        state.summary = action.payload.summary
      })
      .addCase(getMyAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Today Attendance
      .addCase(getTodayAttendance.pending, (state) => {
        state.loading = true
      })
      .addCase(getTodayAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.todayAttendance = action.payload.data
      })
      .addCase(getTodayAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get All Attendance
      .addCase(getAllAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.attendance = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Stats
      .addCase(getAttendanceStats.pending, (state) => {
        state.loading = true
      })
      .addCase(getAttendanceStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload.data
      })
      .addCase(getAttendanceStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = attendanceSlice.actions
export default attendanceSlice.reducer
