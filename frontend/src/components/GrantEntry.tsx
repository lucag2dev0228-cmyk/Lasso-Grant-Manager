import React, { useState } from 'react';
import { Grant, GrantFormData, MessageState } from '../types';
import { addGrants } from '../services/api';

interface GrantEntryProps {
  onGrantsAdded: (grants: Grant[]) => void;
  availableTags: string[];
  message?: MessageState | null;
  onClearMessage?: () => void;
}

const GrantEntry: React.FC<GrantEntryProps> = ({ 
  onGrantsAdded, 
  availableTags, 
  message, 
  onClearMessage 
}) => {
  const [formData, setFormData] = useState<GrantFormData>({
    grant_name: '',
    grant_description: '',
    website_urls: [''],
    document_urls: ['']
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onClearMessage?.();

    try {
      if (!formData.grant_name.trim() || !formData.grant_description.trim()) {
        throw new Error('Grant name and description are required');
      }

      const cleanWebsiteUrls = formData.website_urls.filter(url => url.trim() !== '');
      const cleanDocumentUrls = formData.document_urls.filter(url => url.trim() !== '');

      const grantData = {
        grant_name: formData.grant_name.trim(),
        grant_description: formData.grant_description.trim(),
        website_urls: cleanWebsiteUrls,
        document_urls: cleanDocumentUrls
      };

      const result = await addGrants([grantData]);
      onGrantsAdded(result.grants);
      resetForm();
    } catch (error) {
      console.error('Error adding grant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      grant_name: '',
      grant_description: '',
      website_urls: [''],
      document_urls: ['']
    });
  };

  const handleInputChange = (field: keyof GrantFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addUrlField = (type: 'website_urls' | 'document_urls') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const removeUrlField = (type: 'website_urls' | 'document_urls', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateUrlField = (type: 'website_urls' | 'document_urls', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((url, i) => i === index ? value : url)
    }));
  };

  const loadExampleData = () => {
    setFormData({
      grant_name: "Nutrient Management Farmer Education Grants",
      grant_description: "The Nutrient Management Farmer Education Grant Program supports nutrient management planning in Wisconsin by funding entities to educate farmers. Its goal is to enable farmers to write their own nutrient management plans and improve their understanding of nutrient management principles. Projects focus on compliance with the 2015 NRCS 590 nutrient management plan standards.",
      website_urls: ["https://datcp.wi.gov/Pages/Programs_Services/NMFEGrants.aspx"],
      document_urls: ["https://datcp.wi.gov/Documents2/NMFERFA.pdf"]
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Grants</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grant Name */}
          <div>
            <label htmlFor="grant-name" className="block text-sm font-medium text-gray-700 mb-2">
              Grant Name *
            </label>
            <input
              id="grant-name"
              type="text"
              value={formData.grant_name}
              onChange={(e) => handleInputChange('grant_name', e.target.value)}
              placeholder="Enter the grant name..."
              className="input-field"
              required
            />
          </div>

          {/* Grant Description */}
          <div>
            <label htmlFor="grant-description" className="block text-sm font-medium text-gray-700 mb-2">
              Grant Description *
            </label>
            <textarea
              id="grant-description"
              value={formData.grant_description}
              onChange={(e) => handleInputChange('grant_description', e.target.value)}
              placeholder="Enter a detailed description of the grant..."
              className="input-field h-32 resize-none"
              required
            />
          </div>

          {/* Website URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URLs
            </label>
            <div className="space-y-2">
              {formData.website_urls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateUrlField('website_urls', index, e.target.value)}
                    placeholder="https://example.com/grant-info"
                    className="input-field flex-1"
                  />
                  {formData.website_urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlField('website_urls', index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addUrlField('website_urls')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                + Add Website URL
              </button>
            </div>
          </div>

          {/* Document URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document URLs
            </label>
            <div className="space-y-2">
              {formData.document_urls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateUrlField('document_urls', index, e.target.value)}
                    placeholder="https://example.com/grant-guidelines.pdf"
                    className="input-field flex-1"
                  />
                  {formData.document_urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlField('document_urls', index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addUrlField('document_urls')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                + Add Document URL
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={loadExampleData}
              className="btn-secondary"
            >
              Load Example Data
            </button>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.grant_name.trim() || !formData.grant_description.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Add Grant'}
              </button>
            </div>
          </div>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Available Tags Reference */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Tags</h3>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Grants will be automatically tagged based on their content using these predefined categories.
        </p>
      </div>
    </div>
  );
};

export default GrantEntry;
