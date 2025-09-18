import type { Lead } from '../types/leads';
import type { ContactSubmission } from '../types/contact';

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

// Convert contact submissions data to CSV format
export function convertContactSubmissionsToCSV(submissions: ContactSubmission[]): string {
  if (submissions.length === 0) return '';

  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Email',
    'Subject',
    'Message',
    'Status',
    'Source Page',
    'Source URL',
    'Referrer URL',
    'Browser',
    'Device Type',
    'Country Code',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'UTM Term',
    'UTM Content',
    'User Agent',
    'IP Address',
    'Replied At',
    'Created At',
    'Updated At'
  ];

  // Convert data rows
  const rows = submissions.map(submission => [
    submission.id,
    submission.name,
    submission.email,
    submission.subject,
    submission.message.replace(/\n/g, ' '), // Replace newlines with spaces for CSV
    submission.status,
    submission.source_page || '',
    submission.source_url || '',
    submission.referrer_url || '',
    submission.browser || '',
    submission.device_type || '',
    submission.country_code || '',
    submission.utm_source || '',
    submission.utm_medium || '',
    submission.utm_campaign || '',
    submission.utm_term || '',
    submission.utm_content || '',
    submission.user_agent || '',
    submission.ip_address || '',
    submission.replied_at || '',
    submission.created_at,
    submission.updated_at
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

// Export contact submissions with custom filters
export function exportContactSubmissionsToCSV(
  submissions: ContactSubmission[], 
  options: {
    filename?: string;
    dateRange?: { start: Date; end: Date };
    status?: ContactSubmission['status'];
    sourcePage?: string;
    utmSource?: string;
  } = {}
): void {
  let filteredSubmissions = submissions;

  // Apply filters
  if (options.dateRange) {
    filteredSubmissions = filteredSubmissions.filter(submission => {
      const createdAt = new Date(submission.created_at);
      return createdAt >= options.dateRange!.start && createdAt <= options.dateRange!.end;
    });
  }

  if (options.status) {
    filteredSubmissions = filteredSubmissions.filter(submission => submission.status === options.status);
  }

  if (options.sourcePage) {
    filteredSubmissions = filteredSubmissions.filter(submission => submission.source_page === options.sourcePage);
  }

  if (options.utmSource) {
    filteredSubmissions = filteredSubmissions.filter(submission => submission.utm_source === options.utmSource);
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = options.filename || `contact-submissions-export-${timestamp}.csv`;

  // Convert to CSV and download
  const csvContent = convertContactSubmissionsToCSV(filteredSubmissions);
  downloadCSV(csvContent, filename);
}

// Get contact submissions export statistics
export function getContactSubmissionExportStats(submissions: ContactSubmission[]) {
  return {
    total: submissions.length,
    byStatus: submissions.reduce((acc, submission) => {
      acc[submission.status] = (acc[submission.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    bySource: submissions.reduce((acc, submission) => {
      const source = submission.source_page || 'unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byUtmSource: submissions.reduce((acc, submission) => {
      if (submission.utm_source) {
        acc[submission.utm_source] = (acc[submission.utm_source] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    byMonth: submissions.reduce((acc, submission) => {
      const month = new Date(submission.created_at).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byDeviceType: submissions.reduce((acc, submission) => {
      const device = submission.device_type || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    avgResponseTime: submissions
      .filter(s => s.status === 'replied' && s.replied_at)
      .reduce((total, s) => {
        const responseTime = new Date(s.replied_at!).getTime() - new Date(s.created_at).getTime();
        return total + responseTime;
      }, 0) / submissions.filter(s => s.status === 'replied' && s.replied_at).length || 0
  };
}