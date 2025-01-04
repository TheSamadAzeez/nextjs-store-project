'use client';
// Import required dependencies
import { Input } from '../ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';

// NavSearch component handles real-time search functionality
function NavSearch() {
  // Get access to search parameters and navigation
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // Initialize search state with existing search param or empty string
  const [search, setSearch] = useState(
    searchParams.get('search')?.toString() || ''
  );

  // Debounced search handler to prevent excessive URL updates
  // Waits 300ms after user stops typing before updating
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    // Update URL params based on search value
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    // Navigate to products page with updated search params
    replace(`/products?${params.toString()}`);
  }, 300);

  return (
    // Search input field
    <Input
      type='search'
      placeholder='search product...'
      className='max-w-xs dark:bg-muted'
      value={search}
      onChange={(e) => {
        // Update local state and trigger search on input change
        setSearch(e.target.value);
        handleSearch(e.target.value);
      }}
    />
  );
}

export default NavSearch;
