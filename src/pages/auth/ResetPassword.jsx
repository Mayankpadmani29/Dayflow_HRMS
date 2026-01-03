import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { resetPassword, clearError } from '../../store/slices/authSlice'
import { resetPasswordSchema } from '../../utils/validations'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const ResetPassword = () => {
  const { token } = useParams()
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
      toast.success('Password reset successful!')
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: (values) => {
      dispatch(resetPassword({ token, password: values.password }))
    },
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset your password</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <Input
          label="New Password"
          name="password"
          type="password"
          placeholder="Enter new password"
          icon={LockClosedIcon}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
          required
        />

        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          icon={LockClosedIcon}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
          required
        />

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
        >
          Reset Password
        </Button>
      </form>
    </div>
  )
}

export default ResetPassword
