import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/theme.css";

/**
 * Debounce hook to delay updates for the provided value.
 */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// PUBLIC_INTERFACE
export default function SearchBar({ onSearch, loading }) {
  /**
   * Search bar with debounced input. Calls onSearch when user presses Enter
   * or clicks Search. Debounced value is available for future incremental search.
   */
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);
  const inputRef = useRef(null);

  // Optionally, could trigger live search with debounced value:
  useEffect(() => {
    // For now we keep explicit actions (Enter or button click) to search.
    // This effect is here to demonstrate debounced value availability.
  }, [debounced]);

  const canSearch = useMemo(() => query.trim().length > 0 && !loading, [query, loading]);

  const handleSearch = () => {
    const value = query.trim();
    if (!value) return;
    onSearch?.(value);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && canSearch) {
      handleSearch();
    }
  };

  return (
    <div className="card" role="search" aria-label="City search">
      <div className="search-wrap" style={{ padding: 14 }}>
        <label htmlFor="city" className="sr-only" aria-hidden="true" style={{ position: "absolute", left: -9999 }}>
          City
        </label>
        <input
          ref={inputRef}
          id="city"
          name="city"
          type="text"
          className="input"
          placeholder="Search city (e.g., London, Tokyo)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="City name"
          aria-describedby="search-help"
          aria-busy={loading}
          disabled={loading}
        />
        <button
          className={`btn ${loading ? "btn-outline" : ""}`}
          onClick={handleSearch}
          disabled={!canSearch}
          aria-label="Search weather"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      <div id="search-help" style={{ padding: "0 14px 14px", color: "var(--color-muted)", fontSize: 12 }}>
        Press Enter or click Search. Debounced input prevents unnecessary requests.
      </div>
    </div>
  );
}
