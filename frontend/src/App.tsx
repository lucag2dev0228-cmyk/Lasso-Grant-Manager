/**
 * Main App component for the Lasso Grant Manager.
 */
import React, { useState } from 'react';
import GrantEntry from './components/GrantEntry';
import GrantDisplay from './components/GrantDisplay';
import Header from './components/Header';
import { useGrants } from './hooks/useGrants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'entry' | 'display'>('entry');
  const { grants, availableTags, addGrants, message, clearMessage } = useGrants();

  const handleGrantsAdded = (newGrants: any[]) => {
    addGrants(newGrants);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('entry')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'entry'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add Grants
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'display'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              View Grants ({grants.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'entry' && (
          <GrantEntry 
            onGrantsAdded={handleGrantsAdded} 
            availableTags={availableTags}
            message={message}
            onClearMessage={clearMessage}
          />
        )}
        {activeTab === 'display' && (
          <GrantDisplay grants={grants} availableTags={availableTags} />
        )}
      </div>
    </div>
  );
}

export default App;