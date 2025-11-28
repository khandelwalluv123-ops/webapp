import React from 'react';
import type { SearchMode } from '../types';

interface SearchModesProps {
  mode: SearchMode;
  setMode: (mode: SearchMode) => void;
  isLoading: boolean;
}

const SearchModes: React.FC<SearchModesProps> = ({ mode, setMode, isLoading }) => {
  const modes: { id: SearchMode; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'ai', label: 'AI Mode' },
    { id: 'videos', label: 'Videos' },
  ];

  const buttonBaseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "bg-gray-800 text-gray-300 hover:bg-gray-700";

  return (
    <div className="flex justify-center space-x-2 mt-6">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          disabled={isLoading}
          className={`${buttonBaseClasses} ${mode === m.id ? activeClasses : inactiveClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-pressed={mode === m.id}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
};

export default SearchModes;
