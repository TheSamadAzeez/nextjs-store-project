'use client';
import ProductsContainer from '@/components/products/ProductsContainer';
import { useSearchParams } from 'next/navigation';

/** URL search parameters for product filtering and display */
interface SearchParamsType {
  layout?: string; // 'grid' or 'list' display
  search?: string; // search query
}

/** Products page with layout and search functionality */
function ProductsPage() {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams) as SearchParamsType;
  // assign default values to the params object
  const layout = params.layout || 'grid';
  const search = params.search || '';
  console.log(params);

  return <ProductsContainer layout={layout} search={search} />;
}

export default ProductsPage;
