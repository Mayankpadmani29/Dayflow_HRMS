import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 dark:bg-primary-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-gray-900"></div>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">D</span>
            </div>
            <span className="text-2xl font-bold text-white">Dayflow</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Human Resource Management System
          </h1>
          <p className="text-primary-100 text-lg">
            Streamline your HR operations with our comprehensive management solution.
            Manage employees, attendance, leaves, and payroll all in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400'].map((color, i) => (
                <div key={i} className={`w-10 h-10 ${color} rounded-full border-2 border-white`}></div>
              ))}
            </div>
            <p className="text-primary-100">
              Trusted by 1000+ companies worldwide
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}

export default AuthLayout
