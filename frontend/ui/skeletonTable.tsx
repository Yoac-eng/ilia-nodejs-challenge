import { Skeleton } from "./skeleton";

export function SkeletonTable() {
  return (
    <div className="flex w-full flex-col gap-3 py-1">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="grid grid-cols-12 items-center gap-3" key={index}>
          <Skeleton className="col-span-4 h-4" />
          <Skeleton className="col-span-3 h-4" />
          <Skeleton className="col-span-3 h-4" />
          <Skeleton className="col-span-2 h-4" />
        </div>
      ))}
    </div>
  );
}
