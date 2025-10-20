import React from 'react';
import { Grant } from '../types';
import { useFilters } from '../hooks/useFilters';

interface GrantDisplayProps {
  grants: Grant[];
  availableTags: string[];
}

const GrantDisplay: React.FC<GrantDisplayProps> = ({ grants }) => {
  const { selectedTag, allTags, filteredGrants, setSelectedTag } = useFilters(grants);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Filters */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Grant Directory</h2>
        
        <div className="mb-4">
          <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Tag
          </label>
          <select
            id="tag-filter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="input-field"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag} ({grants.filter(g => g.tags.includes(tag)).length})
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredGrants.length} of {grants.length} grants
        </div>
      </div>

      {/* Grants List */}
      {filteredGrants.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No grants found</h3>
          <p className="text-gray-500">
            {grants.length === 0 
              ? "No grants have been added yet. Add some grants to get started!"
              : "Try adjusting your filter criteria."
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredGrants.map((grant, index) => (
            <div key={`${grant.grant_name}-${index}`} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 pr-4">
                  {grant.grant_name}
                </h3>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {grant.tags.length} tag{grant.tags.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                {grant.grant_description}
              </p>

              {/* URLs Section */}
              {((grant.website_urls && grant.website_urls.length > 0) || (grant.document_urls && grant.document_urls.length > 0)) && (
                <div className="mb-4 space-y-2">
                  {grant.website_urls && grant.website_urls.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Website URLs:</h4>
                      <div className="flex flex-wrap gap-2">
                        {grant.website_urls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-800 text-sm underline"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {grant.document_urls && grant.document_urls.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Document URLs:</h4>
                      <div className="flex flex-wrap gap-2">
                        {grant.document_urls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-800 text-sm underline"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {grant.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="tag cursor-pointer hover:bg-primary-200 transition-colors duration-200"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrantDisplay;
