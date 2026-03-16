import React from 'react';
import { useMyReviews } from '../../../hooks/useProposals';

const ReviewHistory = () => {
    const {
        data: reviews = [],
        isLoading,
        isError,
        error,
        refetch
    } = useMyReviews();

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading your reviews...</p>
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

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="mt-2 text-gray-500">You haven't reviewed any proposals yet.</p>
                <p className="text-sm text-gray-400">Head over to the proposals tab to start reviewing!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Reviews ({reviews.length})</h3>
            </div>

            {reviews.map(review => (
                <div key={review.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 break-all">{review.proposal?.title}</h4>
                        <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                        by {review.proposal?.speaker?.name || 'Unknown'}
                    </p>

                    <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                            <div className="flex mr-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {review.rating}/5
                            </span>
                        </div>

                        {review.comment && (
                            <p className="text-gray-700 text-sm bg-white p-2 rounded border border-gray-100 break-words whitespace-pre-wrap">
                                {review.comment}
                            </p>
                        )}
                    </div>

                </div>
            ))}
        </div>
    );
};

export default ReviewHistory;
