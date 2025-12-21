'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Search } from 'lucide-react';

function SearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQ);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  // Debounced autosuggest (Flipkart-style live typeahead)
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 200); // small debounce

    return () => clearTimeout(id);
  }, [query]);

  const goToSearch = (q) => {
    if (!q.trim()) return;
    setOpen(false);
    setActiveIndex(-1);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    goToSearch(query);
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        e.preventDefault();
        const chosen = suggestions[activeIndex];
        setQuery(chosen.text);
        goToSearch(chosen.text);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
            }}
            onFocus={() => suggestions.length && setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search by name, category, or list item..."
            className="w-full rounded-full border px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 transform"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg max-h-64 overflow-y-auto">
          {loading && suggestions.length === 0 && (
            <div className="px-4 py-2 text-xs text-gray-500">Searching…</div>
          )}

          {suggestions.map((s, idx) => (
            <button
              key={s.text + idx}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery(s.text);
                goToSearch(s.text);
              }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                idx === activeIndex ? 'bg-rose-50' : 'bg-white'
              }`}
            >
              {s.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={
      <div className="relative w-full max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, category, or list item..."
            className="w-full rounded-full border px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
            disabled
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 transform"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    }>
      <SearchBarContent />
    </Suspense>
  );
}
