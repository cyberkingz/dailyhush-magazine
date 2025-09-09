import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  X,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import type { Lead } from '../../lib/types/leads';
import { exportLeadsToCSV } from '../../lib/utils/csvExport';

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  onRefresh?: () => void;
}

interface FilterState {
  search: string;
  sourcePage: string;
  isSubscribed: string;
  dateRange: string;
}

const ITEMS_PER_PAGE = 25;

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, loading, onRefresh }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sourcePage: '',
    isSubscribed: '',
    dateRange: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (!lead.email.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Source page filter
      if (filters.sourcePage && lead.source_page !== filters.sourcePage) {
        return false;
      }

      // Subscription filter
      if (filters.isSubscribed === 'subscribed' && !lead.is_subscribed) {
        return false;
      }
      if (filters.isSubscribed === 'unsubscribed' && lead.is_subscribed) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const leadDate = new Date(lead.created_at);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            if (leadDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (leadDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (leadDate < monthAgo) return false;
            break;
        }
      }

      return true;
    });
  }, [leads, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Get unique source pages for filter dropdown
  const sourcePages = useMemo(() => {
    const pages = [...new Set(leads.map(lead => lead.source_page).filter(Boolean))];
    return pages.sort();
  }, [leads]);

  // Handle export
  const handleExport = (filtered = false) => {
    const leadsToExport = filtered ? filteredLeads : leads;
    const timestamp = new Date().toISOString().split('T')[0];
    const filterSuffix = filtered && filters.search ? `-filtered` : '';
    
    exportLeadsToCSV(leadsToExport, {
      filename: `leads-export${filterSuffix}-${timestamp}.csv`
    });
  };

  // Device icon helper
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white  rounded-lg shadow-sm border border-gray-200 ">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 ">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 ">
              Leads Management
            </h2>
            <p className="text-sm text-gray-500  mt-1">
              {filteredLeads.length} of {leads.length} leads
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 text-sm transition-colors ${
                showFilters 
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  : 'border-gray-300 hover:bg-gray-50 '
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            
            <button
              onClick={() => handleExport(false)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm transition-colors"
            >
              <Download className="h-4 w-4" />
              Export All
            </button>
            
            {filteredLeads.length < leads.length && (
              <button
                onClick={() => handleExport(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Filtered
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full bg-white  text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Source Page</label>
                <select
                  value={filters.sourcePage}
                  onChange={(e) => setFilters(prev => ({ ...prev, sourcePage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white  text-sm"
                >
                  <option value="">All pages</option>
                  {sourcePages.map(page => (
                    <option key={page} value={page}>{page}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Subscription</label>
                <select
                  value={filters.isSubscribed}
                  onChange={(e) => setFilters(prev => ({ ...prev, isSubscribed: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white  text-sm"
                >
                  <option value="">All status</option>
                  <option value="subscribed">Subscribed</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white  text-sm"
                >
                  <option value="">All time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                </select>
              </div>
            </div>
            
            {(filters.search || filters.sourcePage || filters.isSubscribed || filters.dateRange) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setFilters({ search: '', sourcePage: '', isSubscribed: '', dateRange: '' })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                UTM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white  divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500 ">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No leads found</p>
                    <p className="text-sm">
                      {leads.length === 0 
                        ? "No leads have been collected yet." 
                        : "Try adjusting your filters to see more results."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 ">
                        {lead.email}
                      </div>
                      {lead.confirmed_at && (
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <Check className="h-3 w-3" />
                          Confirmed
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 ">
                      {lead.source_page || 'Unknown'}
                    </div>
                    {lead.referrer_url && (
                      <div className="text-xs text-gray-500  truncate max-w-32">
                        from: {new URL(lead.referrer_url).hostname}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(lead.device_type || '')}
                      <div>
                        <div className="text-sm text-gray-900  capitalize">
                          {lead.device_type || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500  capitalize">
                          {lead.browser || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {(lead.utm_source || lead.utm_medium || lead.utm_campaign) ? (
                      <div className="text-xs">
                        {lead.utm_source && (
                          <div className="text-gray-900 ">
                            <span className="font-medium">Source:</span> {lead.utm_source}
                          </div>
                        )}
                        {lead.utm_medium && (
                          <div className="text-gray-500 ">
                            <span className="font-medium">Medium:</span> {lead.utm_medium}
                          </div>
                        )}
                        {lead.utm_campaign && (
                          <div className="text-gray-500 ">
                            <span className="font-medium">Campaign:</span> {lead.utm_campaign}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No UTM data</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.is_subscribed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {lead.is_subscribed ? (
                        <>
                          <Check className="h-3 w-3" />
                          Subscribed
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" />
                          Unsubscribed
                        </>
                      )}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 ">
                      {formatDate(lead.created_at)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 ">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 ">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50  transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50  transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;