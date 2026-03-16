import React, { useState, useEffect } from 'react';
import MyProposals from './MyProposals';
import NewProposalForm from './NewProposalForm ';
import ProposalStats from './ProposalStats';

const SpeakerDashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProposalCreated = () => {
    // Trigger MyProposals to refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Speaker Dashboard</h2>
      
      {/* Stats Section   good idea  but  could cause more reqs to server so I stoped developing it after implmeting the pagination  */}
      {/* <ProposalStats key={refreshTrigger} /> */} 

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Submit New Proposal</h3>
        <NewProposalForm onSuccess={handleProposalCreated} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">My Proposals</h3>
        <MyProposals key={refreshTrigger} />
      </div>
    </div>
  );
};

export default SpeakerDashboard;