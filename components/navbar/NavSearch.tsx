'use client';

// Import required UI components and hooks
import { Input } from '../ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';

/**
 * NavSearch Component
 * Provides a search input field with debounced URL updates
 * Updates the URL search parameters as the user types
 */
function NavSearch() {
  // Hook to access and manipulate URL search parameters
  const searchParams = useSearchParams();
  // Hook for programmatic navigation
  const { replace } = useRouter();

  // State to manage the search input value
  // Initialize with existing search parameter or empty string
  const [search, setSearch] = useState(
    searchParams.get('search')?.toString() || ''
  );

  /**
   * Debounced function to handle search parameter updates
   * Prevents excessive URL updates while typing
   * @param value - The search input value
   */
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    // Add or remove search parameter based on input value
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    // Update URL with new search parameters
    replace(`/products?${params.toString()}`);
  }, 300); // 300ms delay

  // Reset search input when search parameter is removed
  useEffect(() => {
    if (!searchParams.get('search')) {
      setSearch('');
    }
  }, [searchParams.get('search')]);

  return (
    <Input
      type='search'
      placeholder='search product...'
      className='max-w-xs dark:bg-muted'
      value={search}
      onChange={(e) => {
        // Update local state and trigger debounced search
        setSearch(e.target.value);
        handleSearch(e.target.value);
      }}
    />
  );
}

export default NavSearch;
