import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { login, clearError } from '../../store/slices/authSlice'
import { loginSchema } from '../../utils/validations'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const SignIn = () => {
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
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(login(values))
    },
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">D</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">Dayflow</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
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

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          icon={LockClosedIcon}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default SignIn
