import { Skeleton } from "../ui/skeleton";

function LoadingTable({ rows = 5 }: { rows?: number }) {
  // create an array of rows with the length of the rows prop
  const tableRows = Array.from({ length: rows }, (_, index) => {
    return (
      <div className="mb-4" key={index}>
        <Skeleton className="h-8 w-full rounded" />
      </div>
    );
  });
  return <>{tableRows}</>;
}
export default LoadingTable;
