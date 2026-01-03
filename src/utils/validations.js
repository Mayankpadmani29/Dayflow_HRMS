import * as Yup from 'yup'

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export const registerSchema = Yup.object({
  employeeId: Yup.string()
    .min(3, 'Employee ID must be at least 3 characters')
    .required('Employee ID is required'),
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string()
    .oneOf(['employee', 'hr', 'admin'], 'Invalid role')
    .required('Role is required'),
})

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
})

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
})

export const leaveSchema = Yup.object({
  leaveType: Yup.string()
    .oneOf(['paid', 'sick', 'unpaid', 'casual'], 'Invalid leave type')
    .required('Leave type is required'),
  startDate: Yup.date()
    .min(new Date(), 'Start date cannot be in the past')
    .required('Start date is required'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'End date must be after start date')
    .required('End date is required'),
  reason: Yup.string()
    .min(10, 'Reason must be at least 10 characters')
    .required('Reason is required'),
})

export const employeeSchema = Yup.object({
  employeeId: Yup.string().required('Employee ID is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string(),
  department: Yup.string(),
  designation: Yup.string(),
  role: Yup.string().oneOf(['employee', 'hr', 'admin']),
})
