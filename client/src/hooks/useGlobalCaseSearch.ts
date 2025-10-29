import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface CaseSearchResult {
  id: string;
  case_code: string;
  title: string;
  category: string | null;
  subcategory: string | null;
  level: string;
  verified: boolean;
  rank?: number;
}

/**
 * Global case search hook with debouncing
 * Searches cases by case_code or title only
 *
 * @param query - Search query string
 * @param debounceMs - Debounce delay in milliseconds (default: 300ms)
 * @returns Object containing results, loading state, and error
 */
export function useGlobalCaseSearch(query: string, debounceMs = 300) {
  const [results, setResults] = useState<CaseSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear results if query is empty or too short
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Debounce search
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);

      abortControllerRef.current = new AbortController();

      try {
        console.log('🔍 Searching for:', query);

        // Call Supabase RPC function
        const { data, error: searchError } = await supabase
          .rpc('search_cases', {
            search_query: query.trim(),
            max_results: 10
          });

        if (searchError) {
          console.error('Search error:', searchError);
          throw new Error(searchError.message);
        }

        console.log(`✓ Found ${data?.length || 0} results`);
        setResults(data || []);
      } catch (err: any) {
        // Don't show error if request was aborted (user is still typing)
        if (err.name !== 'AbortError') {
          console.error('Search error:', err);
          setError(err.message || 'Eroare la căutare');
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, debounceMs]);

  return { results, loading, error };
}
