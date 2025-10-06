import { useEffect, useState } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Mail,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Monitor,
  Smartphone
} from 'lucide-react'
import { 
  getContactSubmissions, 
  updateContactSubmissionStatus,
  exportContactSubmissions 
} from '@/lib/services/contact'
import type { 
  ContactSubmission, 
  ContactSubmissionFilters, 
  ContactSubmissionPagination,
  ContactSubmissionsResult 
} from '@/lib/types/contact'

interface ContactSubmissionTableProps {
  filters: ContactSubmissionFilters
  pagination: ContactSubmissionPagination
  onFiltersChange: (filters: ContactSubmissionFilters) => void
  onPaginationChange: (pagination: ContactSubmissionPagination) => void
}

export function ContactSubmissionTable({
  filters,
  pagination,
  onFiltersChange,
  onPaginationChange
}: ContactSubmissionTableProps) {
  const [data, setData] = useState<ContactSubmissionsResult>({
    submissions: [],
    count: 0,
    hasMore: false
  })
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    loadSubmissions()
  }, [filters, pagination])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const result = await getContactSubmissions(filters, pagination)
      setData(result)
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: ContactSubmission['status']) => {
    try {
      const { success, error } = await updateContactSubmissionStatus(id, status)
      if (success) {
        await loadSubmissions() // Reload data
      } else {
        console.error('Failed to update status:', error)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleExport = async () => {
    try {
      const exportData = await exportContactSubmissions(filters)
      
      // Convert to CSV
      const headers = [
        'ID', 'Name', 'Email', 'Subject', 'Message', 'Status', 
        'Source Page', 'UTM Source', 'UTM Medium', 'UTM Campaign', 
        'Device Type', 'Browser', 'Country', 'Created At', 'Replied At'
      ]
      
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => [
          row.id,
          `"${row.name}"`,
          row.email,
          `"${row.subject}"`,
          `"${row.message.replace(/"/g, '""')}"`, // Escape quotes
          row.status,
          row.source_page || '',
          row.utm_source || '',
          row.utm_medium || '',
          row.utm_campaign || '',
          row.device_type || '',
          row.browser || '',
          row.country_code || '',
          row.created_at,
          row.replied_at || ''
        ].join(','))
      ].join('\n')

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    setShowFilters(false)
  }

  const resetFilters = () => {
    const emptyFilters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
    setShowFilters(false)
  }

  const getStatusBadge = (status: ContactSubmission['status']) => {
    const styles = {
      new: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      in_progress: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      replied: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      closed: 'bg-white/10 text-white/70 border border-white/20'
    }

    const icons = {
      new: <MessageSquare className="w-3 h-3 mr-1" />,
      in_progress: <Clock className="w-3 h-3 mr-1" />,
      replied: <CheckCircle className="w-3 h-3 mr-1" />,
      closed: <X className="w-3 h-3 mr-1" />
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-[8px] ${styles[status]}`}>
        {icons[status]}
        {status.replace('_', ' ')}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const created = new Date(dateString)
    const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
  }

  const isOverdue = (submission: ContactSubmission) => {
    if (submission.status === 'replied' || submission.status === 'closed') return false
    const now = new Date()
    const created = new Date(submission.created_at)
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    return diffHours > 24
  }

  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * pagination.limit
    onPaginationChange({
      ...pagination,
      page: newPage,
      offset: newOffset
    })
  }

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-[hsla(200,16%,80%,0.18)]">
        <div>
          <h2 className="text-xl font-semibold text-white">All Submissions</h2>
          <p className="text-sm text-white/70 mt-1">
            {data.count} total submissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-[10px] transition-all duration-200 backdrop-blur-[8px] ${
              showFilters
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                : 'border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-500/20 backdrop-blur-[8px] border border-emerald-500/30 text-emerald-300 rounded-[10px] hover:bg-emerald-500/30 hover:text-emerald-200 transition-all duration-200 shadow-[0_2px_4px_rgba(16,185,129,0.1)]"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] border-b border-[hsla(200,16%,80%,0.18)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter submissions</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Name, email, or subject..."
                    value={localFilters.search || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[12px] rounded-[10px] text-white placeholder:text-white/50 focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                <select
                  value={localFilters.status || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value as ContactSubmission['status'] || undefined })}
                  className="w-full px-3 py-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[12px] rounded-[10px] text-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
                >
                  <option value="">All statuses</option>
                  <option value="new">🔵 New</option>
                  <option value="in_progress">🟡 In Progress</option>
                  <option value="replied">🟢 Replied</option>
                  <option value="closed">⚫ Closed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Source Page</label>
                <select
                  value={localFilters.source_page || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, source_page: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[12px] rounded-[10px] text-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
                >
                  <option value="">All pages</option>
                  <option value="contact">Contact</option>
                  <option value="home">Home</option>
                  <option value="about">About</option>
                  <option value="blog">Blog</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Device Type</label>
                <select
                  value={localFilters.device_type || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, device_type: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[12px] rounded-[10px] text-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
                >
                  <option value="">All devices</option>
                  <option value="desktop">💻 Desktop</option>
                  <option value="mobile">📱 Mobile</option>
                  <option value="tablet">🖥️ Tablet</option>
                </select>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-white/70 mr-2">Quick filters:</span>
              <button
                onClick={() => setLocalFilters({ status: 'new' })}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 backdrop-blur-[8px] transition-colors"
              >
                New submissions
              </button>
              <button
                onClick={() => setLocalFilters({
                  status: 'new',
                  date_from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                })}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 backdrop-blur-[8px] transition-colors"
              >
                Overdue (&gt;24h)
              </button>
              <button
                onClick={() => setLocalFilters({
                  date_from: new Date().toISOString().split('T')[0]
                })}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 backdrop-blur-[8px] transition-colors"
              >
                Today's submissions
              </button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[hsla(200,16%,80%,0.18)]">
              <div className="text-sm text-white/60">
                {Object.keys(localFilters).length > 0 ? (
                  <span>{Object.keys(localFilters).length} filter(s) applied</span>
                ) : (
                  <span>No filters applied</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-[10px] transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 text-sm bg-amber-500/20 backdrop-blur-[8px] border border-amber-500/30 text-amber-300 rounded-[10px] hover:bg-amber-500/30 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto"></div>
            <p className="text-white/70 mt-2">Loading submissions...</p>
          </div>
        ) : data.submissions.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">No contact submissions found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-[hsla(200,16%,80%,0.18)]">
            <thead className="bg-[hsla(200,10%,60%,0.18)] backdrop-blur-[8px]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsla(200,16%,80%,0.12)]">
              {data.submissions.map((submission) => {
                const isSubmissionOverdue = isOverdue(submission)
                return (
                  <tr
                    key={submission.id}
                    className={`hover:bg-[hsla(200,14%,78%,0.12)] transition-colors ${
                      isSubmissionOverdue ? 'bg-red-500/10 border-l-4 border-red-400' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {isSubmissionOverdue && (
                          <div className="flex-shrink-0 mr-3">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-white truncate">
                              {submission.name}
                            </div>
                            {submission.status === 'new' && (
                              <div className="ml-2 w-2 h-2 bg-emerald-400 rounded-full"></div>
                            )}
                          </div>
                          <div className="text-sm text-white/70 truncate">{submission.email}</div>
                          {submission.device_type && (
                            <div className="flex items-center text-xs text-white/60 mt-1">
                              {submission.device_type === 'mobile' ?
                                <Smartphone className="w-3 h-3 mr-1" /> :
                                <Monitor className="w-3 h-3 mr-1" />
                              }
                              {submission.device_type}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-white truncate">{submission.subject}</div>
                        <div className="text-sm text-white/70 line-clamp-2">{submission.message}</div>
                        {submission.source_page && (
                          <div className="text-xs text-white/60 mt-1 capitalize">
                            from {submission.source_page}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(submission.status)}
                      </div>
                      <select
                        value={submission.status}
                        onChange={(e) => handleStatusUpdate(submission.id, e.target.value as ContactSubmission['status'])}
                        className="mt-1 text-xs border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[8px] rounded-md px-2 py-1 focus:ring-2 focus:ring-amber-500/30 focus:outline-none text-white"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-white/70">{getTimeAgo(submission.created_at)}</div>
                      {submission.replied_at && (
                        <div className="text-xs text-emerald-400 mt-1">
                          Replied {getTimeAgo(submission.replied_at)}
                        </div>
                      )}
                      {isSubmissionOverdue && (
                        <div className="text-xs text-red-400 font-medium mt-1">
                          OVERDUE
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-amber-300 bg-amber-500/20 backdrop-blur-[8px] border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </button>
                        <a
                          href={`mailto:${submission.email}?subject=Re: ${submission.subject}`}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-emerald-300 bg-emerald-500/20 backdrop-blur-[8px] border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Reply
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data.count > pagination.limit && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[hsla(200,16%,80%,0.18)]">
          <div className="text-sm text-white/70">
            Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, data.count)} of {data.count} results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-[10px] border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[8px] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 text-sm text-white/90">
              Page {pagination.page}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!data.hasMore}
              className="p-2 rounded-[10px] border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[8px] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[hsl(38,45%,96%)] rounded-[16px] shadow-[0_0_48px_rgba(0,0,0,0.3)] max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/80 backdrop-blur-[16px]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-[10px] backdrop-blur-[8px] flex items-center justify-center ${
                  isOverdue(selectedSubmission) ? 'bg-red-500/20 border border-red-500/30' : 'bg-amber-500/20 border border-amber-500/30'
                }`}>
                  <MessageSquare className={`w-5 h-5 ${
                    isOverdue(selectedSubmission) ? 'text-red-600' : 'text-amber-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Submission Details</h3>
                  <p className="text-sm text-gray-600">{selectedSubmission.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedSubmission.status)}
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 hover:bg-gray-100 rounded-[10px] transition-colors text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6 space-y-6">
                {/* Alert for overdue */}
                {isOverdue(selectedSubmission) && (
                  <div className="bg-red-500/20 backdrop-blur-[8px] border border-red-500/30 rounded-[12px] p-4 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-red-800">Overdue Submission</div>
                      <div className="text-sm text-red-700">
                        This submission has been waiting for more than 24 hours and needs immediate attention.
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Contact Information */}
                  <div className="bg-white/60 backdrop-blur-[8px] rounded-[12px] border border-gray-200 shadow-sm p-4">
                    <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                      <User className="w-4 h-4" />
                      Contact Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Name</span>
                        <div className="font-medium text-gray-900">{selectedSubmission.name}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Email</span>
                        <div className="font-medium text-gray-900 break-all">{selectedSubmission.email}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Subject</span>
                        <div className="font-medium text-gray-900">{selectedSubmission.subject}</div>
                      </div>
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="bg-white/60 backdrop-blur-[8px] rounded-[12px] border border-gray-200 shadow-sm p-4">
                    <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                      <Clock className="w-4 h-4" />
                      Timing
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Submitted</span>
                        <div className="font-medium text-gray-900">{formatDate(selectedSubmission.created_at)}</div>
                        <div className="text-xs text-gray-500">{getTimeAgo(selectedSubmission.created_at)}</div>
                      </div>
                      {selectedSubmission.replied_at && (
                        <div>
                          <span className="text-gray-600">Replied</span>
                          <div className="font-medium text-emerald-700">{formatDate(selectedSubmission.replied_at)}</div>
                          <div className="text-xs text-gray-500">{getTimeAgo(selectedSubmission.replied_at)}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Source Information */}
                  <div className="bg-white/60 backdrop-blur-[8px] rounded-[12px] border border-gray-200 shadow-sm p-4">
                    <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                      <Calendar className="w-4 h-4" />
                      Source & Device
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Source Page</span>
                        <div className="font-medium text-gray-900 capitalize">
                          {selectedSubmission.source_page || 'Unknown'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Device</span>
                        <div className="flex items-center gap-1 font-medium text-gray-900">
                          {selectedSubmission.device_type === 'mobile' ?
                            <Smartphone className="w-3 h-3" /> :
                            <Monitor className="w-3 h-3" />
                          }
                          {selectedSubmission.device_type || 'Unknown'}
                        </div>
                      </div>
                      {selectedSubmission.utm_source && (
                        <div>
                          <span className="text-gray-600">UTM Source</span>
                          <div className="font-medium text-gray-900">{selectedSubmission.utm_source}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Message */}
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </h4>
                  <div className="bg-white/60 backdrop-blur-[8px] border border-gray-200 rounded-[12px] shadow-sm p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {selectedSubmission.message}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-white/80 backdrop-blur-[16px]">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>Status:</span>
                <select
                  value={selectedSubmission.status}
                  onChange={(e) => handleStatusUpdate(selectedSubmission.id, e.target.value as ContactSubmission['status'])}
                  className="text-sm border border-gray-300 rounded-[8px] px-2 py-1 bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-[10px] text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                  className="inline-flex items-center px-4 py-2 text-sm bg-emerald-500/20 backdrop-blur-[8px] border border-emerald-500/30 text-emerald-700 rounded-[10px] hover:bg-emerald-500/30 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}