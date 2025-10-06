import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

interface TrendData {
  value: number
  isPositive: boolean
  label: string
}

interface ProgressData {
  current: number
  target: number
  label: string
}

interface AlertData {
  threshold: number
  message: string
  type: 'warning' | 'error' | 'success'
}

type MetricsCardProps = {
  label: string
  value: string | number
  className?: string
} & (
  | { variant: 'single' }
  | { variant: 'trend'; trend: TrendData }
  | { variant: 'progress'; progress: ProgressData }
  | { variant: 'alert'; alert: AlertData }
)

export function MetricsCard(props: MetricsCardProps) {
  const { label, value, className = '' } = props

  const baseClasses = 'bg-white rounded-lg border border-gray-200 p-6 transition-all hover:shadow-md'

  return (
    <div className={`${baseClasses} ${className}`}>
      {/* Label */}
      <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>

      {/* Value */}
      <div className="text-3xl font-bold text-gray-900 mb-3">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      {/* Variant-specific content */}
      {props.variant === 'trend' && (
        <div className={`flex items-center gap-1 text-sm ${props.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {props.trend.isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="font-semibold">
            {props.trend.isPositive ? '+' : ''}{props.trend.value}%
          </span>
          <span className="text-gray-500 ml-1">{props.trend.label}</span>
        </div>
      )}

      {props.variant === 'progress' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{props.progress.label}</span>
            <span className="font-medium">
              {props.progress.current} / {props.progress.target}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((props.progress.current / props.progress.target) * 100, 100)}%`
              }}
            />
          </div>
        </div>
      )}

      {props.variant === 'alert' && (
        <div className={`flex items-start gap-2 p-3 rounded-md ${
          props.alert.type === 'error'
            ? 'bg-red-50 border border-red-200'
            : props.alert.type === 'warning'
            ? 'bg-amber-50 border border-amber-200'
            : 'bg-green-50 border border-green-200'
        }`}>
          <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
            props.alert.type === 'error'
              ? 'text-red-600'
              : props.alert.type === 'warning'
              ? 'text-amber-600'
              : 'text-green-600'
          }`} />
          <div className="flex-1">
            <div className={`text-xs font-medium ${
              props.alert.type === 'error'
                ? 'text-red-900'
                : props.alert.type === 'warning'
                ? 'text-amber-900'
                : 'text-green-900'
            }`}>
              {props.alert.message}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
