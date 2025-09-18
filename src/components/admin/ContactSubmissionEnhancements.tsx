// Optional enhancements for the contact submission system
// These are suggestions for future improvements

import { useState, useCallback } from 'react'
import { Calendar, Download, RefreshCw } from 'lucide-react'
import { subscribeToContactSubmissions } from '@/lib/services/contact'

// Real-time notification hook
export function useContactSubmissionNotifications() {
  const [newSubmissions, setNewSubmissions] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)
  
  const subscribe = useCallback(() => {
    if (isSubscribed) return
    
    const unsubscribe = subscribeToContactSubmissions((payload) => {
      if (payload.eventType === 'INSERT') {
        setNewSubmissions(prev => prev + 1)
        // Could show toast notification here
      }
    })
    
    setIsSubscribed(true)
    
    return () => {
      unsubscribe()
      setIsSubscribed(false)
    }
  }, [isSubscribed])
  
  const clearNotifications = () => setNewSubmissions(0)
  
  return { newSubmissions, subscribe, clearNotifications }
}

// Date range picker component
interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onChange: (startDate?: Date, endDate?: Date) => void
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4 text-gray-400" />
      <input
        type="date"
        value={startDate?.toISOString().split('T')[0] || ''}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : undefined, endDate)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
      />
      <span className="text-gray-500">to</span>
      <input
        type="date"
        value={endDate?.toISOString().split('T')[0] || ''}
        onChange={(e) => onChange(startDate, e.target.value ? new Date(e.target.value) : undefined)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
      />
    </div>
  )
}

// Bulk actions component
interface BulkActionsProps {
  selectedIds: string[]
  onBulkStatusUpdate: (status: string) => Promise<void>
  onBulkExport: () => Promise<void>
}

export function BulkActions({ selectedIds, onBulkStatusUpdate, onBulkExport }: BulkActionsProps) {
  if (selectedIds.length === 0) return null
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-blue-800">
          {selectedIds.length} submission{selectedIds.length > 1 ? 's' : ''} selected
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <select
          onChange={(e) => e.target.value && onBulkStatusUpdate(e.target.value)}
          className="px-3 py-1 text-sm border border-blue-300 rounded bg-white"
          defaultValue=""
        >
          <option value="">Update Status...</option>
          <option value="in_progress">Mark In Progress</option>
          <option value="replied">Mark Replied</option>
          <option value="closed">Mark Closed</option>
        </select>
        <button
          onClick={onBulkExport}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Download className="w-4 h-4 inline mr-1" />
          Export Selected
        </button>
      </div>
    </div>
  )
}

// Auto-refresh component
interface AutoRefreshProps {
  onRefresh: () => Promise<void>
  intervalMs?: number
}

export function AutoRefresh({ onRefresh }: AutoRefreshProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }, [onRefresh])
  
  // Auto-refresh logic would go here with useEffect
  
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        title="Refresh data"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
      <label className="flex items-center text-sm">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          className="mr-2"
        />
        Auto-refresh
      </label>
    </div>
  )
}

// Toast notification system (would integrate with existing toast library)
export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  duration?: number
}

export function showToast(toast: Omit<Toast, 'id'>) {
  // Implementation would depend on existing toast system
  console.log('Toast:', toast)
}

// Usage examples:

// In ContactSubmissionTable:
// const { newSubmissions, subscribe, clearNotifications } = useContactSubmissionNotifications()
// 
// useEffect(() => {
//   const unsubscribe = subscribe()
//   return unsubscribe
// }, [subscribe])

// In filters:
// <DateRangePicker 
//   startDate={filters.date_from ? new Date(filters.date_from) : undefined}
//   endDate={filters.date_to ? new Date(filters.date_to) : undefined}
//   onChange={(start, end) => setLocalFilters({
//     ...localFilters,
//     date_from: start?.toISOString(),
//     date_to: end?.toISOString()
//   })}
// />

export {}