import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import employeeReducer from './slices/employeeSlice'
import attendanceReducer from './slices/attendanceSlice'
import leaveReducer from './slices/leaveSlice'
import payrollReducer from './slices/payrollSlice'
import notificationReducer from './slices/notificationSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    attendance: attendanceReducer,
    leaves: leaveReducer,
    payroll: payrollReducer,
    notifications: notificationReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
