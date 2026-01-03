import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin border-t-primary-600 dark:border-t-primary-400"></div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
