import type { Lead } from '../types/leads';

// Convert leads data to CSV format
export function convertToCSV(leads: Lead[]): string {
  if (leads.length === 0) return '';

  // Define CSV headers
  const headers = [
    'ID',
    'Email',
    'Source Page',
    'Source URL',
    'Referrer URL',
    'Browser',
    'Device Type',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'UTM Term',
    'UTM Content',
    'Is Subscribed',
    'Confirmed At',
    'Created At',
    'Updated At'
  ];

  // Convert data rows
  const rows = leads.map(lead => [
    lead.id,
    lead.email,
    lead.source_page || '',
    lead.source_url || '',
    lead.referrer_url || '',
    lead.browser || '',
    lead.device_type || '',
    lead.utm_source || '',
    lead.utm_medium || '',
    lead.utm_campaign || '',
    lead.utm_term || '',
    lead.utm_content || '',
    lead.is_subscribed ? 'Yes' : 'No',
    lead.confirmed_at || '',
    lead.created_at,
    lead.updated_at
  ]);

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCSVValue = (value: any): string => {
    if (value == null) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSVValue).join(','))
  ].join('\n');

  return csvContent;
}

// Download CSV file
export function downloadCSV(csvContent: string, filename: string = 'leads-export.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Export leads with custom filters
export function exportLeadsToCSV(
  leads: Lead[], 
  options: {
    filename?: string;
    dateRange?: { start: Date; end: Date };
    sourcePage?: string;
    subscribedOnly?: boolean;
  } = {}
): void {
  let filteredLeads = leads;

  // Apply filters
  if (options.dateRange) {
    filteredLeads = filteredLeads.filter(lead => {
      const createdAt = new Date(lead.created_at);
      return createdAt >= options.dateRange!.start && createdAt <= options.dateRange!.end;
    });
  }

  if (options.sourcePage) {
    filteredLeads = filteredLeads.filter(lead => lead.source_page === options.sourcePage);
  }

  if (options.subscribedOnly) {
    filteredLeads = filteredLeads.filter(lead => lead.is_subscribed);
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = options.filename || `leads-export-${timestamp}.csv`;

  // Convert to CSV and download
  const csvContent = convertToCSV(filteredLeads);
  downloadCSV(csvContent, filename);
}

// Get export statistics
export function getExportStats(leads: Lead[]) {
  return {
    total: leads.length,
    subscribed: leads.filter(lead => lead.is_subscribed).length,
    confirmed: leads.filter(lead => lead.confirmed_at).length,
    bySource: leads.reduce((acc, lead) => {
      const source = lead.source_page || 'unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byMonth: leads.reduce((acc, lead) => {
      const month = new Date(lead.created_at).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}