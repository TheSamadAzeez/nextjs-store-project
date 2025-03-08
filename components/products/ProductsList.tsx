// Import necessary dependencies
import { formatCurrency } from "@/utils/format";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@prisma/client";
import Image from "next/image";
import FavoriteToggleButton from "./FavoriteToggleButton";

// Component that renders a grid of product cards
function ProductsList({ products }: { products: Product[] }) {
  return (
    // Main container with grid layout
    <div className="mt-12 grid gap-y-8">
      {products.map((product) => {
        // Destructure product properties
        const { id: productId, name, price, image, company } = product;
        const dollarsAmount = formatCurrency(price);

        return (
          // Product card wrapper with hover effects
          <article key={productId} className="group relative">
            {/* Link to product detail page */}
            <Link href={`/products/${productId}`}>
              <Card className="transform group-hover:shadow-lg transition-shadow duration-500">
                <CardContent className="p-8 gap-y-4 grid md:grid-cols-3">
                  {/* Product image container */}
                  <div className="relative h-64 md:h-48 md:w-48">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 30vw"
                      priority
                      className="rounded object-cover "
                    />
                  </div>

                  {/* Product info section */}
                  <div>
                    <h2 className="text-xl font-semibold capitalize">{name}</h2>
                    <h4 className="text-muted-foreground">{company}</h4>
                  </div>

                  {/* Product price */}
                  <p className="text-muted-foreground text-lg md:ml-auto">
                    {dollarsAmount}
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Favorite button overlay */}
            <div className="absolute bottom-8 right-8 z-5">
              <FavoriteToggleButton productId={productId} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductsList;
