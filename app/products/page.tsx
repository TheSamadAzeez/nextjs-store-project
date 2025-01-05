import ProductsContainer from '@/components/products/ProductsContainer';

/** URL search parameters for product filtering and display */
type SearchParamsType = {
  layout?: string; // Determines the layout style ('grid' or other)
  search?: string; // Search query string for filtering products
};

/**
 * Products page component that displays products with configurable layout and search
 */
async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  // Await the searchParams to properly handle them in the server component
  const params = await Promise.resolve(searchParams);

  const layout = params?.layout || 'grid';
  const search = params?.search || '';

  return <ProductsContainer layout={layout} search={search} />;
}

export default ProductsPage;
