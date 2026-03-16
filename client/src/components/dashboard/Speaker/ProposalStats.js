import React, { useState, useEffect } from 'react';
import { getMyProposals } from '../../../services/api';

const ProposalStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getMyProposals();

      const newStats = {
        total: data.length,
        pending: data.filter(p => p.status === 'PENDING').length,
        approved: data.filter(p => p.status === 'APPROVED').length,
        rejected: data.filter(p => p.status === 'REJECTED').length
      };

      setStats(newStats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total Proposals" value={stats.total} color="text-gray-900" />
      <StatCard label="Pending" value={stats.pending} color="text-yellow-600" />
      <StatCard label="Approved" value={stats.approved} color="text-green-600" />
      <StatCard label="Rejected" value={stats.rejected} color="text-red-600" />
    </div>
  );
};

export default ProposalStats;