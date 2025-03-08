import { fetchProductRating } from "@/utils/actions";
import { FaStar } from "react-icons/fa";

async function ProductRating({ productId }: { productId: string }) {
  const { rating, count } = await fetchProductRating(productId);

  const className = `flex gap-1 items-center text-md mt-1 mb-4`;
  const countValue = `(${count})`;

  return (
    <span className={className}>
      <FaStar className="h-3 w-3" />
      {rating}
      {countValue}
    </span>
  );
}
export default ProductRating;
