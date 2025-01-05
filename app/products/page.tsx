import ProductsContainer from '@/components/products/ProductsContainer';

/** URL search parameters for product filtering and display */
type SearchParamsType = {
  layout?: string; // Determines the layout style ('grid' or other)
  search?: string; // Search query string for filtering products
};

/**
 * Products page component that displays products with configurable layout and search
 * @param {Object} props - Component props
 * @param {SearchParamsType} props.searchParams - URL search parameters for filtering
 * @returns {Promise<JSX.Element>} Rendered ProductsContainer with layout and search props
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  // Extract and process search parameters
  const params = await searchParams;

  // Set default layout to 'grid' if not specified
  const layout = params?.layout || 'grid';
  // Set empty string as default search if not provided
  const search = params?.search || '';

  // Render products container with processed parameters
  return <ProductsContainer layout={layout} search={search} />;
}
