import Link from 'next/link';
import { Button } from '../ui/button';
import { LuShoppingCart } from 'react-icons/lu';

async function CartButton() {
  // temporary value, replace this with your own logic
  const numberOfItems: number = 9;

  return (
    <Button
      asChild
      size='icon'
      variant='outline'
      className='flex justify-center items-center relative'
    >
      <Link href='/cart'>
        <LuShoppingCart />
        <span className='absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs'>
          {numberOfItems}
        </span>
      </Link>
    </Button>
  );
}

export default CartButton;
