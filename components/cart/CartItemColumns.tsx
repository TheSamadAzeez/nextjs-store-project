import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";

// Component to render the first column with product image
export const FirstColumn = ({
  name,
  image,
}: {
  name: string;
  image: string;
}) => {
  return (
    <div className="relative h-24 w-24 sm:h-32 sm:w-32">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw,33vw"
        priority
        className="w-full rounded-md object-cover"
      />
    </div>
  );
};

// Component to render the second column with product name and company
export const SecondColumn = ({
  name,
  company,
  productId,
}: {
  name: string;
  company: string;
  productId: string;
}) => {
  return (
    <div className="sm:w-48">
      <Link href={`/products/${productId}`}>
        <h3 className="font-medium capitalize hover:underline">{name}</h3>
      </Link>
      <h4 className="mt-2 text-xs capitalize">{company}</h4>
    </div>
  );
};

// Component to render the fourth column with product price
export const FourthColumn = ({ price }: { price: number }) => {
  return <div className="font-medium md:ml-auto">{formatCurrency(price)}</div>;
};
