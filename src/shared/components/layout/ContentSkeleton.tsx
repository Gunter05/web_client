import { Skeleton } from "@/shared/ui/skeleton";

/** Squelette d'une page publique pendant que ses données arrivent. */
export function ContentSkeleton() {
  return (
    <div className="mx-auto grid max-w-[470px] gap-4 px-4 pt-6 md:pt-10">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
