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
  const params = await searchParams;
  // assign default values to the params object
  const layout = params?.layout || 'grid';
  const search = params?.search || '';
  // console.log(searchParams);

  return <ProductsContainer layout={layout} search={search} />;
}
