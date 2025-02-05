import { FaStar, FaRegStar } from 'react-icons/fa';

function Rating({ rating }: { rating: number }) {
  // e.g rating = 3
  // stars = [true, true, true, false, false]
  const stars = Array.from({ length: 5 }, (_, i) => i + 1 <= rating);

  return (
    <div className='flex items-center gap-x-1'>
      {stars.map((isFilled, index) => {
        const className = `w-3 h-3 ${
          isFilled ? 'text-primary' : 'text-grey-400'
        }`;
        return isFilled ? (
          <FaStar key={index} className={className} />
        ) : (
          <FaRegStar key={index} className={className} />
        );
      })}
    </div>
  );
}
export default Rating;
