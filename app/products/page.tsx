import ProductsContainer from '@/components/products/ProductsContainer';

/** URL search parameters for product filtering and display */
type SearchParamsType = {
  layout?: string;
  search?: string;
};

/** Products page with layout and search functionality */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  // assign default values to the params object
  const layout = searchParams.layout || 'grid';
  const search = searchParams.search || '';
  // console.log(searchParams);

  return <ProductsContainer layout={layout} search={search} />;
}
