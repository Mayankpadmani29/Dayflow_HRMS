import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import Spinner from '../../components/ui/Spinner'

const VerifyEmail = () => {
  const { token } = useParams()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`)
        setStatus('success')
        setMessage(response.data.message)
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Email verification failed')
      }
    }

    verifyEmail()
  }, [token])

  if (status === 'loading') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Verifying your email...
        </h2>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          status === 'success'
            ? 'bg-green-100 dark:bg-green-900/30'
            : 'bg-red-100 dark:bg-red-900/30'
        }`}
      >
        {status === 'success' ? (
          <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
        ) : (
          <XCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
        )}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
      <Link
        to="/signin"
        className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        {status === 'success' ? 'Continue to Sign In' : 'Back to Sign In'}
      </Link>
    </div>
  )
}

export default VerifyEmail
