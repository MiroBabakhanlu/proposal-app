import React, { useState } from 'react';
import AllProposals from './AllProposals';
import StatusUpdatePanel from './StatusUpdatePanel';

const AdminDashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleStatusChange = () => {
    setRefreshTrigger(prev => prev + 1);
    setSelectedProposal(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">All Proposals</h3>
          <AllProposals
            key={refreshTrigger}
            onSelectProposal={setSelectedProposal}
            selectedProposalId={selectedProposal?.id}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Update Status</h3>
          <StatusUpdatePanel
            proposal={selectedProposal}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;