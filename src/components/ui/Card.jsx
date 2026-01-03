import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = false, onClick }) => {
  const Component = onClick ? motion.div : 'div'

  const props = onClick
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick,
        className: `${hover ? 'card-hover cursor-pointer' : 'card'} ${className}`,
      }
    : {
        className: `${hover ? 'card-hover' : 'card'} ${className}`,
      }

  return <Component {...props}>{children}</Component>
}

export const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  changeType === 'increase'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {changeType === 'increase' ? '+' : '-'}{change}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default Card
