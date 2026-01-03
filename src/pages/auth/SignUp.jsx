import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline'
import { register, clearError } from '../../store/slices/authSlice'
import { registerSchema } from '../../utils/validations'
import Input from '../../components/ui/Input'
import { Select } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Registration successful!')
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const formik = useFormik({
    initialValues: {
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'employee',
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...userData } = values
      dispatch(register(userData))
    },
  })

  const roleOptions = [
    { value: 'employee', label: 'Employee' },
    { value: 'hr', label: 'HR' },
    { value: 'admin', label: 'Admin' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">D</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">Dayflow</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Get started with Dayflow HRMS
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Input
          label="Employee ID"
          name="employeeId"
          placeholder="Enter your employee ID"
          icon={IdentificationIcon}
          value={formik.values.employeeId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.employeeId}
          touched={formik.touched.employeeId}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            placeholder="First name"
            icon={UserIcon}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.firstName}
            touched={formik.touched.firstName}
            required
          />

          <Input
            label="Last Name"
            name="lastName"
            placeholder="Last name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.lastName}
            touched={formik.touched.lastName}
            required
          />
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          icon={EnvelopeIcon}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
          required
        />

        <Select
          label="Role"
          name="role"
          options={roleOptions}
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.role}
          touched={formik.touched.role}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password"
          icon={LockClosedIcon}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
          required
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          icon={LockClosedIcon}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/signin" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default SignUp
