import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { forgotPassword } from '../../store/slices/authSlice'
import { forgotPasswordSchema } from '../../utils/validations'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      const result = await dispatch(forgotPassword(values.email))
      if (forgotPassword.fulfilled.match(result)) {
        setEmailSent(true)
        toast.success('Password reset email sent!')
      } else {
        toast.error(result.payload || 'Failed to send reset email')
      }
    },
  })

  if (emailSent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          We've sent a password reset link to your email address.
        </p>
        <Link
          to="/signin"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot password?</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          No worries, we'll send you reset instructions.
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

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
        >
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Remember your password?{' '}
        <Link to="/signin" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default ForgotPassword
