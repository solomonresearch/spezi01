import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGlobalCaseSearch, type CaseSearchResult } from '../hooks/useGlobalCaseSearch';
import { Search, X, Check, Loader2 } from 'lucide-react';

interface Props {
  onSelectCase: (result: CaseSearchResult) => void;
  placeholder?: string;
}

/**
 * Global case search autocomplete component
 * - Shows dynamic dropdown results as user types
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape)
 * - Click outside to close
 * - Highlights matching text in results
 * - Scrollable dropdown with max height of 400px
 */
export function CaseSearchAutocomplete({ onSelectCase, placeholder }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { results, loading, error } = useGlobalCaseSearch(query);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open dropdown when results appear
  useEffect(() => {
    if (results.length > 0 && query.trim().length >= 2) {
      setIsOpen(true);
      setSelectedIndex(-1); // Reset selection when results change
    } else if (results.length === 0 && !loading && query.trim().length >= 2) {
      setIsOpen(true); // Show "no results" message
    }
  }, [results, query, loading]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (result: CaseSearchResult) => {
    console.log('📍 Case selected from search:', result.case_code);
    onSelectCase(result);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getDifficultyColor = (level: string) => {
    const normalized = level.toLowerCase();
    if (normalized === 'ușor') return 'bg-green-500';
    if (normalized === 'mediu') return 'bg-yellow-500';
    if (normalized === 'dificil') return 'bg-red-500';
    return 'bg-gray-500';
  };

  // Highlight matched text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder || 'Caută caz după cod sau titlu...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length >= 2 && (results.length > 0 || error)) {
              setIsOpen(true);
            }
          }}
          className="pl-9 pr-8"
          autoComplete="off"
          aria-label="Search cases"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
        />
        {loading && (
          <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {query && !loading && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
            title="Șterge căutarea"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.trim().length >= 2 && (
        <div
          ref={dropdownRef}
          id="search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden"
        >
          <ScrollArea className="max-h-[400px]">
            {error ? (
              <div className="p-4 text-center text-sm text-destructive">
                {error}
              </div>
            ) : results.length === 0 && !loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Nu s-au găsit cazuri pentru &quot;{query}&quot;
              </div>
            ) : (
              <ul>
                {results.map((result, index) => (
                  <li key={result.id} role="option" aria-selected={index === selectedIndex}>
                    <button
                        ref={(el) => (resultRefs.current[index] = el)}
                        onClick={() => handleSelect(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                          index === selectedIndex
                            ? 'bg-accent'
                            : 'hover:bg-accent/50'
                        }`}
                      >
                        {/* Difficulty Badge */}
                        <div className="flex-shrink-0 pt-1">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${getDifficultyColor(
                              result.level
                            )}`}
                            title={result.level}
                          />
                        </div>

                        {/* Case Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-semibold text-primary">
                              {highlightMatch(result.case_code, query)}
                            </span>
                            {result.verified && (
                              <Check className="h-3 w-3 text-green-600" title="Verificat" />
                            )}
                          </div>
                          <p className="text-sm line-clamp-2">
                            {highlightMatch(result.title, query)}
                          </p>
                          {(result.category || result.subcategory) && (
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {result.category && (
                                <Badge variant="outline" className="text-xs">
                                  {result.category}
                                </Badge>
                              )}
                              {result.subcategory && (
                                <span className="text-xs text-muted-foreground truncate">
                                  {result.subcategory}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
