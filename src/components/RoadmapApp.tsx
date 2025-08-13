import React, { useState, useEffect } from 'react';
import { sampleData } from '../data/sampleData';

const RoadmapApp: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      // Load sample data
      console.log('Loading sample data...', sampleData);
      console.log('Sample data type:', typeof sampleData);
      console.log('Sample data keys:', Object.keys(sampleData));
      
      if (sampleData && sampleData.items && sampleData.categories) {
        setItems(sampleData.items);
        setCategories(sampleData.categories);
        console.log('Data loaded successfully');
      } else {
        console.error('Sample data is missing or malformed:', sampleData);
        setError('Sample data is missing or malformed');
      }
    } catch (err) {
      console.error('Error loading sample data:', err);
      setError(`Error loading data: ${err}`);
    }
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Items state:', items);
    console.log('Categories state:', categories);
  }, [items, categories]);

  // If there's an error, show it
  if (error) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b' }}>
        <h1>Error Loading Roadmap</h1>
        <p>{error}</p>
        <pre>{JSON.stringify(sampleData, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Roadmap Dashboard</h1>
          <p className="text-gray-600 mb-4">Track and manage your development roadmap</p>
          
          {/* Debug Info */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-yellow-800">Debug Info:</h3>
            <p className="text-yellow-800">Items loaded: {items.length}</p>
            <p className="text-yellow-800">Categories loaded: {categories.length}</p>
            <p className="text-yellow-800">Sample data available: {sampleData ? 'Yes' : 'No'}</p>
            <p className="text-yellow-800">Sample data type: {typeof sampleData}</p>
            <p className="text-yellow-800">Sample data keys: {sampleData ? Object.keys(sampleData).join(', ') : 'None'}</p>
          </div>
          
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#1B3A29]">{items.length}</div>
              <div className="text-sm text-[#1B3A29]">Total Items</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {items.filter(item => item.status === 'completed').length}
              </div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#77AA89]">
                {items.filter(item => item.status === 'in-progress').length}
              </div>
              <div className="text-sm text-[#77AA89]">In Progress</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {items.length > 0 ? Math.round((items.filter(item => item.status === 'completed').length / items.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
        </div>

        {/* Simple Items Display */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Roadmap Items</h2>
          {items.length === 0 ? (
            <div>
              <p className="text-gray-500">No items loaded yet...</p>
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h4 className="font-bold">Raw sample data:</h4>
                <pre className="text-xs overflow-auto">{JSON.stringify(sampleData, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-green-600 mb-4">✅ Items loaded successfully! Showing {items.length} items.</p>
              <div className="space-y-4">
                {items.slice(0, 3).map((item, index) => {
                  console.log('Rendering item:', item, 'at index:', index);
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <div className="mt-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                          {item.status}
                        </span>
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapApp;
