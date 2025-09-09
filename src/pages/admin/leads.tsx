import React, { useState, useEffect } from 'react';
import { AdminLayout, LeadsTable } from '../../components/admin';
import { AdminGuard } from '../../components/auth';
import { getLeads } from '../../lib/services/leads';
import type { Lead } from '../../lib/types/leads';

const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { leads: leadsData } = await getLeads(1000); // Get all leads
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <AdminGuard>
      <AdminLayout currentPage="/admin/leads">
        <LeadsTable 
          leads={leads} 
          loading={loading}
          onRefresh={fetchLeads}
        />
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminLeads;