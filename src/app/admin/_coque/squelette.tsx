import { Skeleton } from "@/shared/ui/skeleton";

export function SqueletteAdmin() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
