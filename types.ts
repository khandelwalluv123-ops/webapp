export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: WebSource;
}

export type SearchMode = 'all' | 'ai' | 'videos';
