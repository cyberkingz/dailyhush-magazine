interface SkeletonLoaderProps {
  className?: string
}

export function KPICardSkeleton({ className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-6 ${className}`}>
      <div className="space-y-4">
        {/* Label skeleton */}
        <div className="h-4 w-32 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] backdrop-saturate-[140%] rounded-[8px] animate-pulse" />

        {/* Value skeleton */}
        <div className="h-10 w-24 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] backdrop-saturate-[140%] rounded-[8px] animate-pulse" />

        {/* Chart skeleton */}
        <div className="h-10 bg-[hsla(200,10%,60%,0.18)] backdrop-blur-[8px] backdrop-saturate-[140%] rounded-[8px] animate-pulse" />

        {/* Trend text skeleton */}
        <div className="h-3 w-40 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] backdrop-saturate-[140%] rounded-[8px] animate-pulse" />
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
            <div className="h-4 w-32 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] backdrop-saturate-[140%] rounded-[8px] animate-pulse" />
            <div className="h-4 w-16 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] backdrop-saturate-[140%] rounded-[8px] animate-pulse" />
          </div>

          {/* Bar skeleton */}
          <div className="w-full bg-emerald-500/10 backdrop-blur-[8px] backdrop-saturate-[140%] rounded-[12px] border border-emerald-500/20 h-10 p-1">
            <div
              className="h-8 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 backdrop-blur-[4px] rounded-[8px] animate-pulse"
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
      <div className="flex gap-4 pb-3 border-b-2 border-[hsla(200,16%,80%,0.18)]">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 flex-1 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] backdrop-saturate-[140%] rounded-[8px] animate-pulse" />
        ))}
      </div>

      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 flex-1 bg-[hsla(200,10%,60%,0.18)] backdrop-blur-[8px] backdrop-saturate-[140%] rounded-[8px] animate-pulse"
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
      className={`bg-[hsla(200,10%,60%,0.18)] backdrop-blur-[16px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1)] animate-pulse ${className}`}
      style={{ height: `${height}px` }}
    >
      <div className="h-full flex items-end justify-around p-6 gap-2">
        {/* Simulated bar chart */}
        {[60, 75, 85, 70, 90, 65, 80].map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-emerald-500/30 backdrop-blur-[8px] rounded-t-[8px] animate-pulse"
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
    <div className={`bg-amber-500/10 backdrop-blur-[16px] backdrop-saturate-[140%] border border-amber-500/20 rounded-[12px] shadow-[0_4px_8px_rgba(245,158,11,0.1)] p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon skeleton */}
        <div className="h-5 w-5 bg-amber-500/30 backdrop-blur-[8px] rounded-full animate-pulse flex-shrink-0 mt-0.5" />

        <div className="flex-1 space-y-2">
          {/* Title skeleton */}
          <div className="h-4 w-40 bg-amber-500/30 backdrop-blur-[8px] rounded-[8px] animate-pulse" />

          {/* Description skeleton */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-amber-500/20 backdrop-blur-[8px] rounded-[8px] animate-pulse" />
            <div className="h-3 w-3/4 bg-amber-500/20 backdrop-blur-[8px] rounded-[8px] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
