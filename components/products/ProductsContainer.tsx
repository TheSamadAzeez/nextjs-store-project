import ProductsGrid from './ProductsGrid';
import ProductsList from './ProductsList';
import { LuLayoutGrid, LuList } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fetchAllProducts } from '@/utils/actions';
import Link from 'next/link';

async function ProductsContainer({
  layout,
  search,
}: {
  layout: string;
  search: string;
}) {
  const products = await fetchAllProducts();
  const totalProducts = products.length;
  const searchTerm = search ? `&search=${search}` : '';
  return (
    <>
      {/* HEADER */}
      <section></section>
      {/* PRODUCTS */}
      <div>
        {totalProducts === 0 ? (
          <h5 className='text-2xl mt-16'>
            Sorry, no products matched your search criteria ...
          </h5>
        ) : layout === 'grid' ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
    </>
  );
}

export default ProductsContainer;
