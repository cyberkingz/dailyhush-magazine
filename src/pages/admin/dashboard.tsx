import React, { useState, useEffect } from 'react';
import { AdminLayout, DashboardStats } from '../../components/admin';
import { AdminGuard } from '../../components/auth';
import { getLeads } from '../../lib/services/leads';
import { getContactSubmissions } from '../../lib/services/contact';
import type { Lead } from '../../lib/types/leads';
import type { ContactSubmission } from '../../lib/types/contact';

const AdminDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both leads and contact submissions in parallel
        const [
          { leads: leadsData },
          { submissions: contactSubmissionsData }
        ] = await Promise.all([
          getLeads(100), // Get latest 100 leads for stats
          getContactSubmissions({}, { page: 1, limit: 100, offset: 0 }) // Get latest 100 contact submissions for stats
        ]);
        
        setLeads(leadsData);
        setContactSubmissions(contactSubmissionsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminGuard>
      <AdminLayout currentPage="/admin/dashboard">
        <DashboardStats 
          leads={leads} 
          contactSubmissions={contactSubmissions}
          loading={loading} 
        />
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminDashboard;

