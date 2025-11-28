
import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk } from '../types';
import { GEMINI_MODEL } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

export const searchWithGoogleGrounding = async (query: string): Promise<SearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

    const validSources = sources.filter((source: unknown): source is GroundingChunk => 
      typeof source === 'object' && source !== null && 'web' in source &&
      typeof (source as GroundingChunk).web === 'object' && (source as GroundingChunk).web !== null &&
      'uri' in (source as GroundingChunk).web && 'title' in (source as GroundingChunk).web
    );

    return { text, sources: validSources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching from the Gemini API.");
  }
};
