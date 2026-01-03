import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  leaves: [],
  leave: null,
  leaveBalance: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

export const applyLeave = createAsyncThunk(
  'leaves/apply',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/leaves', data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply leave')
    }
  }
)

export const getMyLeaves = createAsyncThunk(
  'leaves/getMy',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaves/my', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaves')
    }
  }
)

export const getAllLeaves = createAsyncThunk(
  'leaves/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaves', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaves')
    }
  }
)

export const getLeave = createAsyncThunk(
  'leaves/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/leaves/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave')
    }
  }
)

export const updateLeaveStatus = createAsyncThunk(
  'leaves/updateStatus',
  async ({ id, status, approverComments }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/leaves/${id}/status`, { status, approverComments })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update leave status')
    }
  }
)

export const cancelLeave = createAsyncThunk(
  'leaves/cancel',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/leaves/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel leave')
    }
  }
)

export const getLeaveStats = createAsyncThunk(
  'leaves/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaves/stats')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats')
    }
  }
)

export const getLeaveBalance = createAsyncThunk(
  'leaves/getBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaves/balance')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave balance')
    }
  }
)

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    clearLeave: (state) => {
      state.leave = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply Leave
      .addCase(applyLeave.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.loading = false
        state.leaves.unshift(action.payload.data)
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get My Leaves
      .addCase(getMyLeaves.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMyLeaves.fulfilled, (state, action) => {
        state.loading = false
        state.leaves = action.payload.data || []
        if (action.payload.leaveBalance) {
          state.leaveBalance = action.payload.leaveBalance
        }
      })
      .addCase(getMyLeaves.rejected, (state, action) => {
        state.loading = false
        state.leaves = []
        state.error = action.payload
      })
      // Get All Leaves
      .addCase(getAllLeaves.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllLeaves.fulfilled, (state, action) => {
        state.loading = false
        state.leaves = action.payload.data || []
        state.pagination = action.payload.pagination || { total: 0, page: 1, pages: 1 }
      })
      .addCase(getAllLeaves.rejected, (state, action) => {
        state.loading = false
        state.leaves = []
        state.error = action.payload
      })
      // Get One Leave
      .addCase(getLeave.pending, (state) => {
        state.loading = true
      })
      .addCase(getLeave.fulfilled, (state, action) => {
        state.loading = false
        state.leave = action.payload.data
      })
      .addCase(getLeave.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Status
      .addCase(updateLeaveStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.leaves.findIndex((l) => l._id === action.payload.data._id)
        if (index !== -1) {
          state.leaves[index] = action.payload.data
        }
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Cancel Leave
      .addCase(cancelLeave.pending, (state) => {
        state.loading = true
      })
      .addCase(cancelLeave.fulfilled, (state, action) => {
        state.loading = false
        state.leaves = state.leaves.filter((l) => l._id !== action.payload)
      })
      .addCase(cancelLeave.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Stats
      .addCase(getLeaveStats.pending, (state) => {
        state.loading = true
      })
      .addCase(getLeaveStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload.data
      })
      .addCase(getLeaveStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Leave Balance
      .addCase(getLeaveBalance.pending, (state) => {
        // Don't set loading for balance - let page render
      })
      .addCase(getLeaveBalance.fulfilled, (state, action) => {
        state.leaveBalance = action.payload.data
      })
      .addCase(getLeaveBalance.rejected, (state, action) => {
        // Set default balance on error
        state.leaveBalance = {
          casual: { total: 12, used: 0, remaining: 12 },
          sick: { total: 10, used: 0, remaining: 10 },
          annual: { total: 15, used: 0, remaining: 15 },
          paid: { total: 20, used: 0, remaining: 20 },
        }
      })
  },
})

export const { clearLeave, clearError } = leaveSlice.actions
export default leaveSlice.reducer
