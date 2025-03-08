import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Rating from "./Rating";
import Comment from "./Comment";

type ReviewCardProps = {
  reviewInfo: {
    comment: string;
    rating: number;
    name: string;
    image: string;
  };
  children?: React.ReactNode;
};

function ReviewCard({ reviewInfo, children }: ReviewCardProps) {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center">
          <Image
            src={reviewInfo.image}
            alt={reviewInfo.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <h3 className="mb-1 text-sm font-bold capitalize">
              {reviewInfo.name}
            </h3>
            <Rating rating={reviewInfo.rating} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Comment comment={reviewInfo.comment} />
      </CardContent>
      <div className="absolute right-3 top-3">{children}</div>
    </Card>
  );
}
export default ReviewCard;
