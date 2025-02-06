import { useState } from 'react';

const SwitchTabs = ({ activeTab, setActiveTab }) => {

  return (
    <div className="flex justify-center border-b border-gray-300">
      <button
        className={`px-4 py-2 ${
          activeTab === 'comments' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'
        }`}
        onClick={() => setActiveTab('comments')}
      >
        Comments
      </button>
      <button
        className={`px-4 py-2 ${
          activeTab === 'history' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'
        }`}
        onClick={() => setActiveTab('history')}
      >
        History
      </button>
    </div>
  );
};

export default SwitchTabs;
