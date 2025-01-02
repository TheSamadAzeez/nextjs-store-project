import { formatCurrency } from '@/utils/format';
import { Product } from '@prisma/client';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';

function ProductsGrid({ products }: { products: Product[] }) {
  return (
    // Grid container with top padding and responsive column layout
    // pt-12: padding top of 3rem
    // grid: creates a grid layout
    // gap-4: gap of 1rem between grid items
    // md:grid-cols-2: 2 columns on medium screens
    // lg:grid-cols-3: 3 columns on large screens
    <div className='pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {products.map((product) => {
        const { id: productId, name, price, image } = product;
        const dollarsAmount = formatCurrency(price);

        return (
          // group: enables hover effects on child elements
          // relative: enables absolute positioning of children
          <article key={productId} className='group relative'>
            <Link href={`/products/${productId}`}>
              {/* Card with hover effect */}
              {/* transform: enables CSS transforms */}
              {/* group-hover:shadow-lg: adds large shadow on group hover */}
              {/* transition-shadow: smooth shadow transition */}
              <Card className='transform group-hover:shadow-lg transition-shadow duration-500'>
                <CardContent className='p-4'>
                  {/* Image container */}
                  {/* h-64: height on mobile */}
                  {/* md:h-48: reduced height on medium screens */}
                  {/* rounded: rounded corners */}
                  {/* overflow-hidden: clips image content */}
                  <div className='relative h-64 md:h-48 rounded overflow-hidden'>
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw'
                      priority
                      // Image hover zoom effect
                      // group-hover:scale-110: enlarges image on hover
                      // transition-transform: smooth zoom transition
                      className='rounded w-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export default ProductsGrid;
