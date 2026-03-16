import React, { useState, useEffect, useRef } from 'react';
import { useMyProposals } from '../../../hooks/useProposals';
import TagFilter from '../Reviewer/TagFilter';
import Pagination from '../../common/Pagination';
import { getTags } from '../../../services/api';

const MyProposals = () => {
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
  } = useMyProposals(apiFilters, page, 5);

  const proposals = data?.data || [];
  const pagination = data?.pagination || {};

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.tag, filters.status]);

  const availableTags = allTags

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

  const clearFilters = () => {
    setFilters({ search: '', tag: '', status: '' });
    setDebouncedSearch('');
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

  const toggleReviews = (proposalId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [proposalId]: !prev[proposalId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 text-sm mb-3">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isFetching && (
        <div className="flex justify-center py-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 mr-2"></div>
          <span className="text-sm text-gray-500">Updating results...</span>
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            name="search"
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-400"
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

        <div className="flex gap-2">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="">All status</option>
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

        {(filters.search || filters.tag || filters.status) && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Found {proposals.length} of {pagination.total} total
            </span>
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {pagination.total > 0 && (
        <div className="text-sm text-gray-500">
          Page {pagination.page} of {pagination.totalPages} ({pagination.total} total proposals)
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm">
            {pagination.total === 0
              ? "You haven't submitted any proposals yet."
              : "No proposals match your filters."}
          </p>
          {pagination.total > 0 && (
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {proposals.map((proposal) => {
              const isExpanded = expandedDescriptions[proposal.id];
              const showReviews = expandedReviews[proposal.id];
              const description = proposal.description || '';
              const shouldTruncate = description.length > 200 && !isExpanded;
              const displayDescription = shouldTruncate
                ? description.substring(0, 200) + '...'
                : description;

              return (
                <div key={proposal.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-medium text-gray-900 break-all">
                      {proposal.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 leading-relaxed break-all">
                      {displayDescription}
                    </p>
                    {description.length > 200 && (
                      <button
                        onClick={() => toggleDescription(proposal.id)}
                        className="text-xs text-gray-500 hover:text-gray-700 mt-1"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {proposal.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {proposal.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>Submitted {new Date(proposal.createdAt).toLocaleDateString()}</span>
                      {proposal.filePath && (
                        <a
                          href={`http://localhost:8080/${proposal.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View PDF
                        </a>
                      )}
                    </div>

                    {proposal.reviews?.length > 0 && (
                      <button
                        onClick={() => toggleReviews(proposal.id)}
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
                              <p className="text-xs text-gray-600">{review.comment}</p>
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

          {pagination.totalPages > 1 && (
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
};

export default MyProposals;


