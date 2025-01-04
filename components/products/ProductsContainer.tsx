import ProductsGrid from './ProductsGrid';
import ProductsList from './ProductsList';
import { LuLayoutGrid, LuList } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fetchAllProducts } from '@/utils/actions';
import Link from 'next/link';

// Component props: layout (grid/list view) and search query
async function ProductsContainer({
  layout,
  search,
}: {
  layout: string;
  search: string;
}) {
  // Fetch products and prepare display data
  const products = await fetchAllProducts({ search });
  const totalProducts = products.length;
  const searchTerm = search ? `&search=${search}` : '';

  return (
    <>
      {/* Header section with product count and layout toggle */}
      <section>
        {/* Product count and layout controls container */}
        <div className='flex justify-between items-center'>
          {/* Product count display */}
          <h4 className='font-medium text-lg'>
            {totalProducts} product{totalProducts > 1 ? 's' : ''}
          </h4>
          {/* Layout toggle buttons */}
          <div className='flex gap-x-4'>
            {/* Grid layout button */}
            <Button
              variant={layout === 'grid' ? 'default' : 'ghost'}
              size='icon'
              asChild
            >
              <Link href={`/products?layout=grid${searchTerm}`}>
                <LuLayoutGrid />
              </Link>
            </Button>

            {/* List layout button */}
            <Button
              variant={layout === 'list' ? 'default' : 'ghost'}
              size='icon'
              asChild
            >
              <Link href={`/products?layout=list${searchTerm}`}>
                <LuList />
              </Link>
            </Button>
          </div>
        </div>

        <Separator className='mt-4' />
      </section>

      {/* Products display section */}
      <div>
        {totalProducts === 0 ? (
          // No results message
          <h5 className='text-2xl mt-16'>
            Sorry, no products matched your search criteria ...
          </h5>
        ) : layout === 'grid' ? (
          // Grid layout view
          <ProductsGrid products={products} />
        ) : (
          // List layout view
          <ProductsList products={products} />
        )}
      </div>
    </>
  );
}

export default ProductsContainer;
