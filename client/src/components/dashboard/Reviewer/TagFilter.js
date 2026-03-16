import React, { useState } from 'react';

const TagFilter = ({ availableTags, selectedTag, onTagChange }) => {
  const [showAllTags, setShowAllTags] = useState(false);

  // Show first 5 tags 
  const popularTags = availableTags.slice(0, 5);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Filter by Tag
      </label>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => onTagChange('')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          All
        </button>

        {popularTags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagChange(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {tag}
          </button>
        ))}

        {availableTags.length > 5 && (
          <button
            onClick={() => setShowAllTags(true)}
            className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <span>+{availableTags.length - 5} more</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {showAllTags && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">All Tags</h3>
              <button
                onClick={() => setShowAllTags(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-1">
              <button
                onClick={() => {
                  onTagChange('');
                  setShowAllTags(false);
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                All
              </button>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    onTagChange(tag);
                    setShowAllTags(false);
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAllTags(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagFilter;