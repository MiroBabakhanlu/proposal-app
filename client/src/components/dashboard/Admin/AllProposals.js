import React, { useState, useEffect, useRef } from 'react';
import { useProposals } from '../../../hooks/useProposals';
import TagFilter from '../Reviewer/TagFilter';
import Pagination from '../../common/Pagination';
import { getTags } from '../../../services/api';

const AllProposals = ({ onSelectProposal, selectedProposalId }) => {
  const [filters, setFilters] = useState({
    search: '',
    tag: '',
    status: ''
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [expandedReviews, setExpandedReviews] = useState({});
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
    tag: filters.tag,
    status: filters.status
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useProposals(apiFilters, page, 5);

  const proposals = data?.data || [];
  const pagination = data?.pagination || {};

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.tag, filters.status]);

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const { data } = await getTags();
        setAllTags(data.map(tag => tag?.name)); 
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

  const toggleDescription = (proposalId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [proposalId]: !prev[proposalId]
    }));
  };

  // ← ADD THIS
  const toggleReviews = (proposalId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [proposalId]: !prev[proposalId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
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
      <div className="space-y-4">
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

        <div className="flex gap-4">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <div className="flex-1">
            <TagFilter
              availableTags={availableTags}
              selectedTag={filters.tag}
              onTagChange={handleTagChange}
            />
          </div>
        </div>
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
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-gray-500">No proposals found.</p>
          <p className="text-sm text-gray-400">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map(proposal => {
            const isExpanded = expandedDescriptions[proposal.id];
            const showReviews = expandedReviews[proposal.id]; // ← ADD THIS
            const description = proposal.description || '';
            const shouldTruncate = description.length > 200 && !isExpanded;
            const displayDescription = shouldTruncate
              ? description.substring(0, 200) + '...'
              : description;

            return (
              <div
                key={proposal.id}
                onClick={() => onSelectProposal(proposal)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedProposalId === proposal.id
                  ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-400 hover:shadow'
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold break-all">{proposal.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                    {proposal.status}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-gray-600 break-all">{displayDescription}</p>
                  {description.length > 200 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDescription(proposal.id);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-1 font-medium"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {proposal.tags?.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span>Speaker: {proposal.speaker?.name}</span>
                    <span className="text-gray-400">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                    {proposal.filePath && (
                      <a
                        href={`http://localhost:8080/${proposal.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View PDF
                      </a>
                    )}
                  </div>

                  {proposal.reviews?.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReviews(proposal.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <span>{proposal.reviews.length} review{proposal.reviews.length > 1 ? 's' : ''}</span>
                      <span className="text-xs">{showReviews ? '▲' : '▼'}</span>
                    </button>
                  )}
                </div>

                {showReviews && proposal.reviews?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-700 mb-2">Reviews</p>
                    <div className="space-y-2">
                      {proposal.reviews.map(review => (
                        <div key={review.id} className="bg-gray-50 p-2 rounded text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-700">
                                {review.reviewer?.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                Rating: {review.rating}/5
                              </span>
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-xs text-gray-600 break-words whitespace-pre-wrap">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default AllProposals;