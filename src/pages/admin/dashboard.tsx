import React, { useState, useEffect } from 'react';
import { AdminLayout, DashboardStats } from '../../components/admin';
import { AdminGuard } from '../../components/auth';
import { getLeads } from '../../lib/services/leads';
import type { Lead } from '../../lib/types/leads';

const AdminDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const { leads: leadsData } = await getLeads(100); // Get latest 100 leads for stats
        setLeads(leadsData);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <AdminGuard>
      <AdminLayout currentPage="/admin/dashboard">
        <DashboardStats leads={leads} loading={loading} />
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminDashboard;

