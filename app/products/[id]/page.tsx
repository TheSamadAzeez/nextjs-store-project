import BreadCrumbs from "@/components/single-product/BreadCrumbs";
import { fetchSingleProduct, findExistingReview } from "@/utils/actions";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import FavoriteToggleButton from "@/components/products/FavoriteToggleButton";
import AddToCart from "@/components/single-product/AddToCart";
import ProductRating from "@/components/single-product/ProductRating";
import ShareButton from "@/components/single-product/ShareButton";
import ProductReviews from "@/components/reviews/ProductReviews";
import SubmitReview from "@/components/reviews/SubmitReview";
import { auth } from "@clerk/nextjs/server";

// Single Product Page Component
// Displays detailed information about a specific product
async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchSingleProduct(id);
  const { name, image, company, description, price } = product;
  const dollarsAmount = formatCurrency(price);

  const { userId } = await auth(); // get the user id from the session
  // Check if the user has already reviewed the product
  const reviewDoesNotExist =
    userId && !(await findExistingReview(userId, product.id));

  return (
    <section>
      <BreadCrumbs name={product.name} />
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        <div className="relative h-full min-h-[300px] lg:h-auto">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
            priority
            className="w-full rounded-md object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-x-8">
            <h1 className="text-3xl font-bold capitalize">{name}</h1>
            <div className="flex items-center gap-x-2">
              <FavoriteToggleButton productId={id} />
              <ShareButton productId={id} name={name} />
            </div>
          </div>
          <ProductRating productId={id} />
          <h4 className="mt-2 text-xl">{company}</h4>
          <p className="text-md mt-3 inline-block rounded-md bg-muted p-2">
            {dollarsAmount}
          </p>
          <p className="mt-6 leading-8 text-muted-foreground">{description}</p>
          <AddToCart productId={id} />
        </div>
      </div>
      <div>
        <ProductReviews productId={id} />
        {/* Display the review form if the user hasn't already reviewed the product */}
        {reviewDoesNotExist && <SubmitReview productId={id} />}
      </div>
    </section>
  );
}

export default SingleProductPage;
