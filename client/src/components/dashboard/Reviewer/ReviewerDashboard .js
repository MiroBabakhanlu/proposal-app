import React, { useState } from 'react';
import ProposalsToReview from './ProposalsToReview';
import ReviewHistory from './ReviewHistory';

const ReviewerDashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reviewer Dashboard</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Proposals to Review</h3>
        <ProposalsToReview 
          key={refreshTrigger}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">My Review History</h3>
        <ReviewHistory key={refreshTrigger} />
      </div>
    </div>
  );
};

export default ReviewerDashboard;