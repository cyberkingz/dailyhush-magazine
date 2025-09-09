import { useState, useEffect } from 'react'
import { getLeads, getLeadAnalytics, updateLeadSubscription } from '../../lib/services/leads'
import type { Lead, LeadAnalytics } from '../../lib/types/leads'

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [analytics, setAnalytics] = useState<LeadAnalytics[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedTimeRange, setSelectedTimeRange] = useState(30)
  
  const leadsPerPage = 25
  
  const loadLeads = async () => {
    setLoading(true)
    try {
      const { leads: leadsData, count } = await getLeads(leadsPerPage, currentPage * leadsPerPage)
      setLeads(leadsData)
      setTotalCount(count)
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const loadAnalytics = async () => {
    try {
      const analyticsData = await getLeadAnalytics(selectedTimeRange)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }
  
  useEffect(() => {
    loadLeads()
  }, [currentPage])
  
  useEffect(() => {
    loadAnalytics()
  }, [selectedTimeRange])
  
  const handleSubscriptionToggle = async (id: string, currentStatus: boolean) => {
    try {
      const success = await updateLeadSubscription(id, !currentStatus)
      if (success) {
        setLeads(leads.map(lead => 
          lead.id === id 
            ? { ...lead, is_subscribed: !currentStatus }
            : lead
        ))
      }
    } catch (error) {
      console.error('Error updating subscription:', error)
    }
  }
  
  const totalPages = Math.ceil(totalCount / leadsPerPage)
  const totalSignups = analytics.reduce((sum, item) => sum + item.lead_count, 0)
  const totalConfirmed = analytics.reduce((sum, item) => sum + item.confirmed_count, 0)
  const conversionRate = totalSignups > 0 ? ((totalConfirmed / totalSignups) * 100).toFixed(1) : '0'
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leads Manager</h1>
        <p className="text-gray-600 mt-2">Manage newsletter subscriptions and view analytics</p>
      </div>
      
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900">Total Signups</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalSignups.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Last {selectedTimeRange} days</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900">Confirmed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalConfirmed.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Email confirmations</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900">Conversion Rate</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{conversionRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Confirmation rate</p>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <label className="font-medium text-gray-700">Time Range:</label>
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
        
        <button
          onClick={loadLeads}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
      
      {/* Leads Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
          <p className="text-gray-600">Total: {totalCount.toLocaleString()} leads</p>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading leads...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.email}</div>
                        {lead.utm_source && (
                          <div className="text-xs text-gray-500">UTM: {lead.utm_source}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.source_page || 'Unknown'}</div>
                      {lead.referrer_url && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          Ref: {new URL(lead.referrer_url).hostname}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          lead.is_subscribed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {lead.is_subscribed ? 'Subscribed' : 'Unsubscribed'}
                        </span>
                        {lead.confirmed_at && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Confirmed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleSubscriptionToggle(lead.id, lead.is_subscribed)}
                        className={`px-3 py-1 rounded text-sm ${
                          lead.is_subscribed
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {lead.is_subscribed ? 'Unsubscribe' : 'Resubscribe'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {currentPage * leadsPerPage + 1} to {Math.min((currentPage + 1) * leadsPerPage, totalCount)} of {totalCount} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}