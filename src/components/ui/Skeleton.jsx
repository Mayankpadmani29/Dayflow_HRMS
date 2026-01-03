const Skeleton = ({ className = '', variant = 'text', width, height }) => {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={`skeleton ${variants[variant]} ${className}`}
      style={{ width, height }}
    ></div>
  )
}

export const CardSkeleton = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="space-y-2 flex-1">
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </div>
    </div>
    <Skeleton variant="rectangular" height={100} />
    <div className="flex gap-2">
      <Skeleton width={80} height={32} variant="rectangular" />
      <Skeleton width={80} height={32} variant="rectangular" />
    </div>
  </div>
)

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-2">
    {Array(rows)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
          {Array(cols)
            .fill(0)
            .map((_, j) => (
              <Skeleton key={j} className="flex-1" />
            ))}
        </div>
      ))}
  </div>
)

export default Skeleton
