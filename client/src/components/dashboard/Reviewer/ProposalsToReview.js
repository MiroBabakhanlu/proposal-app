import React, { useState, useEffect, useRef } from 'react';
import { useProposals, useSubmitReview } from '../../../hooks/useProposals';
import ReviewForm from './ReviewForm';
import TagFilter from './TagFilter';
import Pagination from '../../common/Pagination';
import { getTags } from '../../../services/api';


const ProposalsToReview = ({ onReviewSubmitted }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    tag: ''
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [allTags, setAllTags] = useState([]);

  const debounceTimer = useRef(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400);

    return () => clearTimeout(debounceTimer.current);
  }, [filters.search]);

  const apiFilters = {
    search: debouncedSearch,
    tag: filters.tag
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useProposals(apiFilters, page, 5);

  const submitReview = useSubmitReview();

  const proposals = data?.data || [];
  const pagination = data?.pagination || {};

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.tag]);

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const { data } = await getTags();
        setAllTags(data.map(tag => tag.name));
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      }
    };
    fetchAllTags();
  }, []);

  const availableTags = allTags;

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleTagChange = (tag) => {
    setFilters({ ...filters, tag });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, search: '' }));
    setDebouncedSearch('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  };

  const handleReviewSubmit = async (proposalId, reviewData) => {
    try {
      await submitReview.mutateAsync({ proposalId, reviewData });
      setSelectedProposal(null);
      onReviewSubmitted?.();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    }
  };

  const toggleDescription = (proposalId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [proposalId]: !prev[proposalId]
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading proposals...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 mb-4">
        <div className="relative">
          <input
            type="text"
            name="search"
            placeholder="Search by title..."
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
          {filters.search !== debouncedSearch && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <div className="h-3 w-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <TagFilter
          availableTags={availableTags}
          selectedTag={filters.tag}
          onTagChange={handleTagChange}
        />
      </div>

      {isFetching && (
        <div className="flex justify-center py-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 mr-2"></div>
          <span className="text-sm text-gray-500">Updating results...</span>
        </div>
      )}

      {pagination.total > 0 && (
        <div className="text-sm text-gray-500">
          Showing {((pagination.page - 1) * 5) + 1} - {Math.min(pagination.page * 5, pagination.total)} of {pagination.total} proposals
        </div>
      )}

      {proposals.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No proposals to review.</p>
      ) : (
        <>
          <div className="space-y-4">
            {proposals.map(proposal => {
              const isExpanded = expandedDescriptions[proposal.id];
              const description = proposal.description || '';
              const shouldTruncate = description.length > 200 && !isExpanded;
              const displayDescription = shouldTruncate
                ? description.substring(0, 200) + '...'
                : description;

              return (
                <div key={proposal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold break-words break-all ">{proposal.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-600 break-words">{displayDescription}</p>
                    {description.length > 200 && (
                      <button
                        onClick={() => toggleDescription(proposal.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-1 font-medium"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {proposal.tags && proposal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {proposal.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        Speaker: {proposal.speaker?.name}
                      </span>
                      {proposal.filePath && (
                        <a
                          href={`http://localhost:8080/${proposal.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View PDF
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedProposal(proposal)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}

      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 break-words">Review: {selectedProposal.title}</h3>
            <ReviewForm
              proposal={selectedProposal}
              onSubmit={handleReviewSubmit}
              onCancel={() => setSelectedProposal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalsToReview;