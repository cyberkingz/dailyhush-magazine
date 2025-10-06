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
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
              <p className="text-white/70 mt-1">
                Manage and respond to contact form submissions from your website visitors.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-white/60">
                <span className="font-medium text-white/80">Last updated:</span> {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <ContactSubmissionStats />

        {/* Submissions Table */}
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]">
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