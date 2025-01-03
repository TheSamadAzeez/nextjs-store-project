import ProductsGrid from './ProductsGrid';
import ProductsList from './ProductsList';
import { LuLayoutGrid, LuList } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fetchAllProducts } from '@/utils/actions';
import Link from 'next/link';

function ProductsContainer({
  layout,
  search,
}: {
  layout: string;
  search: string;
}) {
  return <div>ProductsContainer</div>;
}

export default ProductsContainer;
