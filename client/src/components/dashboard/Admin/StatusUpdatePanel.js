import React from 'react';
import { useUpdateProposalStatus } from '../../../hooks/useProposals';

const StatusUpdatePanel = ({ proposal, onStatusChange }) => {
  const updateStatus = useUpdateProposalStatus();

  const handleStatusUpdate = async (newStatus) => {
    if (!proposal) return;

    try {
      await updateStatus.mutateAsync({ id: proposal.id, status: newStatus });
      onStatusChange();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  if (!proposal) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Select a proposal from the list to update its status.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-medium text-gray-900 break-all ">{proposal.title}</h4>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2 break-all ">{proposal.description}</p>
        <p className="text-xs text-gray-500 mt-2">
          Current status: <span className={`font-medium ${proposal.status === 'PENDING' ? 'text-yellow-600' :
              proposal.status === 'APPROVED' ? 'text-green-600' :
                'text-red-600'
            }`}>{proposal.status}</span>
        </p>
      </div>

      {updateStatus.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          {updateStatus.error?.message || 'Failed to update status'}
        </div>
      )}

      <div className="space-y-2">
        {proposal.status !== 'PENDING' && (
          <button
            onClick={() => handleStatusUpdate('PENDING')}
            disabled={updateStatus.isPending}
            className="w-full py-2 px-4 rounded-md text-white font-medium bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
          >
            {updateStatus.isPending ? 'Updating...' : ' Reset to Pending'}
          </button>
        )}

        <button
          onClick={() => handleStatusUpdate('APPROVED')}
          disabled={updateStatus.isPending || proposal.status === 'APPROVED'}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${proposal.status === 'APPROVED'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
            } disabled:opacity-50`}
        >
          {updateStatus.isPending ? 'Updating...' : ' Approve Proposal'}
        </button>

        <button
          onClick={() => handleStatusUpdate('REJECTED')}
          disabled={updateStatus.isPending || proposal.status === 'REJECTED'}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${proposal.status === 'REJECTED'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
            } disabled:opacity-50`}
        >
          {updateStatus.isPending ? 'Updating...' : ' Reject Proposal'}
        </button>
      </div>

      <div className="text-xs text-gray-400 text-center">
        {proposal.status === 'PENDING' && 'This proposal is awaiting decision.'}
        {proposal.status === 'APPROVED' && 'This proposal is approved. Use Reset to make changes.'}
        {proposal.status === 'REJECTED' && 'This proposal is rejected. Use Reset to make changes.'}
      </div>
    </div>
  );
};

export default StatusUpdatePanel;