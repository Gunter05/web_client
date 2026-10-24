import { TrayIcon } from "@/shared/components/icons";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-14 text-center text-sm text-muted-foreground">
      <TrayIcon className="size-8" />
      <p>{message}</p>
    </div>
  );
}
