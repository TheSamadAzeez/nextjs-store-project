import { formatCurrency } from "@/utils/format";
import { Product } from "@prisma/client";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import FavoriteToggleButton from "./FavoriteToggleButton";

/**
 * Displays a responsive grid of products with images, prices, and favorite buttons
 * @param {Object} props.products - List of products from database
 */

function ProductsGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-4 pt-12 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const { id: productId, name, price, image } = product;
        const dollarsAmount = formatCurrency(price);

        return (
          <article key={productId} className="group relative">
            {/* Card link with hover effect */}
            <Link href={`/products/${productId}`}>
              <Card className="transform transition-shadow duration-500 group-hover:shadow-lg">
                <CardContent className="p-4">
                  <div className="relative h-64 overflow-hidden rounded md:h-48">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw"
                      priority
                      // transition-transform: smooth zoom transition
                      className="w-full transform rounded object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Product details container */}
                  <div className="m-4 text-center">
                    <h2 className="text-lg capitalize">{name}</h2>
                    <p className="mt-2 text-muted-foreground">
                      {dollarsAmount}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Favorite button */}
            <div className="z-5 absolute right-7 top-7">
              <FavoriteToggleButton productId={productId} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductsGrid;
