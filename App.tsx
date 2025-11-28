import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import SearchModes from './components/SearchModes';
import { searchWithGoogleGrounding } from './services/geminiService';
import type { GroundingChunk, SearchMode } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<SearchMode>('all');

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setAiResponse(null);
    setSources([]);

    let finalQuery = searchQuery;
    if (mode === 'videos') {
      finalQuery = `Find videos about: ${searchQuery}`;
    }

    try {
      const result = await searchWithGoogleGrounding(finalQuery);
      setAiResponse(result.text);
      setSources(result.sources);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const Logo = () => (
    <div className="flex items-center justify-center space-x-3 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311l-3.75 0m3.75 0a12.064 12.064 0 0 0 4.5 0m-3.75 0a12.064 12.064 0 0 1-4.5 0m0 0H4.5m15 0a12.064 12.064 0 0 1-4.5 0m0 0v-5.25m0 5.25a12.064 12.064 0 0 0 4.5 0m0 0a12.064 12.064 0 0 1-4.5 0m0 0H4.5m15 0a12.064 12.064 0 0 1-4.5 0m0 0H4.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 2.24a14.98 14.98 0 0 0-6.16 12.12 14.98 14.98 0 0 0 6.16 12.12" />
        </svg>
        <h1 className="text-3xl font-bold tracking-tight">AI Web Explorer</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        <div className="w-full max-w-3xl text-center mb-10">
          <Logo />
          <p className="mt-4 text-lg text-gray-400">
            Your intelligent gateway to the web. Get direct answers, not just links.
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
          <SearchModes mode={mode} setMode={setMode} isLoading={isLoading} />
        </div>
        
        <div className="w-full mt-10 flex justify-center">
            {isLoading && <LoadingSpinner />}
        </div>
        
        {error && (
          <div className="mt-10 w-full max-w-3xl bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <ResultsDisplay aiResponse={aiResponse} sources={sources} mode={mode} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;