const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div
      className={`${sizes[size]} border-gray-200 dark:border-gray-700 rounded-full animate-spin border-t-primary-600 dark:border-t-primary-400 ${className}`}
    ></div>
  )
}

export default Spinner
