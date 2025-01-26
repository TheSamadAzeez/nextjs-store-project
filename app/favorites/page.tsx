import { fetchUserFavorites } from '@/utils/actions';
import SectionTitle from '@/components/global/SectionTitle';
import ProductsGrid from '@/components/products/ProductsGrid';

// Fetches the user's favorite products and displays them in a grid
async function FavoritesPage() {
  const favorites = await fetchUserFavorites();

  if (favorites.length === 0) {
    return <SectionTitle text='You have no favorites yet.' />;
  }

  return (
    <div>
      <SectionTitle text='Favorites' />
      {/* pass the favorite product to the ProductsGrid component to display the favorite products */}
      <ProductsGrid products={favorites.map((favorite) => favorite.product)} />
    </div>
  );
}

export default FavoritesPage;
