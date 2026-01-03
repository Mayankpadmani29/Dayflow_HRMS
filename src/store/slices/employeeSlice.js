import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  employees: [],
  employee: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

export const getEmployees = createAsyncThunk(
  'employees/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/employees', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees')
    }
  }
)

export const getEmployee = createAsyncThunk(
  'employees/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/employees/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee')
    }
  }
)

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/employees', data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee')
    }
  }
)

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/employees/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee')
    }
  }
)

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/employees/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee')
    }
  }
)

export const getEmployeeStats = createAsyncThunk(
  'employees/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/employees/stats')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats')
    }
  }
)

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearEmployee: (state) => {
      state.employee = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getEmployees.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false
        state.employees = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get One
      .addCase(getEmployee.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.loading = false
        state.employee = action.payload.data
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create
      .addCase(createEmployee.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false
        state.employees.unshift(action.payload.data)
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false
        state.employee = action.payload.data
        const index = state.employees.findIndex((e) => e._id === action.payload.data._id)
        if (index !== -1) {
          state.employees[index] = action.payload.data
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false
        state.employees = state.employees.filter((e) => e._id !== action.payload)
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Stats
      .addCase(getEmployeeStats.pending, (state) => {
        state.loading = true
      })
      .addCase(getEmployeeStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload.data
      })
      .addCase(getEmployeeStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearEmployee, clearError } = employeeSlice.actions
export default employeeSlice.reducer
