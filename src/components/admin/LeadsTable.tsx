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

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, loading }) => {
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
    <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[hsla(200,16%,80%,0.18)]">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Leads Management
            </h2>
            <p className="text-sm text-white/70 mt-1">
              {filteredLeads.length} of {leads.length} leads
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-[12px] flex items-center gap-2 text-sm transition-all duration-200 backdrop-blur-[8px] ${
                showFilters
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-300 shadow-[0_2px_4px_rgba(245,158,11,0.1)]'
                  : 'border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <button
              onClick={() => handleExport(false)}
              className="px-4 py-2 bg-emerald-500/20 backdrop-blur-[8px] text-emerald-300 border border-emerald-500/30 rounded-[12px] hover:bg-emerald-500/30 hover:text-emerald-200 flex items-center gap-2 text-sm transition-all duration-200 shadow-[0_2px_4px_rgba(16,185,129,0.1)]"
            >
              <Download className="h-4 w-4" />
              Export All
            </button>

            {filteredLeads.length < leads.length && (
              <button
                onClick={() => handleExport(true)}
                className="px-4 py-2 bg-emerald-500/20 backdrop-blur-[8px] text-emerald-300 border border-emerald-500/30 rounded-[12px] hover:bg-emerald-500/30 hover:text-emerald-200 flex items-center gap-2 text-sm transition-all duration-200 shadow-[0_2px_4px_rgba(16,185,129,0.1)]"
              >
                <Download className="h-4 w-4" />
                Export Filtered
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-[hsla(200,10%,60%,0.18)] backdrop-blur-[16px] backdrop-saturate-[140%] rounded-[12px] border border-[hsla(200,16%,80%,0.12)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white/80">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 pr-4 py-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[12px] rounded-[10px] w-full text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white/80">Source Page</label>
                <select
                  value={filters.sourcePage}
                  onChange={(e) => setFilters(prev => ({ ...prev, sourcePage: e.target.value }))}
                  className="w-full px-3 py-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[12px] rounded-[10px] text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="">All pages</option>
                  {sourcePages.map(page => (
                    <option key={page} value={page}>{page}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white/80">Subscription</label>
                <select
                  value={filters.isSubscribed}
                  onChange={(e) => setFilters(prev => ({ ...prev, isSubscribed: e.target.value }))}
                  className="w-full px-3 py-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[12px] rounded-[10px] text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="">All status</option>
                  <option value="subscribed">Subscribed</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-white/80">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[12px] rounded-[10px] text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="">All time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                </select>
              </div>
            </div>

            {(filters.search || filters.sourcePage || filters.isSubscribed || filters.dateRange) && (
              <div className="mt-3 pt-3 border-t border-[hsla(200,16%,80%,0.18)]">
                <button
                  onClick={() => setFilters({ search: '', sourcePage: '', isSubscribed: '', dateRange: '' })}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
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
          <thead className="bg-[hsla(200,10%,60%,0.18)] backdrop-blur-[8px]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                UTM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsla(200,16%,80%,0.12)]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-[8px] animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-white/60">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2 text-white/80">No leads found</p>
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
                <tr key={lead.id} className="hover:bg-[hsla(200,14%,78%,0.12)] transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {lead.email}
                      </div>
                      {lead.confirmed_at && (
                        <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                          <Check className="h-3 w-3" />
                          Confirmed
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-white">
                      {lead.source_page || 'Unknown'}
                    </div>
                    {lead.referrer_url && (
                      <div className="text-xs text-white/60 truncate max-w-32">
                        from: {new URL(lead.referrer_url).hostname}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-white/70">
                      {getDeviceIcon(lead.device_type || '')}
                      <div>
                        <div className="text-sm text-white capitalize">
                          {lead.device_type || 'Unknown'}
                        </div>
                        <div className="text-xs text-white/60 capitalize">
                          {lead.browser || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {(lead.utm_source || lead.utm_medium || lead.utm_campaign) ? (
                      <div className="text-xs">
                        {lead.utm_source && (
                          <div className="text-white">
                            <span className="font-medium">Source:</span> {lead.utm_source}
                          </div>
                        )}
                        {lead.utm_medium && (
                          <div className="text-white/60">
                            <span className="font-medium">Medium:</span> {lead.utm_medium}
                          </div>
                        )}
                        {lead.utm_campaign && (
                          <div className="text-white/60">
                            <span className="font-medium">Campaign:</span> {lead.utm_campaign}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-white/50">No UTM data</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-[8px] ${
                      lead.is_subscribed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
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
                    <div className="text-sm text-white">
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
        <div className="px-6 py-4 border-t border-[hsla(200,16%,80%,0.18)]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/70">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length} results
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[8px] rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[hsla(200,14%,78%,0.28)] transition-colors text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-3 py-1 text-sm text-white">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[8px] rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[hsla(200,14%,78%,0.28)] transition-colors text-white"
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
