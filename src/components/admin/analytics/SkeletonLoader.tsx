interface SkeletonLoaderProps {
  className?: string
}

export function KPICardSkeleton({ className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        {/* Label skeleton */}
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />

        {/* Value skeleton */}
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />

        {/* Chart skeleton */}
        <div className="h-10 bg-gray-100 rounded animate-pulse" />

        {/* Trend text skeleton */}
        <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

export function FunnelChartSkeleton({ className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {[100, 85, 70, 60].map((width, index) => (
        <div key={index} className="space-y-2">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Bar skeleton */}
          <div className="w-full bg-gray-100 rounded-lg h-10 p-1">
            <div
              className="h-8 bg-gray-200 rounded-md animate-pulse"
              style={{ width: `${width}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className = ''
}: SkeletonLoaderProps & { rows?: number; columns?: number }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header skeleton */}
      <div className="flex gap-4 pb-3 border-b border-gray-200">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 flex-1 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>

      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 flex-1 bg-gray-100 rounded animate-pulse"
              style={{ animationDelay: `${(rowIndex * columns + colIndex) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({
  height = 300,
  className = ''
}: SkeletonLoaderProps & { height?: number }) {
  return (
    <div
      className={`bg-gray-50 rounded-lg animate-pulse ${className}`}
      style={{ height: `${height}px` }}
    >
      <div className="h-full flex items-end justify-around p-6 gap-2">
        {/* Simulated bar chart */}
        {[60, 75, 85, 70, 90, 65, 80].map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-gray-200 rounded-t"
            style={{
              height: `${height}%`,
              animationDelay: `${index * 100}ms`
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function AlertSkeleton({ className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon skeleton */}
        <div className="h-5 w-5 bg-amber-200 rounded-full animate-pulse flex-shrink-0 mt-0.5" />

        <div className="flex-1 space-y-2">
          {/* Title skeleton */}
          <div className="h-4 w-40 bg-amber-200 rounded animate-pulse" />

          {/* Description skeleton */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-amber-100 rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-amber-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
