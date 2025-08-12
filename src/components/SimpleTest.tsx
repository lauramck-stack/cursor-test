import React, { useState, useEffect } from 'react';

export const SimpleTest: React.FC = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<string>('No data yet');

  useEffect(() => {
    console.log('🧪 SimpleTest component mounted');
    setData('Component loaded successfully!');
  }, []);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 m-4">
      <h2 className="text-lg font-semibold text-green-800 mb-2">Simple Test Component</h2>
      <p className="text-green-700 mb-2">{data}</p>
      <p className="text-green-700 mb-4">Counter: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        Increment Counter
      </button>
      <div className="mt-4 text-xs text-green-600">
        <p>✅ If you can see this, React is working!</p>
        <p>✅ If the counter increments, state is working!</p>
        <p>✅ Check browser console for component logs</p>
      </div>
    </div>
  );
};
