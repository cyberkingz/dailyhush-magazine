import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { QuizStatsCards } from '../../components/admin/QuizStatsCards'
import { QuizSubmissionsList } from '../../components/admin/QuizSubmissionsList'
import { QuizSubmissionDetail } from '../../components/admin/QuizSubmissionDetail'
import { getQuizSubmissions } from '../../lib/services/quiz'
import { exportQuizSubmissionsToCSV } from '../../lib/utils/csv-export'
import type { QuizSubmission } from '../../lib/services/quiz'

export default function QuizResults() {
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [allSubmissions, setAllSubmissions] = useState<QuizSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [])

  async function loadSubmissions() {
    try {
      const { submissions } = await getQuizSubmissions(1000, 0) // Get up to 1000 submissions
      setAllSubmissions(submissions)
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectSubmission = (submission: QuizSubmission) => {
    setSelectedSubmission(submission)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    // Keep the selected submission for a moment to allow smooth close animation
    setTimeout(() => setSelectedSubmission(null), 300)
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      await exportQuizSubmissionsToCSV(allSubmissions)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <AdminLayout currentPage="/admin/quiz-results">
      <div className="space-y-8">
        {/* Export button section */}
        <div className="flex justify-end">
          <button
            onClick={handleExportCSV}
            disabled={allSubmissions.length === 0 || isLoading || isExporting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`} />
            {isLoading
              ? 'Loading...'
              : isExporting
                ? 'Exporting...'
                : `Export CSV (${allSubmissions.length})`}
          </button>
        </div>

        {/* Stats overview */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
          <QuizStatsCards />
        </div>

        {/* Submissions list */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Submissions</h2>
          <QuizSubmissionsList
            submissions={allSubmissions}
            isLoading={isLoading}
            onSelectSubmission={handleSelectSubmission}
          />
        </div>

        {/* Detail slide-over */}
        <QuizSubmissionDetail
          submission={selectedSubmission}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
      </div>
    </AdminLayout>
  )
}
