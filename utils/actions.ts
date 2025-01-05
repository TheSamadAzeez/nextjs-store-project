// Database utility functions for product-related operations
import prisma from '@/utils/db';

// Retrieves products marked as featured from the database
export const fetchFeaturedProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

// Searches and retrieves products based on name or company
// Accepts a search parameter and performs case-insensitive matching
export const fetchAllProducts = async ({ search = '' }: { search: string }) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            company: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
