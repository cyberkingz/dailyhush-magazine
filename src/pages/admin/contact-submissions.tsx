import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { ContactSubmissionTable } from '@/components/admin/ContactSubmissionTable'
import { ContactSubmissionStats } from '@/components/admin/ContactSubmissionStats'
import type { ContactSubmissionFilters, ContactSubmissionPagination } from '@/lib/types/contact'

export default function ContactSubmissions() {
  const [filters, setFilters] = useState<ContactSubmissionFilters>({})
  const [pagination, setPagination] = useState<ContactSubmissionPagination>({
    page: 1,
    limit: 20,
    offset: 0
  })

  useEffect(() => {
    document.title = 'Contact Submissions — Admin — DailyHush'
  }, [])

  const handleFiltersChange = (newFilters: ContactSubmissionFilters) => {
    setFilters(newFilters)
    // Reset pagination when filters change
    setPagination(prev => ({ ...prev, page: 1, offset: 0 }))
  }

  const handlePaginationChange = (newPagination: ContactSubmissionPagination) => {
    setPagination(newPagination)
  }

  return (
    <AdminLayout currentPage="/admin/contact-submissions">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
              <p className="text-gray-600 mt-1">
                Manage and respond to contact form submissions from your website visitors.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Last updated:</span> {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <ContactSubmissionStats />

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ContactSubmissionTable
            filters={filters}
            pagination={pagination}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
          />
        </div>
      </div>
    </AdminLayout>
  )
}