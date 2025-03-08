// Import necessary components and utilities
import ProductsGrid from "./ProductsGrid";
import ProductsList from "./ProductsList";
import { LuLayoutGrid, LuList } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchAllProducts } from "@/utils/actions";
import Link from "next/link";

/**
 * ProductsContainer - A component that displays products in either grid or list layout
 * @param layout - The current layout view ('grid' or 'list')
 * @param search - Search query string for filtering products
 */
async function ProductsContainer({
  layout,
  search,
}: {
  layout: string;
  search: string;
}) {
  // Fetch products based on search criteria
  const products = await fetchAllProducts({ search });
  // Calculate total number of products for display
  const totalProducts = products.length;
  // Prepare search parameter for URL
  const searchTerm = search ? `&search=${search}` : "";

  return (
    <>
      {/* Header section containing product count and view toggles */}
      <section>
        <div className="flex items-center justify-between">
          {/* Display total number of products with proper pluralization */}
          <h4 className="text-lg font-medium">
            {totalProducts} product{totalProducts > 1 ? "s" : ""}
          </h4>

          {/* Layout toggle buttons container */}
          <div className="flex gap-x-4">
            {/* Grid view toggle - active state handled by variant prop */}
            <Button
              variant={layout === "grid" ? "default" : "ghost"}
              size="icon"
              asChild
            >
              <Link href={`/products?layout=grid${searchTerm}`}>
                <LuLayoutGrid />
              </Link>
            </Button>

            {/* List view toggle - active state handled by variant prop */}
            <Button
              variant={layout === "list" ? "default" : "ghost"}
              size="icon"
              asChild
            >
              <Link href={`/products?layout=list${searchTerm}`}>
                <LuList />
              </Link>
            </Button>
          </div>
        </div>

        {/* Visual separator between header and product display */}
        <Separator className="mt-4" />
      </section>

      {/* Products display section with conditional rendering */}
      <div>
        {totalProducts === 0 ? (
          // Show message when no products match search criteria
          <h5 className="mt-16 text-2xl">
            Sorry, no products matched your search criteria ...
          </h5>
        ) : layout === "grid" ? (
          // Render grid layout if selected
          <ProductsGrid products={products} />
        ) : (
          // Render list layout if selected
          <ProductsList products={products} />
        )}
      </div>
    </>
  );
}

export default ProductsContainer;
