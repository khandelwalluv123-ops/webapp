import React from 'react';
import type { GroundingChunk, SearchMode } from '../types';

interface ResultsDisplayProps {
  aiResponse: string | null;
  sources: GroundingChunk[];
  mode: SearchMode;
}

const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
    </svg>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ aiResponse, sources, mode }) => {
  if (!aiResponse) {
    if (mode === 'ai') {
        return (
            <div className="mt-10 text-center text-gray-400 max-w-xl">
                <h3 className="text-xl font-semibold text-white mb-2">AI Mode</h3>
                <p>Get a direct, intelligent answer synthesized from multiple web sources. This mode is best for questions where you want a comprehensive summary rather than just a list of links.</p>
            </div>
        )
    }
    return null;
  }
  
  const formatUri = (uri: string) => {
    try {
      const url = new URL(uri);
      return url.hostname.replace(/^www\./, '');
    } catch (e) {
      return uri;
    }
  };
  
  if (mode === 'videos') {
    return (
        <div className="w-full max-w-5xl mx-auto mt-12">
            {sources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sources.map((source, index) => (
                        <a 
                            key={index} 
                            href={source.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 flex flex-col group hover:border-blue-500 transition-all duration-300"
                        >
                            <div className="relative aspect-video bg-gray-900 rounded-md flex items-center justify-center mb-4">
                                <VideoIcon className="w-12 h-12 text-gray-600 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <h3 className="text-base font-medium text-gray-200 group-hover:text-blue-400 mb-1 flex-grow">
                                {source.web.title || "Untitled Video"}
                            </h3>
                            <p className="text-sm text-gray-500 group-hover:text-gray-400">
                                {formatUri(source.web.uri)}
                            </p>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400">
                    <p>No video results found for your query.</p>
                </div>
            )}
        </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Answer</h2>
        <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap font-sans">
          {aiResponse}
        </div>
      </div>

      {sources.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Sources</h3>
          <ul className="space-y-3">
            {sources.map((source, index) => (
              <li key={index} className="flex items-start group">
                <span className="text-blue-500 mr-3 mt-1">&#10148;</span>
                <div>
                    <a
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-200 text-base font-medium group-hover:text-blue-400 group-hover:underline transition-colors"
                    >
                        {source.web.title || "Untitled Source"}
                    </a>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                        {formatUri(source.web.uri)}
                    </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
