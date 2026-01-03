import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  payrolls: [],
  payroll: null,
  payrollDetails: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

export const getMyPayroll = createAsyncThunk(
  'payroll/getMy',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/payroll/my', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll')
    }
  }
)

export const getPayrollSlip = createAsyncThunk(
  'payroll/getSlip',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payroll/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll slip')
    }
  }
)

export const getAllPayroll = createAsyncThunk(
  'payroll/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/payroll', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll')
    }
  }
)

export const generatePayroll = createAsyncThunk(
  'payroll/generate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/payroll/generate', data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate payroll')
    }
  }
)

export const updatePayroll = createAsyncThunk(
  'payroll/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/payroll/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payroll')
    }
  }
)

export const processPayroll = createAsyncThunk(
  'payroll/process',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/payroll/${id}/process`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process payroll')
    }
  }
)

export const getPayrollStats = createAsyncThunk(
  'payroll/getStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/payroll/stats', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats')
    }
  }
)

export const getPayrollDetails = createAsyncThunk(
  'payroll/getDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payroll/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll details')
    }
  }
)

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    clearPayroll: (state) => {
      state.payroll = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get My Payroll
      .addCase(getMyPayroll.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMyPayroll.fulfilled, (state, action) => {
        state.loading = false
        state.payrolls = action.payload.data
      })
      .addCase(getMyPayroll.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Payroll Slip
      .addCase(getPayrollSlip.pending, (state) => {
        state.loading = true
      })
      .addCase(getPayrollSlip.fulfilled, (state, action) => {
        state.loading = false
        state.payroll = action.payload.data
      })
      .addCase(getPayrollSlip.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get All Payroll
      .addCase(getAllPayroll.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllPayroll.fulfilled, (state, action) => {
        state.loading = false
        state.payrolls = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(getAllPayroll.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Generate Payroll
      .addCase(generatePayroll.pending, (state) => {
        state.loading = true
      })
      .addCase(generatePayroll.fulfilled, (state, action) => {
        state.loading = false
        state.payrolls = [...action.payload.data, ...state.payrolls]
      })
      .addCase(generatePayroll.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Payroll
      .addCase(updatePayroll.pending, (state) => {
        state.loading = true
      })
      .addCase(updatePayroll.fulfilled, (state, action) => {
        state.loading = false
        const index = state.payrolls.findIndex((p) => p._id === action.payload.data._id)
        if (index !== -1) {
          state.payrolls[index] = action.payload.data
        }
      })
      .addCase(updatePayroll.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Process Payroll
      .addCase(processPayroll.pending, (state) => {
        state.loading = true
      })
      .addCase(processPayroll.fulfilled, (state, action) => {
        state.loading = false
        const index = state.payrolls.findIndex((p) => p._id === action.payload.data._id)
        if (index !== -1) {
          state.payrolls[index] = action.payload.data
        }
      })
      .addCase(processPayroll.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Stats
      .addCase(getPayrollStats.pending, (state) => {
        state.loading = true
      })
      .addCase(getPayrollStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload.data
      })
      .addCase(getPayrollStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Payroll Details
      .addCase(getPayrollDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(getPayrollDetails.fulfilled, (state, action) => {
        state.loading = false
        state.payrollDetails = action.payload.data
      })
      .addCase(getPayrollDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearPayroll, clearError } = payrollSlice.actions
export default payrollSlice.reducer
