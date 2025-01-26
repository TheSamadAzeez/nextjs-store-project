import { auth } from '@clerk/nextjs/server';
import { Button } from '../ui/button';
import { FaHeart } from 'react-icons/fa';
import { CardSigninButton } from '../form/Buttons';
import { fetchFavoriteId } from '@/utils/actions';
import FavoriteToggleForm from './FavoriteToggleForm';

async function FavoriteToggleButton({ productId }: { productId: string }) {
  const { userId } = await auth();
  if (!userId) {
    return <CardSigninButton />;
  }
  const favoriteId = await fetchFavoriteId({ productId });

  return (
    <FavoriteToggleForm
      favoriteId={favoriteId}
      productId={productId}
    ></FavoriteToggleForm>
  );
}

export default FavoriteToggleButton;
